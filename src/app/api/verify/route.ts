import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    const user = await User.findOne({ where: { email, verificationCode: code } });

    if (!user) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    user.isVerified = true;
    user.verificationCode = ''; 
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}