"use client";

import React, { useEffect, useState } from "react";
import SubscribeButton from "@/components/SubscribeButton";
import { Check, ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Capacitor } from "@capacitor/core";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

export default function PaymentsClient() {
  const { user, isLoading } = useApp();
  const [platform, setPlatform] = useState<string>("web");
  const router = useRouter();

  const isIOS = platform === "ios";
  const isAndroid = platform === "android";
  const isNative = platform !== "web";

  useEffect(() => {
    const currentPlatform = Capacitor.getPlatform();
    setPlatform(currentPlatform);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  const isPro = user?.subscriptionStatus === "pro";
  const isHobby = user?.subscriptionStatus === "hobby";
  const isBusiness = user?.subscriptionStatus === "business";
  const isBasic = !isPro && !isHobby && !isBusiness;

  if (isLoading) {
    return (
      <div className="loading-state">
        <Loading />
      </div>
    );
  }

  const features = {
    basic: [
      "5 Scans per day.",
      "1 Image per scan.",
      "Basic price estimates.",
      "Access to your scan history.",
    ],
    hobby: [
      "50 scans per day.",
      "2 Images per scan.",
      "Improved accuracy and price estimates.",
      "Access to your scan history.",
      "Access to Profit Calculator.",
      "Profitability grading on appraised items",
    ],
    pro: [
      "100 scans per day.",
      "3 Images per scan.",
      "High accuracy price estimates.",
      "Access to your scan history.",
      "Access to Profit Calculator.",
      "Profitability grading on appraised items.",
      "Access to SEO Generator to create SEO-optimized listing details.",
      "Unlimited access to Photo Studio to automatically create listing photos.",
    ],
    business: [
      "250 scans per day.",
      "3 Images per scan.",
      "High accuracy price estimates.",
      "Access to your scan history.",
      "Access to Profit Calculator.",
      "Profitability grading on appraised items.",
      "Access to SEO Generator to create SEO-optimized listing details.",
      "Unlimited access to Photo Studio to automatically create listing photos.",
      "Multi-platform and marketplace price comparison.",
      "Access to Inventory Manager for tracking and managing items.",
      "CSV download of inventory and listings for bulk uploading.",
    ],
  };

  return (
    <>
      <header className="help-page__header">
        <button onClick={handleBack} className="back-btn">
          <ArrowLeft size={20} />
        </button>
        <h1>Payment Center</h1>
        <div className="header-spacer" />
      </header>

      <main className="pricing-section">
        <header className="pricing-section__header">
          <h1 className="pricing-section__title">Upgrade Your Experience</h1>
          <p className="pricing-section__subtitle">
            Choose the plan that fits you.
          </p>
        </header>

        <div className="pricing-grid">
          {/* BUSINESS CARD */}
          <div className="plan-card">
            <h3 className="plan-card__name">Business</h3>
            <div className="plan-card__price">
              44.99<span className="plan-card__month">/ mo</span>
            </div>
            <ul className="plan-card__feature-list">
              {features.business.map((f, i) => (
                <li key={i} className="plan-card__feature-item">
                  <Check className="plan-card__icon" size={18} />
                  <span className="plan-card__feature-text">{f}</span>
                </li>
              ))}
            </ul>
            <SubscribeButton
              priceId={process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID!}
              isCurrentPlan={isBusiness}
            />
          </div>

          {/* PRO CARD (Featured) */}
          <div className="plan-card plan-card--featured">
            <div className="plan-card__badge">Most Popular</div>
            <h3 className="plan-card__name">Pro</h3>
            <div className="plan-card__price">
              24.99<span className="plan-card__month">/ mo</span>
            </div>
            <ul className="plan-card__feature-list">
              {features.pro.map((f, i) => (
                <li key={i} className="plan-card__feature-item">
                  <Check className="plan-card__icon" size={18} />
                  <span className="plan-card__feature-text">{f}</span>
                </li>
              ))}
            </ul>
            <SubscribeButton
              priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!}
              isCurrentPlan={isPro} 
            />
          </div>

          {/* HOBBYIST CARD */}
          <div className="plan-card">
            <h3 className="plan-card__name">Hobbyist</h3>
            <div className="plan-card__price">
              12.99<span className="plan-card__month">/ mo</span>
            </div>
            <ul className="plan-card__feature-list">
              {features.hobby.map((f, i) => (
                <li key={i} className="plan-card__feature-item">
                  <Check className="plan-card__icon" size={18} />
                  <span className="plan-card__feature-text">{f}</span>
                </li>
              ))}
            </ul>
            <SubscribeButton
              priceId={process.env.NEXT_PUBLIC_STRIPE_HOBBY_PRICE_ID!}
              isCurrentPlan={isHobby} 
            />
          </div>

          {/* BASIC CARD */}
          <div className="plan-card">
            <h3 className="plan-card__name">Free</h3>
            <div className="plan-card__price">
              0<span className="plan-card__month">/ mo</span>
            </div>
            <ul className="plan-card__feature-list">
              {features.basic.map((f, i) => (
                <li key={i} className="plan-card__feature-item">
                  <Check className="plan-card__icon" size={18} />
                  <span className="plan-card__feature-text">{f}</span>
                </li>
              ))}
            </ul>
            <button className="generate-btn" disabled={isBasic}>
              {isBasic ? "Current Plan" : "Free"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
