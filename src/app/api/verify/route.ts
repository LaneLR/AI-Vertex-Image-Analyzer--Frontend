import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, code } = await req.json();

    // 1. Find the unverified user
    const user = await User.findOne({ where: { email, verificationCode: code } });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    // 2. Mark as verified and CLEAR the code
    user.isVerified = true;
    user.verificationCode = ''; 
    await user.save();

    return NextResponse.json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("VERIFY_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}