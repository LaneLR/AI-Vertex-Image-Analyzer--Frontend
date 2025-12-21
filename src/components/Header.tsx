"use client";
import Link from "next/link";
import { Menu, User } from "lucide-react";
import "../styles/common/_header.scss";

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <button className="header__menu-btn">
          <Menu className="header__menu-icon" />
        </button>

        <Link href="/" className="header__brand">
          <h1 className="header__title">Flip Finder</h1>
        </Link>

        <Link href="/account" className="header__account-btn">
          <User className="header__account-icon" />
        </Link>
      </div>
    </header>
  );
}
