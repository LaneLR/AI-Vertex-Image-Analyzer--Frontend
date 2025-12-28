"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import InfoModal from "./InfoModal";

export default function HelpClient() {
  const [activeModal, setActiveModal] = useState<{ title: string; content: string } | null>(null);

  // Structured data for all help topics
  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      items: [
        { 
          title: "How to value your first item", 
          content: "Simply upload a clear photo of your item or type in the name and brand. Our AI will scan the web and provide an estimated resale value within seconds." 
        },
        { 
          title: "Setting up your profile", 
          content: "Go to the Account page to verify your email. Verification is required to save your appraisal history across devices." 
        },
        { 
          title: "Understanding AI appraisals", 
          content: "Flip Finder uses deep learning to compare your item against live listings on platforms like eBay and Poshmark. The price shown is an 'Estimated Market Value' based on recent successful sales." 
        },
      ],
    },
    {
      id: "billing",
      title: "Account & Billing",
      items: [
        { 
          title: "Manage your subscription", 
          content: "You can manage your Pro plan in the Account settings. On the web, this uses Stripe. If you subscribed via the mobile app, you must manage it through your Apple Subscriptions." 
        },
        { 
          title: "Payment methods", 
          content: "We currently support all major credit cards via Stripe on the web, and Apple Pay/App Store billing on our mobile application." 
        },
        { 
          title: "Deleting your account", 
          content: "Account deletion can be requested via settings. Please note that active subscriptions should be canceled before deleting your account to avoid further charges." 
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      alert: true,
      items: [
        { 
          title: "Image upload errors", 
          content: "Ensure your image is in JPG or PNG format and under 5MB. If the error persists, check your internet connection or try a different photo." 
        },
        { 
          title: "App crashes", 
          content: "Make sure you are running the latest version of the Flip Finder app. If it continues to crash, try clearing your cache or reinstalling the app." 
        },
      ],
    },
  ];

  const handleSupportClick = () => {
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
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className={`help-page__category-card ${cat.alert ? 'help-page__category-card--alert' : ''}`}
            >
              <h3 className="help-page__category-title">{cat.title}</h3>
              <ul className="help-page__list">
                {cat.items.map((item) => (
                  <li 
                    key={item.title} 
                    className="help-page__list-item"
                    onClick={() => setActiveModal({ title: item.title, content: item.content })}
                  >
                    <span>{item.title}</span>
                    <ChevronRight size={16} className="help-page__chevron" />
                  </li>
                ))}
                {/* Special case for Contact Support in Troubleshooting */}
                {cat.id === "troubleshooting" && (
                  <li className="help-page__list-item" onClick={handleSupportClick}>
                    <span>Contact support</span>
                    <ChevronRight size={16} className="help-page__chevron" />
                  </li>
                )}
              </ul>
            </div>
          ))}
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

      {/* Reusable Modal */}
      <InfoModal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        title={activeModal?.title || ""}
      >
        <div className="help-modal-content">
          <p style={{ color: "#333" }}>
            {activeModal?.content}
          </p>
        </div>
      </InfoModal>
    </main>
  );
}