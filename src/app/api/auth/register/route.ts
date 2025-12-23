import { NextResponse } from 'next/server';
import User from '../../../../lib/models/User';

export async function POST(req: Request) {
  try {
    const { email, password, firstName } = await req.json();

    // 1. Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // 3. Create User (Sequelize hook handles hashing)
    const newUser = await User.create({
      email,
      password,
      firstName,
      subscriptionStatus: 'basic'
    });

    // 4. Return success (toJSON strips the password)
    return NextResponse.json({ 
      message: "User created successfully", 
      user: newUser 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}