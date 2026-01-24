"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/Loading";
import UnifiedAuthPage from "@/components/AuthPage";
import { useApp } from "@/context/AppContext"; 
import { Capacitor } from "@capacitor/core";

export default function Page() {
  const { user, isLoading } = useApp(); 
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const isApp = Capacitor.getPlatform() !== "web";
    
    if (isApp) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="loading-state">
        <Loading />
      </div>
    );
  }

  return <UnifiedAuthPage />;
}