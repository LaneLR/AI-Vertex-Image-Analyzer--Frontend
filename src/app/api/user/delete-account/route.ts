import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findByPk(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Check for Active Subscription
    // We assume 'pro' status means they have an active recurring sub.
    // If you have a specific 'stripeSubscriptionId', check that too.
    if (user.subscriptionStatus === "pro") {
      return NextResponse.json(
        { 
          error: "ACTIVE_SUBSCRIPTION", 
          message: "Please cancel your active subscription before deleting your account." 
        }, 
        { status: 400 }
      );
    }

    // 2. Soft Delete (Set to Inactive)
    // You may need to add an 'isActive' boolean column to your Sequelize User model
    await user.update({
      isActive: false,
      // Optional: Clear sensitive data but keep the email for recovery
    });

    return NextResponse.json({ success: true, message: "Account inactivated successfully." });

  } catch (error) {
    console.error("Account Deletion Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}