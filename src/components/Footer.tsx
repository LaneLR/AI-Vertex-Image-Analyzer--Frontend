"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, ShieldCheck, Info, Github, Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          {/* Brand Info */}
          <div className="footer__section footer__section--brand">
            <div className="footer__logo">
              <Link
                href="/"
                className="brand-link"
              >
                {/* <span className="brand-logo-small">FF</span> */}
                <h1 className="brand-text">
                  Flip<span>Finder</span>
                </h1>
              </Link>
            </div>
            <p className="footer__tagline">
              Professional AI vision tools for the modern reseller.
            </p>
            <div className="footer__badges">
              <span className="badge-pill">
                <Sparkles size={12} /> Powered by Gemini
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer__section">
            <h4 className="footer__label">Resources</h4>
            <ul className="footer__list">
              <li>
                <Link href="/help" className="footer__link">
                  <HelpCircle size={16} /> Help Center
                </Link>
              </li>
              <li>
                <Link href="/about" className="footer__link">
                  <Info size={16} /> About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__label">LEGAL</h4>
            <ul className="footer__list">
              <li>
                <Link href="/terms" className="footer__link">
                  <ShieldCheck size={16} /> Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="footer__link">
                  <ShieldCheck size={16} /> Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            © {currentYear} Flip Finder • v1.13.7
          </div>
        </div>
      </div>
    </footer>
  );
}
