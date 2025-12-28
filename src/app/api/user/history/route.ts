import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SearchHistory from "@/lib/models/SearchHistory";
import { connectDB } from "@/lib/db";

export const dynamic = "force-dynamic"; 

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await SearchHistory.findAll({
      where: { userId: session.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50 
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("History Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}