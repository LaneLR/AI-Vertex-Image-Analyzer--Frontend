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
};

interface SettingsClientProps {
  user?: User;
}

export default function SettingsClient({
  user: initialUser,
}: SettingsClientProps) {
  const { data: session, update } = useSession();
  const user = session?.user || initialUser;

  const [highAccuracy, setHighAccuracy] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localDarkMode, setLocalDarkMode] = useState(user?.darkMode ?? false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSubWarning, setShowSubWarning] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isListingStudioModalOpen, setIsListingStudioModalOpen] =
    useState(false);

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
      <header className="settings-page__header">
        <Link href="/account" className="back-circle">
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
                  <Moon size={18} />
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
              onClick={() => setIsListingStudioModalOpen(true)}
              className="settings-item settings-item--clickable cursor-pointer"
            >
              <div className="settings-item__info">
                <div className="icon-box icon-box--shield">
                  <Wand2 size={18} />
                </div>
                <p className="item-label">Listing Studio</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </div>

            <Link
              href="/history"
              className="settings-item settings-item--clickable"
            >
              <div className="settings-item__info">
                <div className="icon-box icon-box--shield">
                  <History size={18} />
                </div>
                <p className="item-label">Scan History</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </Link>

            <Link
              href="/calculator"
              className="settings-item settings-item--clickable"
            >
              <div className="settings-item__info">
                <div className="icon-box icon-box--shield">
                  <DollarSign size={18} />
                </div>
                <p className="item-label">Profit Calculator</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </Link>
          </div>
        </section>

        <InfoModal
          isOpen={isListingStudioModalOpen}
          onClose={() => setIsListingStudioModalOpen(false)}
          title="Listing Studio"
        >
          <div className="feature-info-modal">
            <div className="feature-info-modal__icon">
              {/* <div className="icon-box icon-box--large">
                <Wand2 size={32} />
              </div> */}
            </div>
            {/* <h3>Professional Listings in Seconds</h3> */}
            <p>
              Listing Studio uses advanced AI to generate SEO-optimized titles
              and descriptions for your items.
            </p>
            <br />
            <div className="feature-benefits">
              <div>
                <strong>Smart Descriptions:</strong> Automatically highlights
                key features and flaws.
              </div>
              <div>
                <strong>SEO Keywords:</strong> Higher visibility on eBay,
                Poshmark, and Depop.
              </div>
              <div>
                <strong>Multi-Photo Analysis:</strong> Analyzes up to 3 photos
                for maximum accuracy.
              </div>
            </div>
            <br />
            <div className="delete-modal__actions">
              {/* <Link
                href="/listing"
                className="modal-btn modal-btn--primary text-center"
              >
                <button className="modal-btn modal-btn--secondary">
                  Go to Studio
                </button>
              </Link> */}
              <div
                className="modal-btn modal-btn--primary text-center"
                onClick={() => setIsListingStudioModalOpen(false)}
              >
                <div className="modal-btn modal-btn--secondary">
                  Close
                </div>
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
                  <Shield size={18} />
                </div>
                <p className="item-label">Data & Privacy</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </Link>

            <div className="settings-item">
              <div className="settings-item__info">
                <div className="icon-box icon-box--phone">
                  <Smartphone size={18} />
                </div>
                <p className="item-label">App Version</p>
              </div>
              <span className="version-tag">1.13.7</span>
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
          title="Clear history"
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
          title="Delete account?"
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
                  : "Delete Account"}
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
                Go to Billing
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
              subscriptions to Flip Finder before requesting to deactivate your
              account.
            </p>
            <div className="modal-actions">
              <Link href="/billing" className="btn-primary">
                Go to Billing
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
                subscriptions to Flip Finder before deactivating your account.
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
              <div className="modal-btn modal-btn--danger">
                <Link href="/account" className="btn-primary">
                  Go to Account
                </Link>
              </div>
            </div>
          </div>
        </InfoModal>
      </div>
    </main>
  );
}
