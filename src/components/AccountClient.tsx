// src/components/AccountClient.tsx
"use client";

import React, { useEffect, useState } from "react";
// Removed dailyScansUsed from useApp since we'll use session
import { useApp } from "@/context/AppContext"; 
import {
  User as UserIcon,
  History,
  ChevronRight,
  Zap,
  ArrowLeft,
  Settings,
} from "lucide-react";
import Link from "next/link";
import SubscribeButton from "@/components/SubscribeButton";
import { Capacitor } from "@capacitor/core";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

interface AccountClientProps {
  user: any; 
  history: any[];
}

export default function AccountClient({ user: initialUser, history }: AccountClientProps) {
  // Pull maxFreeScans from context, but we will get usage from session
  const { maxFreeScans } = useApp(); 
  const [isNative, setIsNative] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  // Priority: Session Data > Initial Server Data
  const user = session?.user || initialUser;
  
  // Get scans from session (cast to any or use your interface)
  const dailyScansUsed = (session?.user as any)?.dailyScansCount || 0;

  useEffect(() => {
    // Refresh session if coming back from successful stripe payment
    if (success === "true") {
      update();
    }
  }, [success, update]);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  const isPro = user.subscriptionStatus?.toLowerCase() === "pro";
  
  // Calculate percentage based on database value
  const usagePercentage = Math.min((dailyScansUsed / maxFreeScans) * 100, 100);

  const handleManageSubscription = async () => {
    if (isNative) {
      window.open("https://apps.apple.com/account/subscriptions", "_blank");
      return;
    }

    setLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Failed to open portal", err);
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <main className="account">
      {/* ... Navigation remains same ... */}
      <nav className="account__nav">
        <Link href="/" className="account__nav-back">
          <ArrowLeft className="account__nav-back-icon" />
        </Link>
        <h1 className="account__nav-title">ACCOUNT</h1>
      </nav>

      <div className="account__container">
        {/* PROFILE SECTION */}
        <div className="account__profile">
          <div className="account__profile-avatar">
            <UserIcon className="account__profile-avatar-icon" />
          </div>
          <div>
            <h2 className="account__profile-name">{user.email}</h2>
            <p className="account__profile-tier">
              {isPro ? "Pro Member" : "Basic Member"}
            </p>
          </div>
        </div>

        {/* SUBSCRIPTION STATUS CARD */}
        <section className="account__section">
          <h3 className="account__section-title">Subscription</h3>
          
          <div className={`account__plan-card ${isPro ? 'account__plan-card--pro' : 'account__plan-card--free'}`}>
            {/* ... Plan Header remains same ... */}
            <div className="account__plan-header">
               <span className={`account__plan-badge ${isPro ? 'account__plan-badge--pro' : 'account__plan-badge--free'}`}>
                  {isPro ? 'Pro Tier' : 'Free Tier'}
               </span>
                <Zap
                  fill={isPro ? "#3b82f6" : "#94a3b8"}
                  className={`account__plan-icon ${isPro ? "account__plan-icon--pro" : ""}`}
                />
            </div>

            {isPro ? (
              <div className="account__pro-details">
                <p className="account__pro-msg">Unlimited AI Appraisals Active</p>
                {user.cancelAtPeriodEnd && user.subscriptionEndDate && (
                  <p className="account__cancel-notice">
                    Ends on: {new Date(user.subscriptionEndDate).toLocaleDateString()}
                  </p>
                )}
                <button 
                  className="account__manage-btn" 
                  onClick={handleManageSubscription}
                  disabled={loadingPortal}
                >
                  <Settings size={16} />{" "}
                  {loadingPortal ? "Loading..." : "Manage Subscription"}
                </button>
              </div>
            ) : (
              <div className="account__usage-meter">
                <div className="account__usage-meter-header">
                  <span>Daily Usage</span>
                  <span className="account__usage-meter-count">
                    {/* Displaying DB value from session */}
                    {dailyScansUsed} / {maxFreeScans}
                  </span>
                </div>
                <div className="account__usage-meter-bar-bg">
                  <div 
                    className="account__usage-meter-bar" 
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
                
                <div className="account__cta-wrapper">
                   <SubscribeButton 
                    priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!} 
                    isPro={isPro} 
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ... History and Logout remain same ... */}
        <section className="account__section">
          <div className="account__section-header">
            <h3 className="account__section-title">Recent History</h3>
            <Link href="/history" className="account__view-all-btn">VIEW ALL</Link>
          </div>
          <div className="account__history-card">
            {history.length > 0 ? history.map((search) => (
              <div key={search.id} className="account__history-row">
                <div className="account__history-row-info">
                  <div className="account__history-row-icon-bg">
                    <History className="account__history-row-icon" />
                  </div>
                  <div>
                    <p className="account__history-row-label">{search.itemName}</p>
                    <p className="account__history-row-date">
                      {new Date(search.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="account__history-row-meta">
                  <span className="account__history-row-price">${search.estimatedValue}</span>
                  <ChevronRight className="account__history-row-chevron" />
                </div>
              </div>
            )) : (
              <p className="account__no-history">No appraisals yet.</p>
            )}
          </div>
        </section>

        <button className="account__logout-btn" onClick={() => window.location.href = '/api/auth/signout'}>
          Log Out
        </button>
      </div>
    </main>
  );
}