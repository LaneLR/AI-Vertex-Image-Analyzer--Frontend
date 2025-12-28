// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/models/User";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" as any });

export async function POST() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await User.findOne({ where: { email: session.user.email } });
    
    // Check if the user actually has a Stripe Customer ID yet
    if (!user || !user.providerCustomerId) {
      return NextResponse.json({ 
        error: "No billing profile found. You need an active subscription to manage billing." 
      }, { status: 400 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.providerCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error("PORTAL_ERROR:", error.message);
    return NextResponse.json({ error: "Could not open billing portal." }, { status: 500 });
  }
}