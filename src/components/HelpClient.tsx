"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  CreditCard,
  AlertCircle,
  Mail,
} from "lucide-react";
import InfoModal from "./InfoModal";
import { Capacitor } from "@capacitor/core";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

export default function HelpClient() {
  const [activeModal, setActiveModal] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [platform, setPlatform] = useState<string>("web");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setPlatform(Capacitor.getPlatform());

    const checkAuth = async () => {
      try {
        // We call our new Express endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Assuming you store your JWT in a cookie or localStorage
              // If using cookies with 'credentials: true', headers might not be needed
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // If not logged in, redirect to login
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check failed", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };
  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpen size={20} />,
      items: [
        {
          title: "How to value your first item",
          content:
            "Tap the camera icon on your dashboard. For the best results, place your item on a neutral background with good lighting. Our AI analyzes the brand, model, and condition to provide a market-accurate resale estimate and description in seconds.",
        },
        {
          title: "Understanding AI appraisals",
          content:
            "ResaleIQ uses deep learning models trained on millions of marketplace data points. The price shown is an 'Estimated Market Value,' representing realistic resale expectations. Highly unique or vintage items may require manual verification.",
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
          content:
            "Manage your Pro plan directly from the Account page. Click 'Manage Billing Settings' to view current plan details or 'Upgrade to Pro' to access advanced features.",
        },
        {
          title: "Deleting your account",
          content:
            "To permanently close your account, use the 'Delete account' button at the bottom of the Account page. This action is irreversible and wipes all history. Ensure you cancel active Pro subscriptions first.",
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
          title: "Image upload & errors",
          content:
            "Ensure images are JPG, PNG, or HEIC under 5MB. If identification fails, try a different angle. Blurry or high-glare photos are the most common causes of identification errors.",
        },
        {
          title: "App performance",
          content:
            "If the app feels sluggish, clear your cache in phone settings. This removes temporary data without deleting your scan history. Always use the latest version from the App Store or Play Store.",
        },
      ],
    },
  ];

  const handleSupportClick = () => {
    window.location.href = "mailto:support@resaleiq.com";
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loading />
      </div>
    );
  }
  if (!user) return null;

  return (
    <main className="help-page">
      <header className="help-page__header">
        <button
          onClick={handleBack}
          className="back-btn"
          data-ph-capture-attribute-button-name="help-back-btn"
          data-ph-capture-attribute-feature="back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Help Center</h1>
        <div className="header-spacer" />
      </header>

      <div className="help-page__content">
        <section className="help-hero">
          <h2>How can we help?</h2>
        </section>

        <div className="help-grid">
          {categories.map((cat) => (
            <section key={cat.id} className="help-group">
              <div className="help-group__header">
                <div
                  className={`icon-box ${cat.alert ? "icon-box--alert" : ""}`}
                >
                  {cat.icon}
                </div>
                <h3>{cat.title}</h3>
              </div>

              <div className="settings-list">
                {cat.items.map((item) => (
                  <button
                    key={item.title}
                    className="settings-item settings-item--clickable"
                    onClick={() =>
                      setActiveModal({
                        title: item.title,
                        content: item.content,
                      })
                    }
                    data-ph-capture-attribute-button-name="help-modal-btn"
                    data-ph-capture-attribute-feature="help"
                  >
                    <span className="item-label-help">{item.title}</span>
                    <ChevronRight size={18} className="chevron" />
                  </button>
                ))}
              </div>
            </section>
          ))}

          {/* Native-style Contact Support trigger */}
          {/* <button className="settings-item settings-item--btn contact-trigger" onClick={handleSupportClick}>
            <Mail size={18} />
            <span className="item-label">Contact Support</span>
            <ChevronRight size={18} className="chevron" />
          </button> */}
        </div>
      </div>

      <InfoModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={activeModal?.title || ""}
      >
        <div className="help-article">
          <p className="help-article__text">{activeModal?.content}</p>

          {/* <div className="help-article__feedback">
            <span>Was this helpful?</span>
            <div className="feedback-btns">
              <button
                className="feedback-btn"
                onClick={() => setActiveModal(null)}
              >
                Yes
              </button>
              <button
                className="feedback-btn"
                onClick={() => setActiveModal(null)}
              >
                No
              </button>
            </div>
          </div> */}

          <div className="help-article__actions">
            <button
              className="modal-btn modal-btn--secondary"
              onClick={() => setActiveModal(null)}
              data-ph-capture-attribute-button-name="help-modal-btn-close"
              data-ph-capture-attribute-feature="help"
            >
              Close
            </button>
          </div>
        </div>
      </InfoModal>
    </main>
  );
}
