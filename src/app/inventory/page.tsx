import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import InventoryClient from "@/components/InventoryClient";
import SearchHistory from "@/lib/models/SearchHistory";
import { connectDB } from "@/lib/db";

export const metadata = {
  title: "Inventory | Flip Savvy",
  description: "Manage your business inventory and track potential profits.",
};

export default async function InventoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session?.user?.subscriptionStatus !== "business") {
    redirect("/account");
  }

  await connectDB();

  const inventoryData = await SearchHistory.findAll({
    where: {
      userId: session.user.id,
      inInventory: true,
    },
    order: [["updatedAt", "DESC"]],
  });

  const initialItems = inventoryData.map((item) => ({
    id: item.id.toString(),
    itemTitle: item.itemTitle,
    priceRange: item.priceRange,
    description: item.description,
    grade: item.grade,
    platform: item.platform,
    specs: item.specs || {},
  }));

  return <InventoryClient initialItems={initialItems} />;
}
