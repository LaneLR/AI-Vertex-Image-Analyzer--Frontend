export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import SearchHistory from "@/lib/models/SearchHistory";
import User from "@/lib/models/User";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  // 1. Authentication Check
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Fetch the user ID first (assuming your SearchHistory's table uses userId as a foreign key)
    const user = await User.findOne({ 
      where: { email: session.user.email },
      attributes: ['id'] 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Delete all SearchHistory's belonging to this user
    const deletedCount = await SearchHistory.destroy({
      where: { userId: user.id }
    });

    return NextResponse.json({ 
      success: true, 
      message: `${deletedCount} records cleared.` 
    });
    
  } catch (err) {
    console.error("Clear history error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}