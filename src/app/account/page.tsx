import AccountClient from "@/components/AccountClient";
import { cookies } from "next/headers";
import User from "../../lib/models/User";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findByPk(decoded.id);
    return user ? user.toJSON() : null;
  } catch (error) {
    return null;
  }
}

export default async function AccountPage() {
  const user = await getAuthUser();

  // If no user is found, redirect to login for security
  if (!user) {
    redirect("/login");
  }

  // Fetch real history here in the future
  const mockHistory = [
    { id: 1, item: "Vintage Levi's 501", price: "$45-60", date: "2h ago" },
    { id: 2, item: "Nike Air Max 97", price: "$110-140", date: "Yesterday" },
    { id: 3, item: "Pyrex Butterfly Gold", price: "$25-40", date: "Dec 18" },
  ];

  return <AccountClient user={user} history={mockHistory} />;
}