import React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/main.scss";
import ClientWrapper from "../components/ClientWrapper";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from "@/context/AppContext";
import { PHProvider } from "@/providers/PosthogProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "ResaleIQ | Item Appraisal",
  description: "Identify and value items instantly with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="global" suppressHydrationWarning>
      <head>
        <meta
          name="theme-color"
          content="#eeeeee"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#121212"
          media="(prefers-color-scheme: dark)"
        />
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
        <PHProvider>
          <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
            <AppProvider>
              <ClientWrapper>{children}</ClientWrapper>
            </AppProvider>
          </GoogleOAuthProvider>
        </PHProvider>
      </body>
    </html>
  );
}
