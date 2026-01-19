import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import "@/styles/main.scss";
import ClientWrapper from "../components/ClientWrapper";
import Providers from "@/components/SessionProvider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "FlipSavvy | AI Thrift Appraisal",
  description: "Identify and value thrift finds instantly with AI",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" className="global" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const darkMode = localStorage.getItem('darkMode');
                  if (darkMode === 'true' || (!darkMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {/* 3. Wrap everything in your custom Providers component */}
        <Providers>
          <ClientWrapper user={session?.user}>{children}</ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
