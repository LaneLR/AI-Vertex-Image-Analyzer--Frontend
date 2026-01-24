import UnifiedAuthPage from "@/components/AuthPage";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export const metadata = {
  title: "Login or Register | Flip Savvy",
  description: "Login or register an account.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <UnifiedAuthPage />;
    </Suspense>
  );}
