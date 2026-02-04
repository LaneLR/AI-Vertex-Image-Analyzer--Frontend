import InventoryClient from "@/components/InventoryClient";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export const metadata = {
  title: "Inventory | ResaleIQ",
  description: "Manage your inventory and track potential profits.",
};

export default function InventoryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <InventoryClient />;
    </Suspense>
  );}
