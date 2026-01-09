export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/models/User";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key", {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get priceId from request body (sent by the button)
    const { priceId } = await req.json();

    // Fallback to Env variable if body is empty
    const finalPriceId =
      priceId ||
      "price_1Sj1ktFlSQA8kdoEZc07o9QV" ||
      process.env.STRIPE_PRO_PRICE_ID;

    if (!finalPriceId) {
      console.error(
        "No Price ID provided in request or environment variables."
      );
      return NextResponse.json(
        { error: "Configuration Error: Price ID missing." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ where: { email: session.user.email } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: finalPriceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/account?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/account?canceled=true`,
      customer_email: user.email,
      client_reference_id: user.id,
      subscription_data: {
        metadata: {
          userId: user.id, 
        },
      },
      metadata: {
        userId: user.id,
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("STRIPE_CHECKOUT_ERROR:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Error" },
      { status: 500 }
    );
  }
}
