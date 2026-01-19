"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/Loading";
import WebHome from "@/components/WebHomepageClient";
import LoginClient from "@/components/LoginClient";

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If a user lands here and IS logged in, send them to dashboard.
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return <Loading />;

  // Only show the landing page to unauthenticated Web users.
  // Middleware handles mobile redirect, so they never get here.
  return <LoginClient />;
}
