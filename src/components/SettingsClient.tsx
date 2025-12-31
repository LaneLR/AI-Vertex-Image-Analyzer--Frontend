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
  Cpu,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import InfoModal from "./InfoModal";

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

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/clear-history", { method: "DELETE" });
      if (res.ok) {
        // You might want to refresh history or update local state here
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
  }, [user?.darkMode]);

  const toggleDarkMode = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    const newDarkModeStatus = !localDarkMode;

    try {
      const res = await fetch("/api/user/update-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ darkMode: newDarkModeStatus }),
      });

      if (res.ok) {
        setLocalDarkMode(newDarkModeStatus);
        await update({ darkMode: newDarkModeStatus });
        document.documentElement.classList.toggle("dark", newDarkModeStatus);
      }
    } catch (err) {
      console.error("Failed to update dark mode", err);
    } finally {
      setIsUpdating(false);
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
        <section className="settings-group">
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
        </section>

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
              <span className="version-tag">V 1.0.4</span>
            </div>
          </div>
        </section>

        {/* DANGER ZONE SECTION */}
        <section className="settings-group">
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
      </div>
    </main>
  );
}
