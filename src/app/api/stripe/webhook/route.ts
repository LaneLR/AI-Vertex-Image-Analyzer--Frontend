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

// Use the latest stable API version or match your dashboard
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(req: Request) {
  // 1. Get the RAW body as text - crucial for signature verification
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  // Ensure you have the LIVE webhook secret from Stripe Dashboard in your Render env
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("❌ Missing stripe-signature or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // 2. Construct the event using the raw text body
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook Signature Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  await connectDB();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Ensure you passed this ID when creating the checkout session!
        const userId = session.client_reference_id;

        if (!userId) {
          console.error("❌ No client_reference_id found in session");
          break;
        }

        const user = await User.findByPk(userId);
        if (!user) {
          console.error(`❌ User ${userId} not found in database`);
          break;
        }

        // Retrieve subscription details to get the end date
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        await user.update({
          subscriptionStatus: "pro",
          paymentProvider: "stripe",
          providerCustomerId: session.customer as string,
          providerSubscriptionId: subscription.id,
          subscriptionEndDate: new Date((subscription as any)["current_period_end"] * 1000),
          cancelAtPeriodEnd: false,
        });

        console.log(`✅ User ${user.email} upgraded to PRO`);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user by subscription ID if metadata isn't available
        const user = await User.findOne({ 
          where: { providerSubscriptionId: subscription.id } 
        });

        if (user) {
          const isDeleted = event.type === "customer.subscription.deleted";
          const isActive = subscription.status === "active";

          await user.update({
            subscriptionStatus: (isActive && !isDeleted) ? "pro" : "basic",
            subscriptionEndDate: new Date((subscription as any)["current_period_end"] * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          });
          console.log(`ℹ️ Subscription status for ${user.email}: ${subscription.status}`);
        }
        break;
      }
    }
  } catch (error: any) {
    console.error("❌ Webhook processing failed:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}