"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import InfoModal from "./InfoModal";

export default function HelpClient() {
  const [activeModal, setActiveModal] = useState<{title: string, content: string} | null>(null);

  const helpTopics = [
    { title: "AI Appraisals", content: "Our AI analyzes thousands of historical market data points from eBay, Poshmark, and Grailed to give you an estimate based on current demand." },
    { title: "Payment Methods", content: "We currently support Stripe, Apple Pay, and Google Pay for Pro subscriptions." }
  ];

  const handleSupportClick = () => {
    // Logic for contact support (e.g., mailto or intercom)
    window.location.href = "mailto:support@flipfinder.com";
  };

  return (
    <main className="help-page">
      {/* Navigation */}
      <nav className="account__nav">
        <Link href="/" className="account__nav-back">
          <ArrowLeft className="account__nav-back-icon" />
        </Link>
        <h1 className="account__nav-title">HELP</h1>
      </nav>

      {/* Hero Section */}
      <section className="help-page__hero">
        <h1 className="help-page__title">How can we help?</h1>
      </section>

      {/* Help Categories */}
      <section className="help-page__categories">
        <div className="help-page__grid">
          
          <div className="help-page__category-card">
            <h3 className="help-page__category-title">Getting Started</h3>
            <ul className="help-page__list">
              <li className="help-page__list-item">How to value your first item</li>
              <li className="help-page__list-item">Setting up your profile</li>
              <li className="help-page__list-item">Understanding AI appraisals</li>
            </ul>
          </div>

          <div className="help-page__category-card">
            <h3 className="help-page__category-title">Account & Billing</h3>
            <ul className="help-page__list">
              <li className="help-page__list-item">Manage your subscription</li>
              <li className="help-page__list-item">Payment methods</li>
              <li className="help-page__list-item">Deleting your account</li>
            </ul>
          </div>

          <div className="help-page__category-card help-page__category-card--alert">
            <h3 className="help-page__category-title">Troubleshooting</h3>
            <ul className="help-page__list">
              <li className="help-page__list-item">Image upload errors</li>
              <li className="help-page__list-item">App crashes on iOS/Android</li>
              <li className="help-page__list-item">Contact support</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Bottom Contact Section */}
      <footer className="help-page__footer">
        <p className="help-page__footer-text">Still need help?</p>
        <button 
          className="help-page__btn help-page__btn--primary"
          onClick={handleSupportClick}
        >
          Contact Support
        </button>
      </footer>
        <ul className="help-page__list">
          {helpTopics.map((topic) => (
            <li 
              key={topic.title} 
              className="help-page__list-item"
              onClick={() => setActiveModal({ title: topic.title, content: topic.content })}
              style={{ cursor: "pointer" }}
            >
              {topic.title}
            </li>
          ))}
        </ul>

      {/* Reusable Modal */}
      <InfoModal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        title={activeModal?.title || ""}
      >
        <p>{activeModal?.content}</p>
      </InfoModal>
    </main>
  );
}