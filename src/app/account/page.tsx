import { Suspense } from "react";
import AccountClient from "@/components/AccountClient";
import Loading from "@/components/Loading"; 

export const metadata = {
  title: "Account | Flip Savvy",
  description: "Your account details.",
};

export default function AccountPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AccountClient />
    </Suspense>
  );
}