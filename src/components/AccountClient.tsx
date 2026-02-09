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
  HistoryIcon,
  CircleDollarSign,
  BriefcaseBusiness,
  Flame,
  ZapOff,
  Boxes,
  RefreshCw,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import InfoModal from "./InfoModal";
import { getApiUrl } from "@/lib/api-config";
import Loading from "./Loading";

export default function AccountClient() {
  const {
    user,
    isLoading,
    maxFreeScans,
    dailyScansUsed,
    setDailyScansUsed,
    refreshUser,
    setUser,
    deletionCountdown,
    setDeletionCountdown,
  } = useApp();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [reactivateModal, setReactivateModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [needsReload, setNeedsReload] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get("success");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const pacificTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }).formatToParts(now);

      const parts: any = {};
      pacificTime.forEach(({ type, value }) => (parts[type] = value));

      const midnightPacific = new Date(now);
      midnightPacific.setUTCFullYear(parts.year, parts.month - 1, parts.day);
      midnightPacific.setUTCHours(parts.hour, parts.minute);

      const target = new Date(now);
      target.setHours(24, 0, 0, 0);

      const nowInPT = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      );
      const tomorrowInPT = new Date(nowInPT);
      tomorrowInPT.setHours(24, 0, 0, 0);

      const diff = tomorrowInPT.getTime() - nowInPT.getTime();

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        setNeedsReload(true);
        return;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      const minute = minutes === 1 ? "minute" : "minutes";

      setTimeLeft(
        `${hours.toString().padStart(2)} hours ${minutes.toString().padStart(2)} ${minute}`,
      );
    };
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.dailyScansCount !== undefined) {
      const lastUpdate = new Date(user.lastScanDate || new Date());
      const now = new Date();
      const isNewDay = lastUpdate.getUTCDate() !== now.getUTCDate();
      setDailyScansUsed(isNewDay ? 0 : user.dailyScansCount);
    }
  }, [user, setDailyScansUsed]);

  useEffect(() => {
    if (success && refreshUser) {
      refreshUser();
    }
  }, [success, refreshUser]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="loading-state">
        <Loading />
      </div>
    );
  }

  const isPro = user?.subscriptionStatus?.toLowerCase() === "pro";
  const isHobby = user?.subscriptionStatus?.toLowerCase() === "hobby";
  const isBusiness = user?.subscriptionStatus?.toLowerCase() === "business";

  const maxScans = isPro ? 100 : isHobby ? 50 : isBusiness ? 250 : maxFreeScans;
  const usagePercentage = Math.min((dailyScansUsed / maxScans) * 100, 100);

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    const token = localStorage.getItem("token");

    if (user?.paymentProvider === "stripe") {
      try {
        const res = await fetch(getApiUrl("/api/stripe/portal"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Identify user to Express
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else throw new Error("No URL returned");
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

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const handleKeepAccount = async () => {
    try {
      const res = await fetch(getApiUrl("/api/user/keep-active"), {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        // Clear deactivation fields in local state
        setIsProcessing(true);
        if (setUser) {
          setUser((prev: any) => ({
            ...prev,
            scheduledDeletionDate: null,
            deactivationRequestedAt: null,
          }));
        }

        setReactivateModal(true);
      }
    } catch (err) {
      console.error("KEEP_ACTIVE_ERROR:", err);
    }
  };

  return (
    <main className="account-page">
      <header className="account-page__header">
        <button
          onClick={handleBack}
          className="back-btn"
          data-ph-capture-attribute-button-name="account-back-btn"
          data-ph-capture-attribute-feature="back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Account Settings</h1>
        <div className="header-spacer" />
      </header>

      <div className="account-page__content">
        {needsReload && (
          <div className="deactivation-banner">
            <p>Scans have reset!</p>
            <button
              onClick={() => window.location.reload()}
              className="cancel-btn"
              data-ph-capture-attribute-button-name="account-reload-btn"
              data-ph-capture-attribute-feature="account"
            >
              <RefreshCcw size={14} /> Reload
            </button>
          </div>
        )}
        {user.scheduledDeletionDate !== null && (
          <div className="deactivation-banner">
            <p>
              Your account is set to become inactive in{" "}
              <strong>{deletionCountdown} days</strong>.
            </p>
            <button
              className="cancel-btn"
              onClick={handleKeepAccount}
              disabled={isProcessing}
              data-ph-capture-attribute-button-name="account-keep-account-btn"
              data-ph-capture-attribute-feature="account"
            >
              Keep My Account
            </button>
          </div>
        )}
        {/* PROFILE HERO */}
        <div className="account-header-info">
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
                    ? "Hobby"
                    : isBusiness
                      ? "Elite"
                      : "Free"}
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
                        : "var(--primary-theme)",
                  }}
                />
              </div>

              {/* CONDITIONAL ACTIONS BASED ON PLAN */}
              {isPro || isHobby || isBusiness ? (
                <div className="account-page-content">
                  <div className="subscription-manage-area">
                    <div className="timer-container">
                      <h4 className="timer-label">Daily reset in:</h4>
                      <div className="timer-display">
                        {timeLeft.split(":").map((unit, index) => (
                          <React.Fragment key={index}>
                            <span className="timer-unit">{unit}</span>
                            {index < 2 && (
                              <span className="timer-separator"></span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <button
                      className="secondary-btn manage-btn"
                      onClick={handleManageSubscription}
                      disabled={loadingPortal}
                      data-ph-capture-attribute-button-name="account-handle-subscription-btn"
                      data-ph-capture-attribute-feature="account"
                    >
                      <Settings size={14} />
                      {loadingPortal ? "Loading..." : "Manage Subscription"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="upgrade-area">
                  <p className="usage-hint">
                    Get more scans when you ugprade your account!
                  </p>
                  {/* <PaymentsClient user={user} /> */}
                  <Link href={"/payments"}>
                    <button
                      className="generate-btn"
                      data-ph-capture-attribute-button-name="account-upgrade-account-btn"
                      data-ph-capture-attribute-feature="account"
                    >
                      Upgrade account
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
        <div className="account-perk-links">
          <Link
            href="/history"
            className="account-card listing-shortcut"
            data-ph-capture-attribute-button-name="account-scan-history-btn"
            data-ph-capture-attribute-feature="account"
          >
            <div className="shortcut-info">
              <HistoryIcon size={20} />
              <div>
                <h4>Scan History</h4>
                <p>View your recent scans</p>
              </div>
            </div>
            <ChevronRight size={18} />
          </Link>

          {(isPro || isHobby || isBusiness) && (
            <Link
              href="/calculator"
              className="account-card listing-shortcut"
              data-ph-capture-attribute-button-name="account-calculator-btn"
              data-ph-capture-attribute-feature="account"
            >
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

          {/* TOOLS SHORTCUTS */}
          {(isPro || isBusiness) && (
            <Link
              href="/listing"
              className="account-card listing-shortcut"
              data-ph-capture-attribute-button-name="account-listing-studio-btn"
              data-ph-capture-attribute-feature="account"
            >
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

          {isBusiness && (
            <Link
              href="/inventory"
              className="account-card listing-shortcut"
              data-ph-capture-attribute-button-name="account-inventory-btn"
              data-ph-capture-attribute-feature="account"
            >
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
      </div>
      <InfoModal
        isOpen={errorModal}
        onClose={() => setErrorModal(false)}
        title={"Could not open billing settings"}
        footer={
          <div className="modal-btn-container">
            <button
              className="modal-btn modal-btn--secondary"
              onClick={() => setErrorModal(false)}
              data-ph-capture-attribute-button-name="account-modal-btn-close"
              data-ph-capture-attribute-feature="account"
            >
              Close
            </button>
          </div>
        }
      >
        <div className="errorModal-text">
          There was an error trying to open the billing settings. Please try
          again later.
        </div>
        <br />
      </InfoModal>

      <InfoModal
        isOpen={reactivateModal}
        onClose={() => setReactivateModal(false)}
        title={"Deactivation cancelled"}
        footer={
          <div className="modal-btn-container">
            <button
              className="modal-btn modal-btn--secondary"
              onClick={() => setReactivateModal(false)}
              data-ph-capture-attribute-button-name="account-modal-btn-close"
              data-ph-capture-attribute-feature="account"
            >
              Close
            </button>
          </div>
        }
      >
        <div>
          The scheduled deactivation for your account has been cancelled.
        </div>
        <br />
      </InfoModal>
    </main>
  );
}
