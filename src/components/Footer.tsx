"use client";
import Link from "next/link";
import { HelpCircle, ShieldCheck, Info, Github } from "lucide-react";
import "../styles/common/_footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Main Footer Links */}
        <div className="footer__links">
          <div className="footer__section">
            <h4 className="footer__section-title">Support</h4>
            <ul className="footer__list">
              <li>
                <Link
                  href="/help"
                  className="footer__link footer__link--support"
                >
                  <HelpCircle className="footer__icon" /> Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="footer__link footer__link--support"
                >
                  <Info className="footer__icon" /> About Flip Finder
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer__section">
            <h4 className="footer__section-title">Legal</h4>
            <ul className="footer__list">
              <li>
                <Link
                  href="/terms"
                  className="footer__link footer__link--legal"
                >
                  <ShieldCheck className="footer__icon" /> Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="footer__link footer__link--legal"
                >
                  <ShieldCheck className="footer__icon" /> Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Branding & Copyright */}
        <div className="footer__branding">
          <p className="footer__copyright">
            © 2025 FLIP FINDER AI • VERSION 1.0.4
          </p>
          <div className="footer__social">
            <Github className="footer__social-icon" />
          </div>
        </div>
      </div>
    </footer>
  );
}
