import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  console.log("CONNECT DB1")
  try {
    console.log("CONNECT DB2")
    await connectDB();
    const { email, otp } = await req.json();

    const user = await User.findOne({ where: { email }});
console.log("FIND USER")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
console.log("USER FOUND")
    if (user.verificationCode !== otp) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }
console.log("VALID CODE")
    // Success: Flip the flag and clear the code
    user.isVerified = true;
    user.verificationCode = '';
    await user.save();
console.log("SAVE VERIFIED IN DB")
    return NextResponse.json({ message: "Account verified successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}