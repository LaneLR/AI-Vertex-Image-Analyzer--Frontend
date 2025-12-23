"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutClient() {
  return (
    <main className="about-page">
      {/* Navigation */}
      <nav className="settings__nav">
        <Link href="/" className="settings__nav-back">
          <ArrowLeft className="settings__nav-back-icon" />
        </Link>
        <h1 className="settings__nav-title">ABOUT</h1>
      </nav>

      <div className="about-page__body">
        {/* Hero Section */}
        <section className="about-page__hero">
          <h1 className="about-page__title">About Flip Finder</h1>
          <p className="about-page__subtitle">
            Empowering thrifters with AI-driven market insights.
          </p>
        </section>

        {/* Mission Section */}
        <section className="about-page__content">
          <div className="about-page__section">
            <h2 className="about-page__heading">Our Mission</h2>
            <p className="about-page__text">
              Flip Finder was built for the modern treasure hunter. We combine
              cutting-edge AI vision technology with real-time market data to
              help you identify, value, and flip thrift store finds.
            </p>
          </div>

          {/* Features Grid */}
          <div className="about-page__grid">
            <div className="about-page__card">
              <h3 className="about-page__card-title">Identify</h3>
              <p className="about-page__card-text">
                Snap a photo and let our AI recognize brands, styles, and eras.
              </p>
            </div>
            <div className="about-page__card about-page__card--featured">
              <h3 className="about-page__card-title">Appraise</h3>
              <p className="about-page__card-text">
                Get instant price estimates based on current resale market
                trends.*
              </p>
            </div>
            <div className="about-page__card">
              <h3 className="about-page__card-title">Profit</h3>
              <p className="about-page__card-text">
                Turn your hobby into a hustle with data-backed buying
                decisions.**
              </p>
            </div>
          </div>

          {/* Legal Disclaimers */}
          <div className="about-page__section">
            <p className="about-page__text-asterisk">
              *Flip Finder is an AI tool that provides price estimates and does not 
              guarantee accuracy of appraisals or resale values. Appraisals generated 
              by AI can be incorrect, inaccurate, and sometimes unreliable. 
              Please do your own research to confirm appraisal values.
            </p>
            <p className="about-page__text-asterisk">
              **Flip Finder does not guarantee profit or success in resale activities.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}