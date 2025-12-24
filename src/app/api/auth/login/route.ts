// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from 'next/server';
import User from '../../../../lib/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2. Check password (using the method we added to the Model)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' } // Long-lived for mobile persistence
    );

    // 4. Set Cookie and Return Response
    const response = NextResponse.json({ 
      message: "Login successful",
      user: user.toJSON() // Strips password
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}