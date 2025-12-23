"use client";

import React, { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Database,
  Sparkles,
  Eye,
  Smartphone,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  // Toggle States
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <main className="settings">
      {/* HEADER */}
      <nav className="settings__nav">
        <Link href="/account" className="settings__nav-back">
          <ArrowLeft className="settings__nav-back-icon" />
        </Link>
        <h1 className="settings__nav-title">SETTINGS</h1>
      </nav>

      <div className="settings__container">
        {/* AI ENGINE SETTINGS */}
        <section className="settings__section">
          <h3 className="settings__section-title settings__section-title--ai">
            <Sparkles className="settings__section-title-icon" /> AI Engine
            Configuration
          </h3>
          <div className="settings__card">
            {/* Toggle Row: High Accuracy */}
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
                onClick={() => setHighAccuracy(!highAccuracy)}
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
            {/* Toggle Row: Save History */}
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
                onClick={() => setSaveHistory(!saveHistory)}
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

        {/* PREFERENCES */}
        <section className="settings__section">
          <h3 className="settings__section-title">Preferences</h3>
          <div className="settings__prefs-card">
            <div className="settings__prefs-row">
              <div className="settings__prefs-row-info">
                <Bell className="settings__prefs-row-icon" />
                <span>Notifications</span>
              </div>
              <ChevronRight className="settings__prefs-row-chevron" />
            </div>
            <div className="settings__prefs-row">
              <div className="settings__prefs-row-info">
                <Shield className="settings__prefs-row-icon" />
                <span>Data & Privacy</span>
              </div>
              <ChevronRight className="settings__prefs-row-chevron" />
            </div>
            <div className="settings__prefs-row">
              <div className="settings__prefs-row-info">
                <Smartphone className="settings__prefs-row-icon" />
                <span>App Version</span>
              </div>
              <span className="settings__prefs-version">V 1.0.4</span>
            </div>
          </div>
        </section>

        {/* DANGER ZONE */}
        <section className="settings__section settings__section--danger">
          <button className="settings__danger-btn">Delete All History</button>
        </section>
      </div>
    </main>
  );
}
