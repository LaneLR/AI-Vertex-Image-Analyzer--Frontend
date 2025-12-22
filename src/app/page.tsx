"use client";

import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Menu,
  CloudUpload,
  ExternalLink,
  Archive,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import "../styles/common/_landing.scss";

export default function FlipFinderHome() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isSubscriber, dailyScansUsed, maxFreeScans, incrementScans } =
    useApp();

  // Mock function to simulate AI Analysis
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setIsAnalyzing(true);
        setShowResult(false);
        setTimeout(() => {
          setIsAnalyzing(false);
          setShowResult(true);
        }, 3000);
      };
      incrementScans();
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <main className="landing">

      <div className="landing__container">
        {/* IMAGE VIEWPORT */}
        <div className="landing__viewport">
          {image ? (
            <>
              <img src={image} alt="Uploaded Item" className="landing__image" />
              {isAnalyzing && (
                <div className="landing__analyzing-overlay">
                  <div className="landing__spinner"></div>
                  <p className="landing__analyzing-text">AI Analyzing...</p>
                </div>
              )}
            </>
          ) : (
            <div className="landing__placeholder">
              <Camera className="landing__placeholder-icon" />
              <p>Preview will appear here</p>
            </div>
          )}
        </div>

        {/* INPUT ACTIONS */}
        <div className="landing__actions">
          <button
            onClick={triggerFileInput}
            className="landing__action landing__action--photo"
          >
            <Camera className="landing__action-icon" /> TAKE PHOTO
          </button>
          <button
            onClick={triggerFileInput}
            className="landing__action landing__action--gallery"
          >
            <Upload className="landing__action-icon" /> GALLERY
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/*"
            className="landing__file-input"
          />
        </div>

        {/* RESULTS CARD (Only shown after analysis) */}
        {showResult && (
          <div className="landing__result-animate">
            <div className="landing__result-badge">AI Appraisal Complete!</div>
            <div className="landing__result-card">
              <p className="landing__result-label">Estimated Value</p>
              <h2 className="landing__result-value">
                $80 - 120 <span className="landing__result-currency">USD</span>
              </h2>
              <div className="landing__result-details">
                <p className="landing__result-desc">
                  Vintage 90s Embroidered Denim Jacket. Features chain-stitch
                  embroidery.
                  <span className="landing__result-brand">
                    {" "}
                    Brand: Levi's (Verified)
                  </span>
                </p>
                <div className="landing__result-tags">
                  <span className="landing__result-tag">Condition: 8/10</span>
                  <span className="landing__result-tag landing__result-tag--demand">
                    Demand: High
                  </span>
                </div>
              </div>
              <div className="landing__result-actions">
                <button className="landing__result-btn landing__result-btn--ebay">
                  <ExternalLink className="landing__result-btn-icon" /> List on
                  eBay
                </button>
                <button className="landing__result-btn landing__result-btn--log">
                  <Archive className="landing__result-btn-icon" /> Save to Log
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
