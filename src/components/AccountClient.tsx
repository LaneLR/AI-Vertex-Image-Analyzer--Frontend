"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  User as UserIcon,
  ChevronRight,
  Zap,
  ArrowLeft,
  Settings,
  Wand2,
  ShieldCheck,
  HistoryIcon,
  CircleDollarSign,
  BriefcaseBusiness,
  Flame,
  ZapOff,
  Package,
  Boxes,
} from "lucide-react";
import Link from "next/link";
import { Capacitor } from "@capacitor/core";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import InfoModal from "./InfoModal";
import { getApiUrl } from "@/lib/api-config";
import PaymentsClient from "./Payments";

export default function AccountClient({ user: initialUser }: { user: any }) {
  const { maxFreeScans, dailyScansUsed } = useApp();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const [errorModal, setErrorModal] = useState(false);

  const user = session?.user || initialUser;

  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "true") {
      update();
    }
  }, [success]);

  const isPro = user?.subscriptionStatus?.toLowerCase() === "pro";
  const isHobby = user?.subscriptionStatus?.toLowerCase() === "hobby";
  const isBusiness = user?.subscriptionStatus?.toLowerCase() === "business";

  const maxScans = isPro ? 100 : isHobby ? 50 : isBusiness ? 250 : maxFreeScans;
  const usagePercentage = Math.min((dailyScansUsed / maxScans) * 100, 100);

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    if (user?.paymentProvider === "stripe") {
      try {
        const res = await fetch(getApiUrl("/api/stripe/portal"), {
          method: "POST",
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } catch (err) {
        setErrorModal(true);
      } finally {
        setLoadingPortal(false);
      }
    } else if (user.paymentProvider === "apple") {
      window.open("https://apps.apple.com/account/subscriptions", "_blank");
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
        <div />
      </header>

      <div className="account-page__content">
        {/* PROFILE HERO */}
        <section className="profile-hero">
          <div className="profile-hero__avatar">
            <UserIcon size={32} />
          </div>
          <div className="profile-hero__info">
            <h2>{user?.email}</h2>
            <span
              className={`status-pill ${
                isPro || isBusiness
                  ? "status-pill--pro"
                  : isHobby
                    ? "status-pill--hobby"
                    : ""
              }`}
            >
              {isBusiness ? (
                <BriefcaseBusiness size={18} className="orange-icon" />
              ) : isPro ? (
                <Flame size={18} className="orange-icon" />
              ) : isHobby ? (
                <Zap size={18} className="orange-icon" />
              ) : (
                <ZapOff size={18} />
              )}{" "}
              {isPro
                ? "Pro"
                : isHobby
                  ? "Hobbyist"
                  : isBusiness
                    ? "Business"
                    : "Basic"}
            </span>
          </div>
        </section>

        {/* USAGE & SUBSCRIPTION CARD */}
        <section className="account-card subscription-card">
          <div className="account-card__header">
            <h3>Daily Usage</h3>
            <Zap
              size={18}
              className={
                isPro || isHobby || isBusiness ? "icon-gold" : "icon-gray"
              }
            />
          </div>

          <div className="usage-content">
            <div className="usage-stats">
              <span>Scans Used Today</span>
              <span className="usage-count">
                {dailyScansUsed} / {maxScans}
              </span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${usagePercentage}%`,
                  backgroundColor:
                    usagePercentage > 90
                      ? "var(--error-color)"
                      : "var(--primary-color)",
                }}
              />
            </div>

            {/* CONDITIONAL ACTIONS BASED ON PLAN */}
            {isPro || isHobby || isBusiness ? (
              <div
                className="subscription-manage-area"
                style={{ marginTop: "1.5rem" }}
              >
                {/* <p className="usage-hint">
                  Your daily scans resets every 24 hours.
                </p> */}
                <button
                  className="secondary-btn"
                  onClick={handleManageSubscription}
                  disabled={loadingPortal}
                >
                  <Settings size={14} />{" "}
                  {loadingPortal ? "Loading..." : "Manage Subscription"}
                </button>
              </div>
            ) : (
              <div className="upgrade-area">
                <p className="usage-hint">
                  Get over 100 scans and Listing Studio with our Hobbyist or Pro
                  plans!
                </p>
                {/* <PaymentsClient user={user} /> */}
                <Link href={"/payments"}>
                  <button className="generate-btn">Upgrade account</button>
                </Link>
              </div>
            )}
          </div>
        </section>

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

        {/* TOOLS SHORTCUTS */}
        {(isPro || isHobby || isBusiness) && (
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

        {(isPro || isHobby || isBusiness) && (
          <Link href="/calculator" className="account-card listing-shortcut">
            <div className="shortcut-info">
              <CircleDollarSign size={20} />
              <div>
                <h4>Profit Calculator</h4>
                <p>Calculate the profits for items you find</p>
              </div>
            </div>
            <ChevronRight size={18} />
          </Link>
        )}


        {(isBusiness || isPro) && (
          <Link href="/inventory" className="account-card listing-shortcut">
            <div className="shortcut-info">
              <Boxes size={20} />
              <div>
                <h4>Inventory Manager</h4>
                <p>Manage your inventory items</p>
              </div>
            </div>
            <ChevronRight size={18} />
          </Link>
        )}
      </div>

      <InfoModal
        isOpen={errorModal}
        onClose={() => setErrorModal(false)}
        title={"Could not open billing settings"}
      >
        <div className="errorModal-text">
          There was an error trying to open the billing settings. Please try
          again later.
        </div>
      </InfoModal>
    </main>
  );
}
