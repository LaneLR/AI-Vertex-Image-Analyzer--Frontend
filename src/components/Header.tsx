"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Menu, 
  User, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  X 
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing cookies or calling an API)
    console.log("Logging out...");
    window.location.href = "/login";
  };

  return (
    <header className="header">
      <div className="header__container" ref={menuRef}>
        {/* MENU TOGGLE */}
        <button 
          className="header__menu-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X /> : <Menu className="header__menu-icon" />}
        </button>

        <Link href="/" className="header__brand">
          <h1 className="header__title">Flip Finder</h1>
        </Link>

        <Link href="/account" className="header__account-btn">
          <User className="header__account-icon" />
        </Link>

        {/* DROPDOWN MENU */}
        {isMenuOpen && (
          <nav className="header__dropdown">
            <ul className="header__list">
              <li className="header__item">
                <Link href="account" className="header__link" onClick={() => setIsMenuOpen(false)}>
                  <User size={18} /> Profile
                </Link>
              </li>
              <li className="header__item">
                <Link href="/settings" className="header__link" onClick={() => setIsMenuOpen(false)}>
                  <Settings size={18} /> Settings
                </Link>
              </li>
              <li className="header__item">
                <Link href="/privacy" className="header__link" onClick={() => setIsMenuOpen(false)}>
                  <ShieldCheck size={18} /> Privacy
                </Link>
              </li>
              <li className="header__divider"></li>
              <li className="header__item">
                <button className="header__link header__link--logout" onClick={handleLogout}>
                  <LogOut size={18} /> Logout
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}