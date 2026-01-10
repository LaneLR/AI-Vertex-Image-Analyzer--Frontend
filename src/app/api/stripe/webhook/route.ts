// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const dynamic = "force-dynamic";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import User from "@/lib/models/User";
// import { connectDB } from "@/lib/db";
// import { sendEmail } from "@/lib/mail";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key", { 
//   apiVersion: "2024-12-18.acacia" as any 
// });

// export async function POST(req: Request) {
//   const buf = await req.arrayBuffer();
//   const signature = req.headers.get("stripe-signature")!;
//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

//   let event: Stripe.Event;
//   try {
//     event = stripe.webhooks.constructEvent(Buffer.from(buf), signature, webhookSecret);
//   } catch (err: any) {
//     console.error(`❌ Webhook Signature Error: ${err.message}`);
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//   }

//   await connectDB();

//   try {
//     switch (event.type) {
//       case "checkout.session.completed": {
//         const session = event.data.object as Stripe.Checkout.Session;
//         const userId = session.client_reference_id;

//         console.log(`DEBUG: Processing Checkout for UserID: ${userId}`);

//         // Safe UUID lookup
//         const user = await User.findByPk(userId as string);

//         if (!user) {
//           console.error(`❌ USER NOT FOUND: Checked ID ${userId}. Search DB manually to verify UUID format.`);
//           break; 
//         }

//         const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
//         await user.update({
//           subscriptionStatus: 'pro',
//           paymentProvider: 'stripe',
//           providerCustomerId: session.customer as string,
//           providerSubscriptionId: subscription.id,
//           subscriptionEndDate: new Date((subscription as any)["current_period_end"] * 1000),
//           cancelAtPeriodEnd: false
//         });

//         console.log(`✅ SUCCESS: User ${user.email} is now PRO.`);
//         break;
//       }

//       case "customer.subscription.updated": {
//         const sub = event.data.object as Stripe.Subscription;
//         const userId = sub.metadata.userId; 
        
//         const user = userId 
//           ? await User.findByPk(userId) 
//           : await User.findOne({ where: { providerSubscriptionId: sub.id } });

//         if (user) {
//           await user.update({
//             subscriptionStatus: sub.status === "active" ? 'pro' : 'basic',
//             cancelAtPeriodEnd: sub.cancel_at_period_end,
//             subscriptionEndDate: new Date((sub as any)["current_period_end"] * 1000),
//           });
//           console.log(`ℹ️ Subscription updated for ${user.email}`);
//         }
//         break;
//       }
//     }
//   } catch (error: any) {
//     console.error("❌ WEBHOOK ERROR:", error.message);
//     return NextResponse.json({ error: "Internal Error" }, { status: 500 });
//   }

//   return NextResponse.json({ received: true });
// }

import { NextResponse } from "next/server";
import Stripe from "stripe";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  // 1. Lazy Initialize Stripe to prevent build-time crashes
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    apiVersion: "2024-12-18.acacia" as any,
  });

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook Signature Error: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectDB();

  // 2. Map your Stripe Price IDs to your database tiers
  const getTierFromPriceId = (priceId: string): "hobby" | "pro" | "basic" => {
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) return "pro";
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_HOBBY_PRICE_ID) return "hobby";
    return "basic";
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;

        if (!userId) break;

        const user = await User.findByPk(userId);
        if (!user) break;

        // Retrieve the subscription and the specific price item
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0].price.id;
        const tier = getTierFromPriceId(priceId);

        await user.update({
          subscriptionStatus: tier,
          paymentProvider: 'stripe',
          providerCustomerId: session.customer as string,
          providerSubscriptionId: subscription.id,
          subscriptionEndDate: new Date((subscription as any)["current_period_end"] * 1000),
          cancelAtPeriodEnd: false
        });

        console.log(`✅ User ${user.email} upgraded to ${tier.toUpperCase()}`);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        
        const user = await User.findOne({ where: { providerSubscriptionId: sub.id } });

        if (user) {
          const isDeleted = event.type === "customer.subscription.deleted";
          const isActive = sub.status === "active";
          
          // Determine tier if still active
          const priceId = sub.items.data[0].price.id;
          const tier = isActive && !isDeleted ? getTierFromPriceId(priceId) : "basic";

          await user.update({
            subscriptionStatus: tier,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            subscriptionEndDate: new Date((sub as any)["current_period_end"] * 1000),
          });
          console.log(`ℹ️ Subscription synced: ${user.email} is now ${tier}`);
        }
        break;
      }
    }
  } catch (error: any) {
    console.error("❌ WEBHOOK ERROR:", error.message);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}