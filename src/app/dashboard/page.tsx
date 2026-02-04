import HomeClient from "@/components/HomeClient";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard | ResaleIQ",
  description: "Identify and appraise items instantly.",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <HomeClient />
    </Suspense>
  );
}
