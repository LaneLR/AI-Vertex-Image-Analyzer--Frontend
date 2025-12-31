"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext"; 
import {
  User as UserIcon,
  History,
  ChevronRight,
  Zap,
  ArrowLeft,
  Settings,
  Wand2,
  LogOut,
  ShieldCheck,
  HistoryIcon
} from "lucide-react";
import Link from "next/link";
import SubscribeButton from "@/components/SubscribeButton";
import { Capacitor } from "@capacitor/core";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function AccountClient({ user: initialUser, history }: { user: any, history: any[] }) {
  const { maxFreeScans } = useApp(); 
  const [isNative, setIsNative] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const user = session?.user || initialUser;
  const dailyScansUsed = (user as any)?.dailyScansCount || 0;

  useEffect(() => {
    if (success === "true") update();
  }, [success, update]);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  const isPro = user?.subscriptionStatus?.toLowerCase() === "pro";
  const usagePercentage = Math.min((dailyScansUsed / maxFreeScans) * 100, 100);
  const recentHistory = history.slice(0, 3);

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
    <main className="account-page">
      <header className="account-page__header">
        <Link href="/" className="back-btn">
          <ArrowLeft size={20} />
        </Link>
        <h1>Account Settings</h1>
        <button className="logout-icon-btn" onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut size={20} />
        </button>
      </header>

      <div className="account-page__content">
        {/* PROFILE IDENTIFIER */}
        <section className="profile-hero">
          <div className="profile-hero__avatar">
            <UserIcon size={32} />
            {isPro && <div className="pro-badge-dot"><Zap size={10} fill="currentColor" /></div>}
          </div>
          <div className="profile-hero__info">
            <h2>{user?.email}</h2>
            <span className={`status-pill ${isPro ? 'status-pill--pro' : ''}`}>
              {isPro ? <ShieldCheck size={12} /> : null}
              {isPro ? "Pro Member" : "Basic Account"}
            </span>
          </div>
        </section>

        {/* SUBSCRIPTION CARD */}
        <section className="account-card subscription-card">
          <div className="account-card__header">
            <h3>{isPro ? "Your Subscription" : "Upgrade to Pro"}</h3>
            <Zap size={18} className={isPro ? "icon-gold" : "icon-gray"} />
          </div>
          
          {isPro ? (
            <div className="subscription-content">
              <p>You have full access to Unlimited Appraisals and the Listing Studio.</p>
              <button className="secondary-btn" onClick={handleManageSubscription} disabled={loadingPortal}>
                <Settings size={14} /> {loadingPortal ? "Loading..." : "Billing Settings"}
              </button>
            </div>
          ) : (
            <div className="usage-content">
              <div className="usage-stats">
                <span>Daily Scans Used</span>
                <span className="usage-count">{dailyScansUsed} / {maxFreeScans}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${usagePercentage}%` }} />
              </div>
              <p className="usage-hint">Get unlimited scans and the listing generator with Pro.</p>
              <SubscribeButton priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!} isPro={isPro} />
            </div>
          )}
        </section>

        {/* PRO TOOLS SHORTCUT */}
        {isPro && (
          <Link href="/listing" className="account-card listing-shortcut">
            <div className="shortcut-info">
              <Wand2 size={20} />
              <div>
                <h4>Listing Studio</h4>
                <p>Generate SEO marketplace details</p>
              </div>
            </div>
            <ChevronRight size={18} />
          </Link>
        )}

        <Link href="/history" className="account-card listing-shortcut">
          <div className="shortcut-info">
            <HistoryIcon size={20} />
            <div>
              <h4>Scan History</h4>
              <p>View your recent scans</p>
            </div>
          </div>
          <ChevronRight size={18} />
        </Link>

        {/* RECENT HISTORY */}
        <section className="history-preview">
          <div className="section-header">
            <h3>Recent Activity</h3>
            {/* <Link href="/history">View All</Link> */}
          </div>
          <div className="history-list card">
            {recentHistory.length > 0 ? recentHistory.map((item) => (
              <Link href="/history" key={item.id} className="history-item">
                <div className="history-item__main">
                   <div className="item-icon"><History size={16} /></div>
                   <div className="item-text">
                     <p className="item-title">{item.itemTitle}</p>
                     <p className="item-date">{new Date(item.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>
                <div className="item-meta">
                  <span className="item-price">{item.priceRange}</span>
                  <ChevronRight size={16} />
                </div>
              </Link>
            )) : (
              <div className="empty-history">Your recent appraisals will appear here.</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}