// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  let newUser;
  try {
    // Ensure DB is connected and synced
    await connectDB();
    const { email, password } = await req.json();

    

    // 1. Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Create unverified user (firstName removed)
    newUser = await User.create({
      email,
      password,
      verificationCode: otpCode,
      isVerified: false,
      subscriptionStatus: "basic",
      dailyScansCount: 0,
    });

    // 3. Send Email
    await sendVerificationEmail(email, otpCode);

    return NextResponse.json({ message: "Verification code sent" });
    } catch (error: any) {
    // 4. CLEANUP: If the email fails, delete the user so they can try again
    if (newUser) {
      await newUser.destroy();
    }
    
    console.error("REGISTRATION_ERROR:", error);
    return NextResponse.json({ 
      error: "Failed to send verification email. Please check your email address." 
    }, { status: 500 });
  }
}
