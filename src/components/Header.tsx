"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  X,
  LayoutDashboard,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, update } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="main-header">
      <div className="header-container" ref={menuRef}>
        {/* LEFT: MENU TOGGLE */}
        {!session ? (
          <div className="filler" />
        ) : (
          <button
            className={`menu-toggle ${isMenuOpen ? "is-active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* CENTER: BRAND */}

        {!session ? (
          <Link
            href="/"
            className="brand-link"
            onClick={() => setIsMenuOpen(false)}
          >
            {/* <span className="brand-logo-small">FF</span> */}
            <h1 className="brand-text">
              Flip<span>Finder</span>
            </h1>
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="brand-link"
            onClick={() => setIsMenuOpen(false)}
          >
            {/* <span className="brand-logo-small">FF</span> */}
            <h1 className="brand-text">
              Flip<span>Finder</span>
            </h1>
          </Link>
        )}
        {/* RIGHT: QUICK ACTION */}
        {!session ? (
          <Link href={"/login"}>
            <button className="login-btn">Sign in</button>
          </Link>
        ) : (
          <Link href="/account" className="account-quick-link">
            <div className="avatar-placeholder">
              <User size={20} />
            </div>
          </Link>
        )}

        {/* OVERLAY NAVIGATION */}
        <div className={`nav-overlay ${isMenuOpen ? "is-visible" : ""}`}>
          <nav className="dropdown-nav">
            <div className="nav-header">
              <span>Studio Navigation</span>
            </div>
            <ul className="nav-list">
              <li>
                <Link
                  href="/dashboard"
                  className="nav-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard size={20} />
                  <div className="nav-item-content">
                    <span className="nav-label">Dashboard</span>
                    <span className="nav-desc">Start a new appraisal</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="nav-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  <div className="nav-item-content">
                    <span className="nav-label">Profile</span>
                    <span className="nav-desc">Account & Subscription</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="nav-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings size={20} />
                  <div className="nav-item-content">
                    <span className="nav-label">Settings</span>
                    <span className="nav-desc">Preferences & History</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="nav-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShieldCheck size={20} />
                  <div className="nav-item-content">
                    <span className="nav-label">Privacy</span>
                    <span className="nav-desc">Data & Security</span>
                  </div>
                </Link>
              </li>
              <li className="nav-divider"></li>
              <li>
                <button className="nav-item logout-btn" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span className="nav-label">Sign Out</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
