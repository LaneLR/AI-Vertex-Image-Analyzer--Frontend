import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SearchHistory from "@/lib/models/SearchHistory";
import { connectDB } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const deletedCount = await SearchHistory.destroy({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (deletedCount === 0) {
      return NextResponse.json(
        { error: "Scan not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Scan deleted successfully" });
  } catch (error) {
    console.error("Delete History Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}