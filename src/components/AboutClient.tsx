"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Target,
  ScanEye,
  TrendingUp,
  Info,
  DollarSign,
  DollarSignIcon,
  CircleDollarSign,
  BadgeDollarSignIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutClient() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };
  return (
    <main className="about-page">
      {/* Navigation */}
      <header className="about-page__header">
        <button onClick={handleBack} className="back-btn">
          <ArrowLeft size={20} />
        </button>
        <h1>About Us</h1>
        <div className="header-spacer" />
      </header>

      <div className="about-page__content">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="brand-logo">
            <ScanEye size={40} />
          </div>
          <h2 className="about-hero__title">ThriftSavvy</h2>
          <p className="about-hero__subtitle">
            Empowering thrifters with AI-driven market insights.
          </p>
        </section>

        {/* Mission Section */}
        <section className="about-section">
          <div className="section-label">
            <Target size={14} /> Our Mission
          </div>
          <p className="about-text">
            ThriftSavvy was built for the modern treasure hunter. We combine
            cutting-edge AI vision technology with real-time market data to help
            you identify, value, and flip thrift store finds with confidence.
          </p>
        </section>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card__icon icon-blue">
              <ScanEye size={20} />
            </div>
            <h3>Identify</h3>
            <p>
              Snap a photo and let our AI recognize brands, styles, and eras
              instantly.
            </p>
          </div>

          <div className="feature-card feature-card--featured">
            <div className="feature-card__icon icon-gold">
              <TrendingUp size={20} />
            </div>
            <h3>Appraise</h3>
            <p>
              Get instant price estimates based on current resale market
              trends.*
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon icon-green">
              <CircleDollarSign size={20} />
            </div>
            <h3>Profit</h3>
            <p>
              Turn your hobby into a hustle with data-backed buying decisions.**
            </p>
          </div>
        </div>

        {/* Legal Disclaimers */}
        <footer className="about-footer">
          <div className="disclaimer-box">
            <div className="disclaimer-header">
              <Info size={14} />
              <span>Legal Disclaimers</span>
            </div>
            <p>
              *ThriftSavvy is an AI tool that provides price estimates and does
              not guarantee accuracy. AI-generated appraisals can be incorrect
              or unreliable. Please perform your own research.
            </p>
            <p>
              **ThriftSavvy does not guarantee profit or success in resale
              activities.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
