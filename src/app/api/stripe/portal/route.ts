import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/lib/models/User";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function POST() {
  try {
    // 1. MUST await the connection before running any queries
    await connectDB(); 

    // 2. Get the session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Find user in the database
    const user = await User.findOne({ where: { email: session.user.email } });

    // 4. Safety check: User must exist and have a Stripe ID
    if (!user) {
      return NextResponse.json({ error: "User record not found." }, { status: 404 });
    }

    if (!user.stripeCustomerId) {
      return NextResponse.json({ 
        error: "No billing profile found. You must be a subscriber to access the portal." 
      }, { status: 400 });
    }

    // 5. Create Stripe Portal Session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/settings`,
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error: any) {
    console.error("STRIPE_PORTAL_ERROR:", error); // Log the actual error for debugging
    return NextResponse.json({ error: "Could not open billing portal." }, { status: 500 });
  }
}