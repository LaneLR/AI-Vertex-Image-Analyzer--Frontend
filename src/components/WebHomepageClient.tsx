import React from 'react';
import { Camera, Zap, BarChart3, ArrowRight, Check, PlayCircle } from 'lucide-react';
import Image from 'next/image';

export default function WebHome() {
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
      <section className="web__hero">
        <div className="web__container">
          <div className="web__heroContent">
            <span className="web__tag">The Hunter's AI Companion</span>
            <h1 className="web__title">
              Turn "Wait, what's this?" into 
              <span className="web__titleHighlight">
                {" "}"Sold for $200."
              </span>
            </h1>
            <p className="web__subtitle">
              Scan items instantly. Analyze market value. Flip with confidence.
              The most powerful tool for thrift hunters and resellers.
            </p>
            <div className="web__actions">
              <button className="web__btn web__btnPrimary">
                Start Hunting Free
              </button>
              <button className="web__btn web__btnText">
                <PlayCircle size="20" /> See how it works
              </button>
            </div>
          </div>

          <div className="web__heroVisual">
            <div className="web__imageWrapper">
              <div className="web__placeholderImg">App Preview</div>
            </div>
          </div>
        </div>
      </section>

      <section className="web__how">
        <div className="web__container">
          <div className="web__sectionHeader">
            <h2 className="web__sectionTitle">The 3-Second Workflow</h2>
            <p>Scanning to selling in three intuitive steps.</p>
          </div>

          <div className="web__steps">
            <div className="stepItem">
              <div className="stepItem__number">01</div>
              <h3 className="stepItem__title">Point & Scan</h3>
              <p className="stepItem__text">Our AI identifies the item, brand, and condition automatically.</p>
            </div>
            <div className="stepItem">
              <div className="stepItem__number">02</div>
              <h3 className="stepItem__title">Real-Time Data</h3>
              <p className="stepItem__text">View live comps from eBay, Poshmark, and Marketplace.</p>
            </div>
            <div className="stepItem">
              <div className="stepItem__number">03</div>
              <h3 className="stepItem__title">Instant Logic</h3>
              <p className="stepItem__text">We calculate net profit after fees and shipping for you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="web__pricing">
        <div className="web__container">
          <h2 className="web__sectionTitle">Choose Your Plan</h2>
          <div className="web__pricingWrapper">
            <div className="planCard">
              <h3 className="planCard__name">Basic</h3>
              <div className="planCard__price">0</div>
              <ul className="planCard__list">
                <li><Check size="14" /> 5 Scans per day</li>
              </ul>
              <button className="planCard__btn">Stay Basic</button>
            </div>

            <div className="planCard planCardPro">
              <div className="planCard__badge">Most Popular</div>
              <h3 className="planCard__name">Pro Hunter</h3>
              <div className="planCard__price">9.99<span>/mo</span></div>
              <ul className="planCard__list">
                <li><Check size="14" /> Unlimited AI Scans</li>
              </ul>
              <button className="planCard__btn planCard__btnHighlight">
                Unlock Pro
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}