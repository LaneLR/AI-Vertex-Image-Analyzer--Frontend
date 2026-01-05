"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  CreditCard,
  AlertCircle,
  Mail,
  Search,
  MessageCircle,
} from "lucide-react";
import InfoModal from "./InfoModal";
import { Capacitor } from "@capacitor/core";
import { useSession } from "next-auth/react";

export default function HelpClient({ user: initialUser }: { user: any }) {
  const [activeModal, setActiveModal] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [platform, setPlatform] = useState<string>("web");
  const { data: session, update } = useSession();
  const user = session?.user || initialUser;

  useEffect(() => {
    // This returns 'ios', 'android', or 'web'
    const currentPlatform = Capacitor.getPlatform();
    setPlatform(currentPlatform);
  }, []);

  const isIOS = platform === "ios";
  const isAndroid = platform === "android";
  const isNative = platform !== "web";

  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpen size={20} />,
      items: [
        {
          title: "How to value your first item",
          content:
            "Tap the camera icon on your dashboard. For the best results, place your item on a neutral background with good lighting. Simply take a picture or upload a clear photo of your item. Capturing the brand logo, serial number or other identifiable features in the image significantly increases accuracy. Our AI will analyze the brand, model, and condition to provide a market-accurate resale estimate and a description of the item in seconds.",
        },
        {
          title: "Understanding AI appraisals",
          content:
            "Flip Finder uses deep learning models trained on millions of marketplace data points. We cross-reference your item against live and sold listings on platforms like eBay, Poshmark, and Mercari. The price shown is an 'Estimated Market Value,' a range representing what you should realistically expect to resell the item for. Note that highly unique, vintage, or counterfeit-heavy items may require manual verification.",
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
            "You can manage your Pro plan directly from the Account page. Click the 'Manage Billing Settings' button to view details about your current plan. If you would like to upgrade to a Pro plan, click the 'Upgrade to Pro' button on your Account page.",
        },
        {
          title: "Deleting your account",
          content:
            "To permanently close your account, go to your Account page and click on the 'Delete account' button at the bottom. Deleting your account will immediately wipe your scan history. This action is irreversible. Important: You must manually cancel any active Pro subscriptions before deleting your account to ensure the third-party payment processors stop further billing cycles.",
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
            "If an image fails to upload, verify that it is a JPG, PNG, or HEIC file under 5MB. If the AI returns a 'Could Not Identify' error, try taking the photo from a different angle. High-glare or blurry photos are the most common cause of identification failure. Ensure you have a stable internet connection.",
        },
        {
          title: "App performance",
          content:
            "If the app feels sluggish, go to your phone's Settings and cler your cache. This removes temporary image data without deleting your scan history. Ensure you are using the latest version of the app from the App Store or Google Play. If you are using Flip Finder on the web, ensure your browser (Chrome, Safari, or Firefox) is up to date and that you aren't using 'Incognito Mode,' which can sometimes block the local storage needed for your preferences.",
        },
        {
          title: "Scan history missing",
          content:
            "If your previous scans aren't appearing, ensure you are logged into the correct account. If you recently switched devices, make sure 'Cloud Save' was enabled in your Settings on the old device.",
        },
      ],
    },
  ];

  // const handleSupportClick = () => {
  //   window.location.href = "mailto:support@flipfinder.com";
  // };

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
                    className="settings-item settings-item--btn"
                    onClick={() =>
                      setActiveModal({
                        title: item.title,
                        content: item.content,
                      })
                    }
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

        {/* <footer className="help-footer">
          <div className="help-footer__card">
            <div className="footer-info">
              <MessageCircle size={24} />
              <div>
                <h4>Didn't find an answer?</h4>
                <p>Email us directly</p>
              </div>
            </div>
            <button className="help-btn" onClick={handleSupportClick}>
              Email Support
            </button>
          </div>
        </footer> */}
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
