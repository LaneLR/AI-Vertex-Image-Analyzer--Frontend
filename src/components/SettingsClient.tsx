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
  ArrowUpNarrowWide,
  AArrowUp,
  ALargeSmall,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import InfoModal from "./InfoModal";
import { getApiUrl } from "@/lib/api-config";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  darkMode?: boolean;
  subscriptionStatus?: string | null;
};

interface SettingsClientProps {
  user?: User;
}

export default function SettingsClient({
  user: initialUser,
}: SettingsClientProps) {
  const { data: session, update } = useSession();
  const user = session?.user || initialUser;

  const [isUpdating, setIsUpdating] = useState(false);
  const [localDarkMode, setLocalDarkMode] = useState(user?.darkMode ?? false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSubWarning, setShowSubWarning] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isListingStudioModalOpen, setIsListingStudioModalOpen] =
    useState(false);
  const [isScanHistoryModalOpen, setIsScanHistoryModalOpen] = useState(false);
  const [isProfitCalcModalOpen, setIsProfitCalcModalOpen] = useState(false);
  const [isGradesModalOpen, setIsGradesModalOpen] = useState(false);
  const [isPhotoStudioModalOpen, setIsPhotoStudioModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(getApiUrl("/api/user/clear-history"), {
        method: "DELETE",
      });
      if (res.ok) {
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to clear history", err);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    setLocalDarkMode(user?.darkMode ?? false);
    if (user?.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [user?.darkMode]);

  const toggleDarkMode = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    const newDarkModeStatus = !localDarkMode;

    setLocalDarkMode(newDarkModeStatus);
    localStorage.setItem("darkMode", newDarkModeStatus ? "true" : "false");

    if (newDarkModeStatus) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    try {
      const res = await fetch(getApiUrl("/api/user/update-settings"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ darkMode: newDarkModeStatus }),
      });

      if (res.ok) {
        await update({ darkMode: newDarkModeStatus });
      }
    } catch (err) {
      console.error("Failed to sync dark mode to DB", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(getApiUrl("/api/user/delete-account"), {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok && data.error === "ACTIVE_SUBSCRIPTION") {
        setShowConfirmDelete(false);
        setShowSubWarning(true);
      } else if (res.ok) {
        window.location.href = "/api/auth/signout";
      } else {
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="settings-page">
      <header className="help-page__header">
        <Link href="/" className="back-btn">
          <ArrowLeft size={20} />
        </Link>
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
                <div className="icon-box icon-box--moon">
                  <Moon size={22} />
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

        {/* AI ENGINE GROUP */}
        {/* <section className="settings-group">
          <h2 className="settings-group__title">
            <Sparkles size={14} /> AI Engine Configuration
          </h2>
          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item__info">
                <div className="icon-box icon-box--eye">
                  <Eye size={18} />
                </div>
                <div>
                  <p className="item-label">High Accuracy Mode</p>
                  <p className="item-desc">Advanced visual tiling for detail</p>
                </div>
              </div>
              <button
                onClick={() => setHighAccuracy(!highAccuracy)}
                className={`ios-toggle ${highAccuracy ? "active" : ""}`}
              >
                <div className="ios-toggle__knob" />
              </button>
            </div>

            <div className="settings-item">
              <div className="settings-item__info">
                <div className="icon-box icon-box--db">
                  <Database size={18} />
                </div>
                <div>
                  <p className="item-label">Cloud Save History</p>
                  <p className="item-desc">Sync scans across all devices</p>
                </div>
              </div>
              <button
                onClick={() => setSaveHistory(!saveHistory)}
                className={`ios-toggle ${saveHistory ? "active" : ""}`}
              >
                <div className="ios-toggle__knob" />
              </button>
            </div>
          </div>
        </section> */}

        {/* TOOLS GROUP */}
        <section className="settings-group">
          <h2 className="settings-group__title">TOOLS</h2>
          <div className="settings-list">
            <div
              onClick={() => setIsScanHistoryModalOpen(true)}
              className="settings-item settings-item--clickable cursor-pointer"
            >
              <div className="settings-item__info">
                <div className="icon-box icon-box--shield">
                  <History size={22} />
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
                <div className="icon-box icon-box--shield">
                  <ALargeSmall size={22} />
                </div>
                <p className="item-label">Grades</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </div>

            <div
              onClick={() => setIsProfitCalcModalOpen(true)}
              className="settings-item settings-item--clickable cursor-pointer"
            >
              <div className="settings-item__info">
                <div className="icon-box icon-box--shield">
                  <DollarSign size={22} />
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
                <div className="icon-box icon-box--shield">
                  <Wand2 size={22} />
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
                <div className="icon-box icon-box--shield">
                  <Camera size={22} />
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
                <div className="icon-box icon-box--shield">
                  <Boxes size={22} />
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
                    Listing Studio
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
                  Scan History
                </Link>
              </div>
            </div>
          </div>
        </InfoModal>

        {/* --- Item Grades --- */}
        <InfoModal
          isOpen={isGradesModalOpen}
          onClose={() => setIsGradesModalOpen(false)}
          title="Item Grades"
        >
          <div className="feature-info-modal">
            <p>
              Flip Grades provide an instant visual indicator of an item's
              resale potential based on demand, margin, and sell-through rate.
              The higher the grade, the better the flip.
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
                    Profit Calculator
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
                    Listing Generator
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
                home screen to skip history and send scans straight to stock.
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
                    Inventory Manager
                  </Link>
                )}
              </div>
            </div>
          </div>
        </InfoModal>

        {/* PREFERENCES GROUP */}
        <section className="settings-group">
          <h2 className="settings-group__title">Preferences</h2>
          <div className="settings-list">
            <Link
              href="/privacy"
              className="settings-item settings-item--clickable"
            >
              <div className="settings-item__info">
                <div className="icon-box icon-box--shield">
                  <Shield size={22} />
                </div>
                <p className="item-label">Data & Privacy</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </Link>

            <div className="settings-item">
              <div className="settings-item__info">
                <div className="icon-box icon-box--phone">
                  <Smartphone size={22} />
                </div>
                <p className="item-label">App Version</p>
              </div>
              <span className="version-tag">{process.env.NEXT_PUBLIC_APP_VERSION}</span>
            </div>
          </div>
        </section>

        {/* DANGER ZONE SECTION */}
        <section className="settings-group">
          <h2 className="settings-group__title settings-group__title--danger">
            DANGER ZONE
          </h2>
          <div className="settings-list settings-list--danger">
            <button
              className="settings-item settings-item--btn"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="settings-item__info">
                <Trash2 size={18} color="#ef4444" />
                <span className="text-danger">Clear All Scan History</span>
              </div>
            </button>
          </div>
          <div className="settings-list settings-list--danger">
            <button
              className="settings-item settings-item--btn"
              onClick={() => setShowConfirmDelete(true)}
            >
              <div className="settings-item__info">
                <BookmarkX size={18} color="#ef4444" />
                <span className="text-danger">Deactivate Account</span>
              </div>
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
                {isDeleting ? "Clearing..." : "Delete Everything"}
              </button>
            </div>
          </div>
        </InfoModal>

        <InfoModal
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          title="Delete Account"
        >
          <div className="delete-modal">
            <div className="delete-modal__warning">
              <div className="warning-icon-bg">
                <AlertTriangle size={32} />
              </div>
              <h3>Are you sure?</h3>
              <p>
                This will deactivate your account and you will lose access to
                your scan history.
                <strong> This cannot be undone.</strong>
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

        {/* <InfoModal
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          title="Delete account?"
        >
          <div className="modal-content">
            <p>
              Are you sure? This will deactivate your account and you will lose
              access to your scan history.
            </p>
            <div className="modal-actions">
              <button onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? "Processing..." : "Confirm Deactivation"}
              </button>
            </div>
          </div>
        </InfoModal> */}

        {/* <InfoModal
          isOpen={showSubWarning}
          onClose={() => setShowSubWarning(false)}
          title="Action required"
        >
          <div className="modal-content">
            <p>
              You currently have an active Pro subscription. To prevent further
              charges to your account, you must cancel your subscription in the
              billing portal before deactivating your account.
            </p>
            <div className="modal-actions">
              <Link href="/billing" className="btn-primary">
                Billing
              </Link>
              <button onClick={() => setShowSubWarning(false)}>Close</button>
            </div>
          </div>
        </InfoModal> */}

        {/* <InfoModal
          isOpen={showSubWarning}
          onClose={() => setShowErrorModal(false)}
          title="An error occurred"
        >
          <div className="modal-content">
            <p>
              An error occurred when trying to deactivate your account. If you
              are a Pro user, please make sure you have canceled any
              subscriptions to FlipSavvy before requesting to deactivate your
              account.
            </p>
            <div className="modal-actions">
              <Link href="/billing" className="btn-primary">
                Billing
              </Link>
              <button onClick={() => setShowSubWarning(false)}>Close</button>
            </div>
          </div>
        </InfoModal> */}

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
                you are a Pro user, please make sure you have canceled any
                subscriptions to FlipSavvy before deactivating your account.
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
              {user?.subscriptionStatus !== "basic" ? (
                <Link href={"/listing"}>
                  <button
                    className="modal-btn modal-btn--secondary"
                    // disabled={isDeleting}
                  >
                    To SEO Generator
                  </button>
                </Link>
              ) : (
                ""
              )}

              <div className="modal-btn modal-btn--danger">
                <Link href="/account" className="btn-primary">
                  Account
                </Link>
              </div>
            </div>
          </div>
        </InfoModal>
      </div>
    </main>
  );
}
