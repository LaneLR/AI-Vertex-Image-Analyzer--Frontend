"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Eye,
  Lock,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyClient() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <main className="privacy-page">
      {/* Navigation */}
      <header className="privacy-page__header">
        <button
          onClick={handleBack}
          className="back-btn"
          data-ph-capture-attribute-button-name="privacy-back-btn"
          data-ph-capture-attribute-feature="back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Privacy & Security</h1>
        <div className="header-spacer" />
      </header>

      <div className="privacy-page__content">
        {/* Hero Section */}
        <section className="privacy-hero">
          <div className="privacy-hero__icon">
            <ShieldCheck size={48} />
          </div>
          <h2 className="privacy-hero__title">Your Data, Protected</h2>
          {/* <p className="privacy-hero__subtitle">
            We believe in transparency. Here is how ResaleIQ handles your information.
          </p> */}
          <span className="last-updated-tag">Last updated December 2025</span>
        </section>

        <div className="privacy-grid">
          {/* Section 1 */}
          <section className="privacy-section">
            <div className="privacy-section__header">
              <div className="section-icon">
                <Eye size={18} />
              </div>
              <h3>1. Information We Collect</h3>
            </div>
            <div className="privacy-card">
              <p>
                When you use ResaleIQ, we collect images you upload for AI
                appraisal, as well as basic account information to provide you
                with market insights.
              </p>
              {/* <div className="data-pill">
                <Lock size={12} />
                Encrypted at rest & in transit
              </div> */}
            </div>
          </section>

          {/* Section 2 */}
          <section className="privacy-section">
            <div className="privacy-section__header">
              <div className="section-icon">
                <FileText size={18} />
              </div>
              <h3>2. How We Use Data</h3>
            </div>
            <div className="privacy-card">
              <p>
                Your data helps improve our AI models to provide more accurate
                valuations. We do <strong>not</strong> sell your personal
                identification, contact information, or uploaded images to third
                parties for marketing purposes.
              </p>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <footer className="privacy-footer">
          <h4 className="privacy-footer__title">Have questions?</h4>
          <p>We’re here to help you understand your rights.</p>

          <div className="privacy-footer__links">
            <Link
              href="/terms"
              className="footer-link-card"
              data-ph-capture-attribute-button-name="privacy-terms-btn"
              data-ph-capture-attribute-feature="privacy"
            >
              <div className="footer-link-card__content">
                <FileText size={18} />
                <span>Terms of Service</span>
              </div>
              <ChevronRight size={16} />
            </Link>

            <Link
              href="/help"
              className="footer-link-card"
              data-ph-capture-attribute-button-name="privacy-help-faq-btn"
              data-ph-capture-attribute-feature="privacy"
            >
              <div className="footer-link-card__content">
                <ShieldCheck size={18} />
                <span>Help & FAQ</span>
              </div>
              <ChevronRight size={16} />
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
