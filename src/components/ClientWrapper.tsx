"use client";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import Header from "@/components/Header";

interface ClientWrapperProps {
  children: React.ReactNode;
}

// 1. Create a sub-component for the search params logic
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null; // This component doesn't render anything
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <div>
      {/* 2. Wrap the search-dependent component in Suspense */}
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      
      <div className="main-content-wrapper">{children}</div>
      <Header />
    </div>
  );
}