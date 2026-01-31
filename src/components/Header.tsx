"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  MoreHorizontal,
  ToolCase,
  Settings2,
  Calculator,
  Wand2,
  Boxes,
  History,
  BadgeDollarSign,
  CircleDollarSign,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Header() {
  const { user, setUser, isLoading } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const subscriptionStatus = user?.subscriptionStatus?.toLowerCase() || "basic";
  const isPro = subscriptionStatus === "pro";
  const isHobby = subscriptionStatus === "hobby";
  const isBusiness = subscriptionStatus === "business";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  const navItems = [
    {
      label: "Home",
      href: "/dashboard",
      icon: LayoutDashboard,
      "data-ph-capture-attribute-button-name": "nav-dashboard-button",
      "data-ph-capture-attribute-feature": "navigation",
    },
    {
      label: "Account",
      href: "/account",
      icon: User,
      "data-ph-capture-attribute-button-name": "nav-account-button",
      "data-ph-capture-attribute-feature": "navigation",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings2,
      "data-ph-capture-attribute-button-name": "nav-settings-button",
      "data-ph-capture-attribute-feature": "navigation",
    },
  ];

  return (
    <>
      {!isLoading && (
        <nav className="mobile-nav" ref={menuRef}>
          <div className="mobile-nav__container">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobile-nav__link ${isActive ? "is-active" : ""}`}
                  data-ph-capture-attribute-button-name={
                    item["data-ph-capture-attribute-button-name"]
                  }
                  data-ph-capture-attribute-feature={
                    item["data-ph-capture-attribute-feature"]
                  }
                >
                  <Icon size={24} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* MORE MENU TOGGLE */}
            <button
              className={`mobile-nav__link ${isMoreOpen ? "is-active" : ""}`}
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              data-ph-capture-attribute-button-name="nav-burger-menu-button"
              data-ph-capture-attribute-feature="navigation"
            >
              <MoreHorizontal size={24} />
              <span>More</span>
            </button>

            {/* POPUP MENU */}
            <div
              className={`mobile-nav__popover ${isMoreOpen ? "is-visible" : ""}`}
            >
              {isBusiness && (
                <Link
                  href="/inventory"
                  className="popover-item"
                  onClick={() => setIsMoreOpen(false)}
                  data-ph-capture-attribute-button-name="nav-inventory-button"
                  data-ph-capture-attribute-feature="navigation"
                >
                  <Boxes size={20} />
                  <span>Inventory</span>
                </Link>
              )}
              {(isPro || isBusiness) && (
                <Link
                  href="/listing"
                  className="popover-item"
                  onClick={() => setIsMoreOpen(false)}
                  data-ph-capture-attribute-button-name="nav-listing-studio-button"
                  data-ph-capture-attribute-feature="navigation"
                >
                  <Wand2 size={20} />
                  <span>Listing Studio</span>
                </Link>
              )}

              {(isHobby || isPro || isBusiness) && (
                <Link
                  href="/calculator"
                  className="popover-item"
                  onClick={() => setIsMoreOpen(false)}
                  data-ph-capture-attribute-button-name="nav-calculator-button"
                  data-ph-capture-attribute-feature="navigation"
                >
                  <CircleDollarSign size={20} />
                  <span>Calculator</span>
                </Link>
              )}

              <Link
                href="/history"
                className="popover-item"
                onClick={() => setIsMoreOpen(false)}
                data-ph-capture-attribute-button-name="nav-history-button"
                data-ph-capture-attribute-feature="navigation"
              >
                <History size={20} />
                <span>Scan History</span>
              </Link>
              <button
                className="popover-item logout"
                onClick={handleLogout}
                data-ph-capture-attribute-button-name="nav-logout-button"
                data-ph-capture-attribute-feature="navigation"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
