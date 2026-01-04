import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { sendResetPasswordEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, action, otp, newPassword } = await req.json();
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with that email." },
        { status: 404 }
      );
    }

    // Phase 1: Request the reset
    if (action === "request") {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationCode = code;
      await user.save();

      await sendResetPasswordEmail(email, code);
      return NextResponse.json({ message: "Reset code sent to email" });
    }

    // Phase 2: Finalize the reset (after OTP is validated)
    if (action === "reset") {
      if (!otp || user.verificationCode !== otp) {
        return NextResponse.json(
          { error: "Invalid or expired session." },
          { status: 400 }
        );
      }
      user.password = newPassword;
      user.verificationCode = "";

      await user.save();

      return NextResponse.json({ message: "Password updated successfully" });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
