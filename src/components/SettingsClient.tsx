"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Eye,
  Database,
  Shield,
  Smartphone,
  ChevronRight,
  ArrowLeft,
  Moon,
  Trash2,
  AlertTriangle,
  History,
  Wand2,
  BookmarkX,
  DollarSign,
  Boxes,
  ALargeSmall,
  Camera,
  Cross,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
// IMPORT YOUR CONTEXT
import { useApp } from "@/context/AppContext";
import InfoModal from "./InfoModal";
import { getApiUrl } from "@/lib/api-config";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

export default function SettingsClient() {
  // Use custom context instead of useSession
  const { user, isLoading, refreshUser, setUser, deletionCountdown } = useApp();
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState(false);
  const [localDarkMode, setLocalDarkMode] = useState(user?.darkMode ?? false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSubWarning, setShowSubWarning] = useState(false);

  // Modal states
  const [isListingStudioModalOpen, setIsListingStudioModalOpen] =
    useState(false);
  const [isScanHistoryModalOpen, setIsScanHistoryModalOpen] = useState(false);
  const [isProfitCalcModalOpen, setIsProfitCalcModalOpen] = useState(false);
  const [isGradesModalOpen, setIsGradesModalOpen] = useState(false);
  const [isPhotoStudioModalOpen, setIsPhotoStudioModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [reactivateModal, setReactivateModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      setLocalDarkMode(user.darkMode);
    }
  }, [user]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(getApiUrl("/api/user/history"), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setIsModalOpen(false);
        // Optional: Refresh data or show toast
      }
    } catch (err) {
      console.error("Failed to clear history", err);
    } finally {
      setIsDeleting(false);
    }
  };

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

  const toggleDarkMode = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    const newDarkModeStatus = !localDarkMode;

    setLocalDarkMode(newDarkModeStatus);

    if (newDarkModeStatus) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    try {
      await fetch(getApiUrl("/api/user/update-settings"), {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ darkMode: newDarkModeStatus }),
      });
      refreshUser();
    } catch (err) {
      console.error("Failed to sync dark mode to DB", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Updated endpoint to /api/user/deactivate
      const res = await fetch(getApiUrl("/api/user/deactivate"), {
        method: "POST",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok && data.error === "ACTIVE_SUBSCRIPTION") {
        setShowConfirmDelete(false);
        setShowSubWarning(true);
      } else if (res.ok) {
        // SUCCESS: Instead of logging out, we update the user object
        // to show the deactivation banner and countdown.
        if (setUser) {
          setUser((prev: any) => ({
            ...prev,
            scheduledDeletionDate: data.scheduledDeletionDate,
            deactivationRequestedAt: new Date(),
          }));
        }
        setShowConfirmDelete(false);
      }
    } catch (err) {
      console.error("DEACTIVATE_ERROR:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <Loading />
      </div>
    );
  }

  return (
    <main className="settings-page">
      <header className="help-page__header">
        <button onClick={handleBack} className="back-btn">
          <ArrowLeft size={20} />
        </button>
        <h1>Settings</h1>
        <div className="header-spacer" />
      </header>

      <div className="settings-page__content">
        {/* APPEARANCE GROUP */}
        <section className="settings-group">
          <h2 className="settings-group__title">Appearance</h2>
          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item__info">
                <div className="icon-box ">
                  <Moon size={20} />
                </div>
                <div>
                  <p className="item-label">Dark Mode</p>
                  <p className="item-desc">Easier on the eyes in low light</p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                disabled={isUpdating}
                className={`ios-toggle ${localDarkMode ? "active" : ""}`}
                aria-pressed={localDarkMode}
              >
                <div className="ios-toggle__knob" />
              </button>
            </div>
          </div>
        </section>

        {/* TOOLS GROUP */}
        <section className="settings-group">
          <h2 className="settings-group__title">TOOLS</h2>
          <div className="settings-list">
            <div
              onClick={() => setIsScanHistoryModalOpen(true)}
              className="settings-item settings-item--clickable cursor-pointer"
            >
              <div className="settings-item__info">
                <div className="icon-box">
                  <History size={20} />
                </div>
                <p className="item-label">Scan History</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </div>

            <div
              onClick={() => setIsGradesModalOpen(true)}
              className="settings-item settings-item--clickable cursor-pointer"
            >
              <div className="settings-item__info">
                <div className="icon-box">
                  <ALargeSmall size={20} />
                </div>
                <p className="item-label">Thrift Grades</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </div>

            <div
              onClick={() => setIsProfitCalcModalOpen(true)}
              className="settings-item settings-item--clickable cursor-pointer"
            >
              <div className="settings-item__info">
                <div className="icon-box">
                  <DollarSign size={20} />
                </div>
                <p className="item-label">Profit Calculator</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </div>

            <div
              onClick={() => setIsListingStudioModalOpen(true)}
              className="settings-item settings-item--clickable cursor-pointer"
            >
              <div className="settings-item__info">
                <div className="icon-box">
                  <Wand2 size={20} />
                </div>
                <p className="item-label">SEO Generator</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </div>

            <div
              onClick={() => setIsPhotoStudioModalOpen(true)}
              className="settings-item settings-item--clickable cursor-pointer"
            >
              <div className="settings-item__info">
                <div className="icon-box">
                  <Camera size={20} />
                </div>
                <p className="item-label">Photo Generator</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </div>

            <div
              onClick={() => setIsInventoryModalOpen(true)}
              className="settings-item settings-item--clickable cursor-pointer"
            >
              <div className="settings-item__info">
                <div className="icon-box">
                  <Boxes size={20} />
                </div>
                <p className="item-label">Inventory Manager</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </div>
          </div>
        </section>

        <InfoModal
          isOpen={isListingStudioModalOpen}
          onClose={() => setIsListingStudioModalOpen(false)}
          title="SEO Generator"
        >
          <div className="feature-info-modal">
            <p>
              The SEO Generator uses advanced AI to craft professional,
              high-converting titles and descriptions for your marketplace
              listings.
            </p>
            <br />
            <div className="feature-benefits">
              <div>
                <strong>Smart Copywriting:</strong> Generates compelling
                descriptions that highlight key selling points automatically.
              </div>
              <div>
                <strong>Algorithm Optimized:</strong> Uses high-ranking keywords
                to boost visibility on eBay, Poshmark, and Mercari.
              </div>
              <div>
                <strong>Brand Detection:</strong> Identifies specific models and
                styles to ensure technical accuracy in every post.
              </div>
            </div>
            <br />
            <div className="delete-modal__actions">
              <div
                className="modal-btn-container"
                onClick={() => setIsListingStudioModalOpen(false)}
              >
                <div className="modal-btn modal-btn--secondary">Close</div>
                {(user?.subscriptionStatus === "business" ||
                  user?.subscriptionStatus === "pro") && (
                  <Link
                    href="/listing"
                    className="modal-btn modal-btn--primary"
                  >
                    Go to Listing Studio
                  </Link>
                )}
              </div>
            </div>
          </div>
        </InfoModal>

        {/* --- Scan History --- */}
        <InfoModal
          isOpen={isScanHistoryModalOpen}
          onClose={() => setIsScanHistoryModalOpen(false)}
          title="Scan History"
        >
          <div className="feature-info-modal">
            <p>
              Your Scan History acts as a digital log of every item you've ever
              analyzed, allowing you to revisit appraisals at any time.
            </p>
            <br />
            <div className="feature-benefits">
              <div>
                <strong>Unlimited Recall:</strong> Access past price estimates
                and item details without re-scanning the physical object.
              </div>
              <div>
                <strong>One-Tap Inventory:</strong> Easily move successful scans
                into your Business Inventory for long-term tracking.
              </div>
              <div>
                <strong>Cloud Sync:</strong> Your history is saved to your
                account and accessible across all your devices.
              </div>
            </div>
            <br />
            <div className="delete-modal__actions">
              <div
                className="modal-btn-container"
                onClick={() => setIsScanHistoryModalOpen(false)}
              >
                <div className="modal-btn modal-btn--secondary">Close</div>
                <Link href="/history" className="modal-btn modal-btn--primary">
                  Go to Scan History
                </Link>
              </div>
            </div>
          </div>
        </InfoModal>

        {/* --- Item Grades --- */}
        <InfoModal
          isOpen={isGradesModalOpen}
          onClose={() => setIsGradesModalOpen(false)}
          title="Thrift Grades"
        >
          <div className="feature-info-modal">
            <p>
              Thrift Grades provide an instant visual indicator of an item's
              resale potential based on demand, margin, and sell-through rate.
              The higher the grade, the faster it will likely sell.
            </p>
            <br />
            <div className="feature-benefits">
              <div>
                <strong>Grade A:</strong> High-demand items with excellent
                profit margins and fast turnover.
              </div>
              <div>
                <strong>Market Saturation:</strong> Grades factor in how many
                similar items are currently listed online.
              </div>
              <div>
                <strong>Risk Assessment:</strong> Identify "bad buys" early by
                spotting low grades before you purchase.
              </div>
            </div>
            <br />
            <div className="delete-modal__actions">
              <div
                className="modal-btn-container"
                onClick={() => setIsGradesModalOpen(false)}
              >
                <div className="modal-btn modal-btn--secondary">Close</div>
              </div>
            </div>
          </div>
        </InfoModal>

        {/* --- Profit Calculator --- */}
        <InfoModal
          isOpen={isProfitCalcModalOpen}
          onClose={() => setIsProfitCalcModalOpen(false)}
          title="Profit Calculator"
        >
          <div className="feature-info-modal">
            <p>
              Take the guesswork out of your margins by calculating exactly what
              you'll take home after expenses.
            </p>
            <br />
            <div className="feature-benefits">
              <div>
                <strong>Fee Estimates:</strong> Automatically accounts for
                standard marketplace commission rates (approx. 13%).
              </div>
              <div>
                <strong>Net Profit:</strong> Factors in your acquisition cost
                and estimated shipping to show your true bottom line.
              </div>
              <div>
                <strong>Real-Time Adjustments:</strong> Change your "Buy" price
                on the fly to see how it impacts your ROI.
              </div>
            </div>
            <br />
            <div className="delete-modal__actions">
              <div
                className="modal-btn-container"
                onClick={() => setIsProfitCalcModalOpen(false)}
              >
                <div className="modal-btn modal-btn--secondary">Close</div>
                {user?.subscriptionStatus !== "basic" && (
                  <Link
                    href="/calculator"
                    className="modal-btn modal-btn--primary"
                  >
                    Go to Profit Calculator
                  </Link>
                )}
              </div>
            </div>
          </div>
        </InfoModal>

        {/* --- Photo Generator (Photo Studio) --- */}
        <InfoModal
          isOpen={isPhotoStudioModalOpen}
          onClose={() => setIsPhotoStudioModalOpen(false)}
          title="Photo Generator"
        >
          <div className="feature-info-modal">
            <p>
              Transform amateur photos into professional studio-quality product
              images that drive more sales.
            </p>
            <br />
            <div className="feature-benefits">
              <div>
                <strong>Background Removal:</strong> Instantly strip away messy
                room backgrounds for a clean, white "Amazon-style" look.
              </div>
              <div>
                <strong>Lighting Enhancement:</strong> AI-driven brightness and
                contrast correction to make colors pop.
              </div>
              <div>
                <strong>Standardization:</strong> Create a consistent look
                across your entire store to build brand trust.
              </div>
            </div>
            <br />
            <div className="delete-modal__actions">
              <div
                className="modal-btn-container"
                onClick={() => setIsPhotoStudioModalOpen(false)}
              >
                <div className="modal-btn modal-btn--secondary">Close</div>
                {(user?.subscriptionStatus === "business" ||
                  user?.subscriptionStatus === "pro") && (
                  <Link
                    href="/listing"
                    className="modal-btn modal-btn--primary"
                  >
                    Go to Listing Generator
                  </Link>
                )}
              </div>
            </div>
          </div>
        </InfoModal>

        {/* --- Inventory Manager --- */}
        <InfoModal
          isOpen={isInventoryModalOpen}
          onClose={() => setIsInventoryModalOpen(false)}
          title="Inventory Manager"
        >
          <div className="feature-info-modal">
            <p>
              Designed for Business Tier users to manage their active stock and
              track the total value of their business.
            </p>
            <br />
            <div className="feature-benefits">
              <div>
                <strong>Active Tracking:</strong> Keep a dedicated list of items
                you currently have in stock and ready to sell.
              </div>
              <div>
                <strong>Potential Value:</strong> See the cumulative value of
                your entire inventory at a single glance.
              </div>
              <div>
                <strong>Business Workflow:</strong> Toggle "Auto-Add" on the
                home screen to skip history and send scans straight to
                inventory.
              </div>
            </div>
            <br />
            <div className="delete-modal__actions">
              <div
                className="modal-btn-container"
                onClick={() => setIsInventoryModalOpen(false)}
              >
                <div className="modal-btn modal-btn--secondary">Close</div>
                {user?.subscriptionStatus === "business" && (
                  <Link
                    href="/inventory"
                    className="modal-btn modal-btn--primary"
                  >
                    Go to Inventory Manager
                  </Link>
                )}
              </div>
            </div>
          </div>
        </InfoModal>

        {/* PREFERENCES GROUP */}
        <section className="settings-group">
          <h2 className="settings-group__title">About</h2>
          <div className="settings-list">
            <div
              onClick={() => setIsHelpModalOpen(true)}
              className="settings-item settings-item--clickable"
            >
              <div className="settings-item__info">
                <div className="icon-box">
                  <Cross size={20} />
                </div>
                <p className="item-label">Help</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </div>

            <div
              onClick={() => setIsPrivacyModalOpen(true)}
              className="settings-item settings-item--clickable"
            >
              <div className="settings-item__info">
                <div className="icon-box">
                  <ShieldCheck size={20} />
                </div>
                <p className="item-label">Data & Privacy</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </div>

            <div className="settings-item">
              <div className="settings-item__info">
                <div className="icon-box">
                  <Smartphone size={20} />
                </div>
                <p className="item-label">App Version</p>
              </div>
              <span className="version-tag">
                {process.env.NEXT_PUBLIC_APP_VERSION}
              </span>
            </div>
          </div>

          <InfoModal
            isOpen={isHelpModalOpen}
            onClose={() => setIsHelpModalOpen(false)}
            title="Help"
          >
            <div className="feature-info-modal">
              <p>You can get help here.</p>
              <br />
              <div className="delete-modal__actions">
                <div
                  className="modal-btn-container"
                  onClick={() => setIsHelpModalOpen(false)}
                >
                  <div className="modal-btn modal-btn--secondary">Close</div>
                </div>
              </div>
            </div>
          </InfoModal>

          <InfoModal
            isOpen={isPrivacyModalOpen}
            onClose={() => setIsPrivacyModalOpen(false)}
            title="Privacy and Terms"
          >
            <div className="feature-info-modal">
              <p>
                You can view our <a>Terms of Service</a> and{" "}
                <a>Privacy Policy</a> here.
              </p>
              <br />
              <div className="delete-modal__actions">
                <div
                  className="modal-btn-container"
                  onClick={() => setIsPrivacyModalOpen(false)}
                >
                  <div className="modal-btn modal-btn--secondary">Close</div>
                </div>
              </div>
            </div>
          </InfoModal>
        </section>

        {/* DANGER ZONE SECTION */}
        <section className="settings-group">
          <h2 className="settings-group__title settings-group__title--danger">
            DANGER ZONE
          </h2>{" "}
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
              >
                Keep My Account
              </button>
            </div>
          )}
          <div className="settings-list">
            <button
              className="settings-item settings-item--btn"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="settings-item__info">
                <div className="icon-box icon-box--alert">
                  <Trash2 size={20} />
                </div>
                <p className="item-label item-label--alert">
                  Clear All Scan History
                </p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </button>
            <button
              className="settings-item settings-item--btn"
              onClick={() => setShowConfirmDelete(true)}
              disabled={user.scheduledDeletionDate !== null}
            >
              <div className="settings-item__info">
                <div className="icon-box icon-box--alert">
                  <BookmarkX size={20} />
                </div>
                <p className="item-label item-label--alert">
                  {user.scheduledDeletionDate === null ? (
                    "Deactivate Account"
                  ) : (
                    <div>
                      Deactivation scheduled in <u>{deletionCountdown} days</u>
                    </div>
                  )}
                </p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </button>
          </div>
        </section>

        {/* CONFIRMATION MODAL */}
        <InfoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Clear History"
        >
          <div className="delete-modal">
            <div className="delete-modal__warning">
              <div className="warning-icon-bg">
                <AlertTriangle size={32} />
              </div>
              <h3>Are you sure?</h3>
              <p>
                All scanned items and valuations will be permanently removed.
                <strong> This cannot be undone.</strong>
              </p>
            </div>

            <div className="delete-modal__actions">
              <button
                className="modal-btn modal-btn--secondary"
                onClick={() => setIsModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="modal-btn modal-btn--danger"
                onClick={handleDeleteAll}
                disabled={isDeleting}
              >
                Delete All Scan History
              </button>
            </div>
          </div>
        </InfoModal>

        <InfoModal
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          title="Deactivate account"
        >
          <div className="delete-modal">
            <div className="delete-modal__warning">
              <div className="warning-icon-bg">
                <AlertTriangle size={32} />
              </div>
              <h3>Are you sure?</h3>
              <p>
                This will schedule your account to be deactivated in{" "}
                <strong>30 days</strong>. After this time, you will not be able
                to log into your account.
              </p>
            </div>

            <div className="delete-modal__actions">
              <button
                className="modal-btn modal-btn--secondary"
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="modal-btn modal-btn--danger"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting
                  ? "Preparing to deactivate account..."
                  : "Deactivate Account"}
              </button>
            </div>
          </div>
        </InfoModal>

        <InfoModal
          isOpen={showSubWarning}
          onClose={() => setShowSubWarning(false)}
          title="An error occurred"
        >
          <div className="delete-modal">
            <div className="delete-modal__warning">
              <div className="warning-icon-bg">
                <AlertTriangle size={32} />
              </div>
              <h3>An error occurred</h3>
              <p>
                An error occurred while trying to deactivate your account. If
                you are a subscribed user, please make sure you have cancelled
                your subscription before deactivating your account.
              </p>
            </div>

            <div className="delete-modal__actions">
              <button
                className="modal-btn modal-btn--secondary"
                onClick={() => setShowSubWarning(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </InfoModal>
      </div>

      <InfoModal
        isOpen={reactivateModal}
        onClose={() => setReactivateModal(false)}
        title={"Deactivation cancelled"}
      >
        <div>
          The scheduled deactivation for your account has been cancelled.
        </div>
        <br />
      </InfoModal>
    </main>
  );
}
