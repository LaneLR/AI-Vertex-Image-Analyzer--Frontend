// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth";
// import { authOptions } from "./api/auth/[...nextauth]/route";
// import WebHome from "@/components/WebHomepageClient";

// export default async function Page() {
//   const session = await getServerSession(authOptions);
//   const headerList = await headers();
//   const userAgent = headerList.get("user-agent") || "";

//   // 1. If the user is already logged in, take them to the app dashboard
//   if (session) {
//     redirect("/dashboard"); // or wherever your main app lives
//   }

//   // 2. Detection Logic
//   // Capacitor apps usually contain 'Capacitor' in the UA if configured, 
//   // or we can check for mobile devices to force the login view.
//   const isMobileApp = userAgent.includes("FlipFinder-Mobile-App");

//   if (isMobileApp) {
//     // Mobile users (App) go straight to login
//     redirect("/login");
//   }

//   // 3. Web users see the Landing Page
//   return <WebHome />;
// }

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import WebHome from "@/components/WebHomepageClient";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") return <Loading />;

  if (status === "unauthenticated") {
    return <WebHome />;
  }

  return <Loading />;
}