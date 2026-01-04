import React from "react";
import {
  Camera,
  Zap,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Check,
} from "lucide-react";
import Link from "next/link";

export default async function WebHome() {
  const proFeatures = [
    "Unlimited AI Scans",
    "Real-time Market Analytics",
    "Priority Support",
    "Advanced Profit Calculator",
    "Multi-Platform Price Comparison",
  ];

  const basicFeatures = [
    "5 Scans per Day",
    "Basic Price Estimates",
    "Manual Profit Entry",
    "Community Support",
  ];

  return (
    <div className="web">
      {/* Hero Section */}
      <section className="web__hero">
        <div className="web__container">
          <h1 className="web__title">
            Find the Value in{" "}
            <span className="web__title--highlight">Every Find.</span>
          </h1>
          <p className="web__subtitle">
            Flip Finder uses advanced AI to instantly value items from thrift
            stores, garage sales, and marketplaces. Stop guessing, start
            flipping.
          </p>
          <div className="web__actions">
            <Link href={"/login"}>
              <button className="web__btn web__btn--primary">
                Get Started <ArrowRight size={18} />
              </button>
            </Link>
            <Link href={"/app"}>
              <button className="web__btn web__btn--secondary">
                Download App
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="web__features">
        <div className="web__container">
          <h2 className="web__section-title">How It Works</h2>
          <div className="web__grid">
            <div className="feature-card">
              <div className="feature-card__icon">
                <Camera />
              </div>
              <h3 className="feature-card__title">Snap a Photo</h3>
              <p className="feature-card__text">
                Just point your camera at any item. Our AI identifies exactly
                what you're looking at.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">
                <Zap />
              </div>
              <h3 className="feature-card__title">Instant Valuation</h3>
              <p className="feature-card__text">
                Get estimated resale values across eBay, Poshmark, and Facebook
                Marketplace in seconds.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">
                <BarChart3 />
              </div>
              <h3 className="feature-card__title">Track Profits</h3>
              <p className="feature-card__text">
                Log your purchases and sales to see your growth and ROI over
                time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="web__pricing">
        <div className="web__container">
          <h2 className="web__section-title">Choose Your Hunt</h2>
          <div className="web__grid">
            {/* Basic Plan */}
            <div className="pricing-card">
              <h3 className="pricing-card__name">Basic</h3>
              <div className="pricing-card__price">
                $0<span>/mo</span>
              </div>
              <ul className="pricing-card__list">
                {basicFeatures.map((feat, i) => (
                  <li key={i} className="pricing-card__item">
                    <Check size={16} /> {feat}
                  </li>
                ))}
              </ul>
              <button className="pricing-card__btn pricing-card__btn--outline">
                Current Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="pricing-card pricing-card--featured">
              <div className="pricing-card__badge">Recommended</div>
              <h3 className="pricing-card__name">Pro Hunter</h3>
              <div className="pricing-card__price">
                $5.99<span>/mo</span>
              </div>
              <ul className="pricing-card__list">
                {proFeatures.map((feat, i) => (
                  <li key={i} className="pricing-card__item">
                    <Check size={16} /> {feat}
                  </li>
                ))}
              </ul>
              <button className="pricing-card__btn pricing-card__btn--solid">
                Go Pro Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
