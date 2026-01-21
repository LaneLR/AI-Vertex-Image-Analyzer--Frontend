export const dynamic = 'force-dynamic';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const existingUser = await User.findOne({ where: { email }});

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }

      const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      existingUser.password = password; // Update in case they changed it
      existingUser.verificationCode = newOtpCode;
      await existingUser.save();

      await sendVerificationEmail(email, newOtpCode);
      return NextResponse.json({ message: "New verification code sent to your email" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await User.create({
      email,
      password,
      verificationCode: otpCode,
      isVerified: false,
      subscriptionStatus: "basic",
      dailyScansCount: 0,
    });

    await sendVerificationEmail(email, otpCode);
    return NextResponse.json({ message: "Verification code sent" });

  } catch (error: any) {
    console.error("REGISTRATION_ERROR:", error);
    return NextResponse.json({ 
      error: "An error occurred during registration. Please try again." 
    }, { status: 500 });
  }
}
