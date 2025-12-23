"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyClient() {
  return (
    <main className="privacy-page">
      {/* Navigation Header */}
      <nav className="account__nav">
        <Link href="/" className="account__nav-back">
          <ArrowLeft className="account__nav-back-icon" />
        </Link>
        <h1 className="account__nav-title">PRIVACY</h1>
      </nav>

      {/* Hero / Header Section */}
      <header className="privacy-page__header">
        <h1 className="privacy-page__title">Privacy Policy</h1>
        <p className="privacy-page__last-updated">Last Updated: December 2025</p>
      </header>

      {/* Main Content */}
      <section className="privacy-page__content">
        <div className="privacy-page__section">
          <h2 className="privacy-page__section-title">1. Information We Collect</h2>
          <p className="privacy-page__text">
            When you use Flip Finder, we collect images you upload for AI appraisal, 
            as well as basic account information to provide you with market insights.
            This data is encrypted in transit and at rest.
          </p>
        </div>

        <div className="privacy-page__section">
          <h2 className="privacy-page__section-title">2. How We Use Data</h2>
          <p className="privacy-page__text">
            Your data helps improve our AI models to provide more accurate valuations. 
            We do not sell your personal identification, contact information, or 
            uploaded images to third parties for marketing purposes.
          </p>
        </div>

        {/* Footer Navigation within Privacy */}
        <div className="privacy-page__navigation">
          <p className="privacy-page__nav-text">
            Have questions about how we handle your data?
          </p>
          <div className="privacy-page__links">
            <Link href="/terms" className="privacy-page__link">
              Terms of Service
            </Link>
            <Link href="/help" className="privacy-page__link">
              Help & FAQ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}