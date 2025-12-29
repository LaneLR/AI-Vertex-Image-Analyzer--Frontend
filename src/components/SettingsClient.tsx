"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Eye,
  Database,
  Shield,
  Smartphone,
  ChevronRight,
  ArrowLeft,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

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
  // Local state to force re-render and reflect darkMode immediately
  const [localDarkMode, setLocalDarkMode] = useState(user?.darkMode ?? false);

  React.useEffect(() => {
    setLocalDarkMode(user?.darkMode ?? false);
  }, [user?.darkMode]);

  const toggleAccuracy = () => setHighAccuracy(!highAccuracy);
  const toggleHistory = () => setSaveHistory(!saveHistory);

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
        if (newDarkModeStatus) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    } catch (err) {
      console.error("Failed to update dark mode", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="settings">
      <nav className="settings__nav">
        <Link href="/account" className="settings__nav-back">
          <ArrowLeft className="settings__nav-back-icon" />
        </Link>
        <h1 className="settings__nav-title">SETTINGS</h1>
      </nav>

      <div className="settings__container">
        <section className="settings__section">
          <h3 className="settings__section-title">Appearance</h3>
          <div className="settings__card">
            <div className="settings__row">
              <div className="settings__row-info">
                <div className="settings__row-icon-bg settings__row-icon-bg--dark">
                  <Moon className="settings__row-icon" />
                </div>
                <div>
                  <p className="settings__row-label">Dark Mode</p>
                  <p className="settings__row-desc">
                    Easier on the eyes in low light
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                disabled={isUpdating}
                className={`settings__toggle ${
                  localDarkMode ? "settings__toggle--on" : ""
                }`}
                aria-pressed={localDarkMode ? "true" : "false"}
              >
                <div
                  className={`settings__toggle-knob ${
                    localDarkMode ? "settings__toggle-knob--on" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </section>
        <section className="settings__section">
          <h3 className="settings__section-title settings__section-title--ai">
            <Sparkles className="settings__section-title-icon" /> AI Engine
            Configuration
          </h3>

          <div className="settings__card">
            <div className="settings__row">
              <div className="settings__row-info">
                <div className="settings__row-icon-bg settings__row-icon-bg--ai">
                  <Eye className="settings__row-icon settings__row-icon--ai" />
                </div>
                <div>
                  <p className="settings__row-label">High Accuracy Mode</p>
                  <p className="settings__row-desc">
                    Uses advanced visual tiling
                  </p>
                </div>
              </div>
              <button
                onClick={toggleAccuracy}
                className={`settings__toggle ${
                  highAccuracy ? "settings__toggle--on" : ""
                }`}
              >
                <div
                  className={`settings__toggle-knob ${
                    highAccuracy ? "settings__toggle-knob--on" : ""
                  }`}
                />
              </button>
            </div>

            <div className="settings__row settings__row--border">
              <div className="settings__row-info">
                <div className="settings__row-icon-bg">
                  <Database className="settings__row-icon settings__row-icon--db" />
                </div>
                <div>
                  <p className="settings__row-label">Cloud Save History</p>
                  <p className="settings__row-desc">
                    Keep logs of all scanned items
                  </p>
                </div>
              </div>
              <button
                onClick={toggleHistory}
                className={`settings__toggle ${
                  saveHistory
                    ? "settings__toggle--on settings__toggle--blue"
                    : ""
                }`}
              >
                <div
                  className={`settings__toggle-knob ${
                    saveHistory ? "settings__toggle-knob--on" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        <section className="settings__section">
          <h3 className="settings__section-title">Preferences</h3>
          <div className="settings__prefs-card">
            <Link
              href="/privacy"
              className="settings__prefs-row"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="settings__prefs-row-info">
                <Shield className="settings__prefs-row-icon" />
                <span>Data & Privacy</span>
              </div>
              <ChevronRight className="settings__prefs-row-chevron" />
            </Link>

            <div className="settings__prefs-row">
              <div className="settings__prefs-row-info">
                <Smartphone className="settings__prefs-row-icon" />
                <span>App Version</span>
              </div>
              <span className="settings__prefs-version">V 1.0.4</span>
            </div>
          </div>
        </section>

        <section className="settings__section settings__section--danger">
          <button
            className="settings__danger-btn"
            onClick={() =>
              confirm("Are you sure? This will clear your local scan cache.")
            }
          >
            Delete All History
          </button>
        </section>
      </div>
    </main>
  );
}
