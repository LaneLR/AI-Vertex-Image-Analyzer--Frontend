"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  UserCheck,
  AlertCircle,
  HelpCircle,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsClient() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };
  return (
    <main className="terms-page">
      <header className="terms-page__header">
        <button
          onClick={handleBack}
          className="back-btn"
          data-ph-capture-attribute-button-name="terms-back-btn"
          data-ph-capture-attribute-feature="back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Legal Agreement</h1>
        <div className="header-spacer" />
      </header>

      <div className="terms-page__content">
        {/* Hero Section */}
        <section className="terms-hero">
          <div className="terms-hero__icon">
            <Scale size={44} />
          </div>
          <h2 className="terms-hero__title">Terms of Service</h2>
          <p className="terms-hero__subtitle">
            Please read these terms carefully before using the ResaleIQ studio
            and AI tools.
          </p>
          <div className="version-pill">Last Updated: Dec 30, 2025</div>
        </section>

        <section className="terms-body">
          {/* Clause 1 */}
          <div className="terms-card">
            <div className="terms-card__header">
              <UserCheck size={20} className="clause-icon" />
              <h3>1. Acceptance of Terms</h3>
            </div>
            <p>
              By accessing or using ResaleIQ, you agree to be bound by these
              Terms of Service. If you do not agree, you may not use our AI
              appraisal tools or platform.
            </p>
          </div>

          {/* Clause 2 */}
          <div className="terms-card">
            <div className="terms-card__header">
              <Shield size={20} className="clause-icon" />
              <h3>2. User Conduct & Content</h3>
            </div>
            <p>
              Users are responsible for the images they upload. You must own the
              rights to any photographs submitted for appraisal. We reserve the
              right to terminate accounts that upload prohibited or harmful
              content.
            </p>
          </div>

          {/* Clause 3 */}
          <div className="terms-card terms-card--highlight">
            <div className="terms-card__header">
              <AlertCircle size={20} className="clause-icon" />
              <h3>3. AI Accuracy Disclaimer</h3>
            </div>
            <p>
              ResaleIQ provides AI-generated estimates based on market data.
              These are <strong>suggestions</strong>, not professional
              appraisals. We are not liable for financial losses resulting from
              buying or selling decisions made using our data.
            </p>
          </div>
        </section>

        {/* Footer Navigation */}
        <footer className="terms-footer">
          <div className="help-box">
            <HelpCircle size={24} />
            <div>
              <h4>Need clarification?</h4>
              <p>
                Visit our{" "}
                <Link
                  href="/help"
                  data-ph-capture-attribute-button-name="terms-help-center-btn"
                  data-ph-capture-attribute-feature="terms"
                >
                  Help Center
                </Link>{" "}
                or review our{" "}
                <Link
                  href="/privacy"
                  data-ph-capture-attribute-button-name="terms-privacy-btn"
                  data-ph-capture-attribute-feature="terms"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
