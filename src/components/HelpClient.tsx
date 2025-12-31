"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ChevronRight, 
  BookOpen, 
  CreditCard, 
  AlertCircle, 
  Mail, 
  Search,
  MessageCircle
} from "lucide-react";
import InfoModal from "./InfoModal";

export default function HelpClient() {
  const [activeModal, setActiveModal] = useState<{ title: string; content: string } | null>(null);

  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpen size={20} />,
      items: [
        { 
          title: "How to value your first item", 
          content: "Simply upload a clear photo of your item. Our AI will scan the web and provide an estimated resale value within seconds." 
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
      icon: <CreditCard size={20} />,
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
      icon: <AlertCircle size={20} />,
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
      <header className="help-page__header">
        <Link href="/" className="back-btn">
          <ArrowLeft size={20} />
        </Link>
        <h1>Support Center</h1>
        <div className="header-spacer" />
      </header>

      <div className="help-page__content">
        <section className="help-hero">
          <h2>How can we help?</h2>
          {/* <div className="help-hero__search">
            <Search size={18} />
            <input type="text" placeholder="Search for articles..." />
          </div> */}
        </section>

        <div className="help-grid">
          {categories.map((cat) => (
            <section key={cat.id} className="help-group">
              <div className="help-group__header">
                <div className={`icon-box ${cat.alert ? 'icon-box--alert' : ''}`}>
                  {cat.icon}
                </div>
                <h3>{cat.title}</h3>
              </div>

              <div className="settings-list">
                {cat.items.map((item) => (
                  <button 
                    key={item.title} 
                    className="settings-item settings-item--btn"
                    onClick={() => setActiveModal({ title: item.title, content: item.content })}
                  >
                    <span className="item-label">{item.title}</span>
                    <ChevronRight size={18} className="chevron" />
                  </button>
                ))}
                
                {/* {cat.id === "troubleshooting" && (
                  <button className="settings-item settings-item--btn contact-trigger" onClick={handleSupportClick}>
                    <span className="item-label">Still having issues? Contact support</span>
                    <Mail size={16} />
                  </button>
                )} */}
              </div>
            </section>
          ))}
        </div>

        <footer className="help-footer">
          <div className="help-footer__card">
            <div className="footer-info">
              <MessageCircle size={24} />
              <div>
                <h4>Didn't find an answer?</h4>
                <p>Our team usually responds within 24 hours.</p>
              </div>
            </div>
            <button className="help-btn" onClick={handleSupportClick}>
              Email Support
            </button>
          </div>
        </footer>
      </div>

      <InfoModal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        title={activeModal?.title || ""}
      >
        <div className="help-article">
          <p>{activeModal?.content}</p>
          <div className="help-article__feedback">
            <span>Was this helpful?</span>
            <div className="feedback-btns">
              <button onClick={() => setActiveModal(null)}>Yes</button>
              <button onClick={() => setActiveModal(null)}>No</button>
            </div>
          </div>
        </div>
      </InfoModal>
    </main>
  );
}