import { NextResponse } from 'next/server';
import User from '@/lib/models/User';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email, password, firstName } = await req.json();
    
    // 1. Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Create unverified user
    await User.create({
      email,
      password, // Hooks in User.ts will hash this
      firstName,
      verificationCode: otpCode,
      isVerified: false
    });

    // 3. Send Email
    await sendVerificationEmail(email, otpCode);

    return NextResponse.json({ message: "Verification code sent" });
  } catch (error: any) {
    console.error("REGISTRATION_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}