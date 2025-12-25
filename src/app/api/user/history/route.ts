// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/route";
// import SearchHistory from "@/lib/models/SearchHistory";
// import { connectDB } from "@/lib/db";

// export async function GET() {
//   try {
//     await connectDB();
//     const session = await getServerSession(authOptions);

//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const history = await SearchHistory.findAll({
//       where: { userId: (session.user as any).id },
//       order: [['createdAt', 'DESC']], // Newest first
//       limit: 50 // Keep it performant
//     });

//     return NextResponse.json(history);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
//   }
// }