"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Info,
  Sparkles,
  Target,
  ScanEye,
  TrendingUp,
  BadgeDollarSignIcon,
} from "lucide-react";
import InfoModal from "./InfoModal";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          {/* Brand Info */}
          <div className="footer__section footer__section--brand">
            <div className="footer__brand-container">
              <div className="footer__logo">
                <Link
                  href="/dashboard"
                  className="brand-link"
                  data-ph-capture-attribute-button-name="footer-title-btn"
                  data-ph-capture-attribute-feature="footer"
                >
                  <h1 className="brand-text">
                    Resale<span>IQ</span>
                  </h1>
                </Link>
              </div>
              <div className="footer__badges">
                <span className="badge-pill">
                  <Sparkles size={12} />
                  Powered by Vertex AI
                </span>
              </div>
            </div>
          </div>

          {/* Consolidated Resources Flex Container */}
          <div className="footer__resources">
            <button
              className="footer__link"
              onClick={() => setIsAboutModalOpen(true)}
              data-ph-capture-attribute-button-name="footer-about-btn"
              data-ph-capture-attribute-feature="footer"
            >
              <Info size={16} />
              About Us
            </button>
            <Link
              href="/terms"
              className="footer__link"
              data-ph-capture-attribute-button-name="footer-terms-btn"
              data-ph-capture-attribute-feature="footer"
            >
              <ShieldCheck size={16} />
              Terms
            </Link>
            <Link
              href="/privacy"
              className="footer__link"
              data-ph-capture-attribute-button-name="footer-privacy-btn"
              data-ph-capture-attribute-feature="footer"
            >
              <ShieldCheck size={16} />
              Privacy
            </Link>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            {currentYear} ResaleIQ • v{process.env.NEXT_PUBLIC_APP_VERSION}
          </div>
        </div>
      </div>

      {/* About Us Modal Content */}
      <InfoModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        title="About ResaleIQ"
      >
        <div className="feature-info-modal">
          <div
            className="about-hero"
            style={{ textAlign: "center", marginBottom: "1.5rem" }}
          >
            <ScanEye
              size={40}
              color="var(--primary-theme)"
              style={{ marginBottom: "0.5rem" }}
            />
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Empowering resellers with AI-driven market insights.
            </p>
          </div>

          <div className="about-section" style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.75rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
                color: "var(--text-muted)",
              }}
            >
              <Target size={14} /> Our Mission
            </div>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
              ResaleIQ was built for the modern treasure hunter. We combine AI
              vision technology with market data to help you flip finds with
              confidence.
            </p>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <div
              style={{
                background: "var(--bg-secondary)",
                padding: "1rem",
                borderRadius: "12px",
              }}
            >
              <h3
                style={{
                  fontSize: "0.95rem",
                  marginBottom: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <ScanEye size={16} /> Identify
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Snap a photo and let AI recognize brands and styles instantly.
              </p>
            </div>
            <div
              style={{
                background: "var(--bg-secondary)",
                padding: "1rem",
                borderRadius: "12px",
              }}
            >
              <h3
                style={{
                  fontSize: "0.95rem",
                  marginBottom: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <TrendingUp size={16} /> Appraise
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Get instant price estimates based on resale market trends.
              </p>
            </div>
          </div>

          <div
            className="delete-modal__actions"
            style={{ marginTop: "1.5rem" }}
          >
            <button
              className="modal-btn modal-btn--secondary"
              onClick={() => setIsAboutModalOpen(false)}
              data-ph-capture-attribute-button-name="footer-about-modal-btn-close"
              data-ph-capture-attribute-feature="footer"
            >
              Close
            </button>
          </div>
        </div>
      </InfoModal>
    </footer>
  );
}
