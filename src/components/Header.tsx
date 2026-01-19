"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { signOut, useSession } from "next-auth/react";

interface HeaderProps {
  user: any;
}

export default function Header({ user }: HeaderProps) {
  const { data: session, update } = useSession();
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const subscriptionStatus =
    session?.user?.subscriptionStatus || user?.subscriptionStatus;
  const isPro = subscriptionStatus?.toLowerCase() === "pro";
  const isHobby = subscriptionStatus?.toLowerCase() === "hobby";
  const isBusiness = subscriptionStatus?.toLowerCase() === "business";

  useEffect(() => {
    if (user && update) {
      update();
    }
  }, [user]);

  // Close "More" menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) return null; // Don't show nav if not logged in

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const navItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Account", href: "/account", icon: User },
    { label: "Settings", href: "/settings", icon: Settings2 },
  ];

  return (
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
        >
          <MoreHorizontal size={24} />
          <span>More</span>
        </button>

        {/* POPUP MENU */}
        <div
          className={`mobile-nav__popover ${isMoreOpen ? "is-visible" : ""}`}
        >
          {(isPro || isBusiness) && (
            <Link
              href="/inventory"
              className="popover-item"
              onClick={() => setIsMoreOpen(false)}
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
            >
              <CircleDollarSign size={20} />
              <span>Calculator</span>
            </Link>
          )}

          <Link
            href="/settings"
            className="popover-item"
            onClick={() => setIsMoreOpen(false)}
          >
            <History size={20} />
            <span>Scan History</span>
          </Link>
          <button className="popover-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
