import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path to where your authOptions are
import { redirect } from "next/navigation";
import AccountClient from "@/components/AccountClient";

export default async function AccountPage() {
  // 1. Get the session using NextAuth's official method
  const session = await getServerSession(authOptions);

  // 2. If no session, redirect to login
  if (!session) {
    console.log("[account/page.tsx] No session found. Redirecting to /login.");
    redirect("/login");
  }

  // 3. session.user contains the logged-in user data
  console.log("[account/page.tsx] Session found for:", session.user?.email);

  const mockHistory = [
    { id: 1, item: "Vintage Levi's 501", price: "$45-60", date: "2h ago" },
    { id: 2, item: "Nike Air Max 97", price: "$110-140", date: "Yesterday" },
  ];

  // Pass session.user to your client component
  return <AccountClient user={session.user} history={mockHistory} />;
}
