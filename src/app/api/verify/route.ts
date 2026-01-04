import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, otp, type } = await req.json();

    const user = await User.findOne({ where: { email }});
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.verificationCode !== otp) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    if (type === "verify") {
      user.isVerified = true;
      user.verificationCode = '';
      await user.save();
      return NextResponse.json({ message: "Account verified successfully" });
    }

    return NextResponse.json({ message: "Account verified successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}