import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/lib/models/User";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { darkMode } = await req.json();

  if (!session.user.email || typeof session.user.email !== "string") {
    return NextResponse.json({ error: "Invalid user email" }, { status: 400 });
  }

  try {
    await User.update(
      { darkMode },
      { where: { email: session.user.email } }
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}