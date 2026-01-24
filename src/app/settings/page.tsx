import Loading from "@/components/Loading";
import SettingsClient from "@/components/SettingsClient";
import { Suspense } from "react";

export const metadata = {
  title: "Settings | Flip Savvy",
  description: "Adjust your account settings.",
};

export default async function SettingsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SettingsClient />;
    </Suspense>
  );}
