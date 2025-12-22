import React from "react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="terms-page">
      <header className="terms-page__header">
        <h1 className="terms-page__title">Terms of Service</h1>
        <p className="terms-page__subtitle">Please read these terms carefully before using Flip Finder.</p>
      </header>

      <section className="terms-page__body">
        <div className="terms-page__clause">
          <h2 className="terms-page__clause-heading">1. Acceptance of Terms</h2>
          <p className="terms-page__text">
            By accessing or using Flip Finder, you agree to be bound by these Terms of Service. 
            If you do not agree, you may not use our AI appraisal tools or platform.
          </p>
        </div>

        <div className="terms-page__clause">
          <h2 className="terms-page__clause-heading">2. User Conduct & Content</h2>
          <p className="terms-page__text">
            Users are responsible for the images they upload. You must own the rights to any 
            photographs submitted for appraisal. We reserve the right to terminate accounts 
            that upload prohibited or harmful content.
          </p>
        </div>

        <div className="terms-page__clause">
          <h2 className="terms-page__clause-heading">3. AI Accuracy Disclaimer</h2>
          <p className="terms-page__text">
            Flip Finder provides AI-generated estimates based on market data. These are 
            <strong> suggestions</strong>, not professional appraisals. We are not liable 
            for financial losses resulting from buying or selling decisions made using our data.
          </p>
        </div>

        <div className="terms-page__footer">
          <p className="terms-page__footer-note">
            Need clarification? Check our <Link href="/help" className="terms-page__footer-link">Help Center</Link> or 
            review our <Link href="/privacy" className="terms-page__footer-link">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}