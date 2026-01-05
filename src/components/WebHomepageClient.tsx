import React from 'react';
import { Check, PlayCircle, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

export default function WebHome() {
  const features = {
    basic: ["5 Scans per day", "Basic price estimates", "Manual profit entry"],
    pro: ["Unlimited AI Scans", "Real-time market analytics", "Advanced profit calculator", "Priority support", "Multi-platform comparison"]
  };

  return (
    <div className="web">
      {/* Hero Section */}
      <section className="web__hero">
        <div className="web__container">
          <div className="web__heroContent">
            <span className="web__tag">
              <Sparkles size={14} style={{ marginRight: '8px' }} />
              Item Flipping AI Companion
            </span>
            <h1 className="web__title">
              Turn "Wait, what's this?" into 
              <span className="web__titleHighlight"> Sold for $200.</span>
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
                <PlayCircle size={20} /> Watch Demo
              </button>
            </div>
          </div>

          <div className="web__heroVisual">
            <div className="web__imageWrapper">
              <div className="web__phoneFrame">
                <div className="web__phoneNotch"></div>
                <div className="web__placeholderImg">
                  <img src="/images/AppDisplay.png" alt="FlipFinder App Interface" />
                </div>
                <div className="web__phoneButton volume"></div>
                <div className="web__phoneButton power"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="web__how">
        <div className="web__container">
          <div className="web__sectionHeader">
            <h2 className="web__sectionTitle">The 3-Second Workflow</h2>
            <p>From the thrift shelf to your bank account in three steps.</p>
          </div>

          <div className="web__steps">
            <div className="stepItem">
              <div className="stepItem__number"><Zap size={20} /></div>
              <h3 className="stepItem__title">Point & Scan</h3>
              <p className="stepItem__text">Our AI identifies the item, brand, and condition in an instant using your camera.</p>
            </div>
            <div className="stepItem">
              <div className="stepItem__number"><Globe size={20} /></div>
              <h3 className="stepItem__title">Real-Time Data</h3>
              <p className="stepItem__text">Instantly see live sold listings and current comps from eBay and Poshmark.</p>
            </div>
            <div className="stepItem">
              <div className="stepItem__number"><ShieldCheck size={20} /></div>
              <h3 className="stepItem__title">Instant Logic</h3>
              <p className="stepItem__text">We factor in shipping and platform fees to show your true net profit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="web__pricing" style={{ padding: '120px 0' }}>
        <div className="web__container">
          <div className="web__sectionHeader">
            <h2 className="headerWhite">Affordable Pricing</h2>
          </div>
          <div className="web__pricingWrapper">
            <div className="planCard">
              <h3 className="planCard__name">Basic</h3>
              <div className="planCard__price">0<span>/ mo</span></div>
              <ul className="planCard__list">
                {features.basic.map((f, i) => (
                  <li key={i}><Check size={18} /> {f}</li>
                ))}
              </ul>
              <button className="planCard__btn">Free</button>
            </div>

            <div className="planCard planCardPro">
              <div className="planCard__badge">Recommended</div>
              <h3 className="planCard__name">Pro Hunter</h3>
              <div className="planCard__price">5.99<span>/ mo</span></div>
              <ul className="planCard__list">
                {features.pro.map((f, i) => (
                  <li key={i}><Check size={18} /> {f}</li>
                ))}
              </ul>
              <button className="planCard__btn planCard__btnHighlight">
                Go Pro Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}