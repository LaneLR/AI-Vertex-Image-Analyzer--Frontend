"use client";
import { useApp } from "@/context/AppContext";
import React from "react";
import {
  User,
  History,
  ChevronRight,
  Zap,
  ArrowLeft,
  Shield,
  Smartphone,
  Bell,
} from "lucide-react";
import Link from "next/link";
import "../../styles/common/_account.scss";

export default function AccountPage() {
  const { isSubscriber, setIsSubscriber, dailyScansUsed, maxFreeScans } =
    useApp();

  // Mock Recent Searches Data
  const recentSearches = [
    { id: 1, item: "Vintage Levi's 501", price: "$45-60", date: "2h ago" },
    { id: 2, item: "Nike Air Max 97", price: "$110-140", date: "Yesterday" },
    { id: 3, item: "Pyrex Butterfly Gold", price: "$25-40", date: "Dec 18" },
  ];

  return (
    <main className="account">
      {/* HEADER */}
      <nav className="account__nav">
        <Link href="/" className="account__nav-back">
          <ArrowLeft className="account__nav-back-icon" />
        </Link>
        <h1 className="account__nav-title">Account</h1>
      </nav>

      <div className="account__container">
        {/* PROFILE SECTION */}
        <div className="account__profile">
          <div className="account__profile-avatar">
            <User className="account__profile-avatar-icon" />
          </div>
          <div>
            <h2 className="account__profile-name">ThriftHunter_99</h2>
            <p className="account__profile-joined">Joined December 2025</p>
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
          <h3 className="account__section-title">Your Plan</h3>
          <div
            className={`account__plan-card ${
              isSubscriber
                ? "account__plan-card--pro"
                : "account__plan-card--free"
            }`}
          >
            <div className="account__plan-header">
              <div>
                <span
                  className={`account__plan-badge ${
                    isSubscriber
                      ? "account__plan-badge--pro"
                      : "account__plan-badge--free"
                  }`}
                >
                  {isSubscriber ? "Pro Member" : "Free Tier"}
                </span>
                <p className="account__plan-type">
                  {isSubscriber ? "Unlimited Scanning" : "Standard Access"}
                </p>
              </div>
              <Zap
                className={`account__plan-icon ${
                  isSubscriber
                    ? "account__plan-icon--pro"
                    : "account__plan-icon--free"
                }`}
              />
            </div>
            {/* DAILY USAGE METER (Only for non-subscribers) */}
            {!isSubscriber && (
              <div className="account__usage-meter">
                <div className="account__usage-meter-header">
                  <span>Daily Scans Remaining</span>
                  <span className="account__usage-meter-count">
                    {maxFreeScans - dailyScansUsed} / {maxFreeScans}
                  </span>
                </div>
                <div className="account__usage-meter-bar-bg">
                  <div
                    className="account__usage-meter-bar"
                    style={{
                      width: `${(dailyScansUsed / maxFreeScans) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="account__usage-meter-note">Resets at midnight</p>
                <button className="account__upgrade-btn account__upgrade-btn--full">
                  UPGRADE TO UNLIMITED
                </button>
              </div>
            )}
            {isSubscriber && (
              <button className="account__manage-btn">MANAGE BILLING</button>
            )}
          </div>
        </section>

        {/* RECENT SEARCHES */}
        <section className="account__section">
          <div className="account__section-header">
            <h3 className="account__section-title">Recent History</h3>
            <button className="account__view-all-btn">VIEW ALL</button>
          </div>
          <div className="account__history-card">
            {recentSearches.map((search) => (
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
                  <span className="account__history-row-price">
                    {search.price}
                  </span>
                  <ChevronRight className="account__history-row-chevron" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LOG OUT BUTTON */}
        <button className="account__logout-btn">Log Out</button>
      </div>
    </main>
  );
}
