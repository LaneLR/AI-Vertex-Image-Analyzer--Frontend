// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";
import { sendEmail } from "@/lib/mail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key", { 
  apiVersion: "2024-12-18.acacia" as any 
});

export async function POST(req: Request) {
  const buf = await req.arrayBuffer();
  const signature = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook Signature Error: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectDB();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;

        console.log(`DEBUG: Processing Checkout for UserID: ${userId}`);

        // Safe UUID lookup
        const user = await User.findByPk(userId as string);

        if (!user) {
          console.error(`❌ USER NOT FOUND: Checked ID ${userId}. Search DB manually to verify UUID format.`);
          break; 
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
        await user.update({
          subscriptionStatus: 'pro',
          paymentProvider: 'stripe',
          providerCustomerId: session.customer as string,
          providerSubscriptionId: subscription.id,
          subscriptionEndDate: new Date((subscription as any)["current_period_end"] * 1000),
          cancelAtPeriodEnd: false
        });

        console.log(`✅ SUCCESS: User ${user.email} is now PRO.`);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata.userId; 
        
        const user = userId 
          ? await User.findByPk(userId) 
          : await User.findOne({ where: { providerSubscriptionId: sub.id } });

        if (user) {
          await user.update({
            subscriptionStatus: sub.status === "active" ? 'pro' : 'basic',
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            subscriptionEndDate: new Date((sub as any)["current_period_end"] * 1000),
          });
          console.log(`ℹ️ Subscription updated for ${user.email}`);
        }
        break;
      }
    }
  } catch (error: any) {
    console.error("❌ WEBHOOK ERROR:", error.message);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}