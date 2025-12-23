"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  User as UserIcon,
  History,
  ChevronRight,
  Zap,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface AccountClientProps {
  user: any;
  history: any[];
}

export default function AccountClient({ user, history }: AccountClientProps) {
  // Use context for local UI state/demo toggling
  const { isSubscriber, setIsSubscriber, dailyScansUsed, maxFreeScans } = useApp();

  const usagePercentage = Math.min((dailyScansUsed / maxFreeScans) * 100, 100);

  return (
    <main className="account">
      <nav className="account__nav">
        <Link href="/" className="account__nav-back">
          <ArrowLeft className="account__nav-back-icon" />
        </Link>
        <h1 className="account__nav-title">ACCOUNT</h1>
      </nav>

      <div className="account__container">
        {/* PROFILE SECTION - Using real data from Server */}
        <div className="account__profile">
          <div className="account__profile-avatar">
            <UserIcon className="account__profile-avatar-icon" />
          </div>
          <div>
            <h2 className="account__profile-name">{user.firstName || "Hunter"}</h2>
            <p className="account__profile-joined">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSubscriber(!isSubscriber)}
          className="account__upgrade-btn"
        >
          {isSubscriber ? "DEMO: Switch to Free" : "UPGRADE TO PRO"}
        </button>

        {!isSubscriber && (
          <p className="account__scans-left">
            Scans left: {maxFreeScans - dailyScansUsed}
          </p>
        )}

        {/* SUBSCRIPTION STATUS CARD */}
        <section className="account__section">
          <h3 className="account__section-title">Current Plan</h3>
          
          <div className={`account__plan-card ${isSubscriber ? 'account__plan-card--pro' : 'account__plan-card--free'}`}>
            <div className="account__plan-header">
               <span className={`account__plan-badge ${isSubscriber ? 'account__plan-badge--pro' : 'account__plan-badge--free'}`}>
                  {isSubscriber ? 'Pro Plan' : 'Free Plan'}
               </span>
                <Zap
                  fill={isSubscriber ? "#3387b7" : "orange"}
                  className={`account__plan-icon ${isSubscriber ? "account__plan-icon--pro" : "account__plan-icon--free"}`}
                />
            </div>

            {!isSubscriber && (
              <div className="account__usage-meter">
                <div className="account__usage-meter-header">
                  <span>Daily Usage</span>
                  <span className="account__usage-meter-count">
                    {dailyScansUsed} / {maxFreeScans}
                  </span>
                </div>
                
                <div className="account__usage-meter-bar-bg">
                  <div 
                    className="account__usage-meter-bar" 
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
                
                <p className="account__usage-meter-note">
                  {maxFreeScans - dailyScansUsed} scans remaining today
                </p>
              </div>
            )}

            {!isSubscriber && (
               <button className="account__upgrade-btn account__upgrade-btn--full">
                 UPGRADE TO PRO
               </button>
            )}
          </div>
        </section>

        {/* RECENT SEARCHES */}
        <section className="account__section">
          <div className="account__section-header">
            <h3 className="account__section-title">Recent History</h3>
            <Link href="/history" className="account__view-all-btn">VIEW ALL</Link>
          </div>
          <div className="account__history-card">
            {history.map((search) => (
              <div key={search.id} className="account__history-row">
                <div className="account__history-row-info">
                  <div className="account__history-row-icon-bg">
                    <History className="account__history-row-icon" />
                  </div>
                  <div>
                    <p className="account__history-row-label">{search.item}</p>
                    <p className="account__history-row-date">{search.date}</p>
                  </div>
                </div>
                <div className="account__history-row-meta">
                  <span className="account__history-row-price">{search.price}</span>
                  <ChevronRight className="account__history-row-chevron" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <button className="account__logout-btn" onClick={() => { /* Logout function here */ }}>
          Log Out
        </button>
      </div>
    </main>
  );
}