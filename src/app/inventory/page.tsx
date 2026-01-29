import InventoryClient from "@/components/InventoryClient";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export const metadata = {
  title: "Inventory | ThriftSavvy",
  description: "Manage your business inventory and track potential profits.",
};

export default function InventoryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <InventoryClient />;
    </Suspense>
  );}
