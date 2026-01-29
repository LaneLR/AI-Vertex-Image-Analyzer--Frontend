import { Suspense } from "react";
import PrivacyClient from "../../components/PrivacyClient";
import Loading from "@/components/Loading";

export const metadata = {
  title: "Privacy Policy | ThriftSavvy",
  description:
    "Learn how ThriftSavvy protects your data and manages your uploaded images.",
};

export default function PrivacyPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PrivacyClient />;
    </Suspense>
  );}
