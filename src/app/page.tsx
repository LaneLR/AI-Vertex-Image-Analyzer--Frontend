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
import { resizeImage } from "@/utils/imageUtils";

interface GeminiResult {
  sources: string[];
  title: string;
  description: string;
  priceRange: string;
  platform: string;
}

export default function FlipFinderHome() {
  const [image, setImage] = useState<string | null>(null);
  const [resultData, setResultData] = useState<GeminiResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isSubscriber, dailyScansUsed, maxFreeScans, incrementScans } =
    useApp();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const isTestingUI = true; // Set to true to save API calls

    // if (isTestingUI) {
    //   await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
    //   setResultData({
    //     title: "MOCK: Vintage Denim Jacket",
    //     description: "This is a test description to check the SCSS layout.",
    //     priceRange: "$50 - $70",
    //     platform: "eBay"
    //   });
    //   setIsAnalyzing(false);
    //   setShowResult(true);
    //   return;
    // }
    
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSubscriber && dailyScansUsed >= maxFreeScans) {
      alert("Daily limit reached!");
      return;
    }

    setImage(URL.createObjectURL(file));
    setIsAnalyzing(true);

    try {
      const optimizedBlob = await resizeImage(file, 768)
;      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setResultData(data); 
      incrementScans(); 
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsAnalyzing(false);
      setShowResult(true);
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
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

        {showResult && resultData && (
          <div className="landing__result-animate">
            <div className="landing__result-badge">AI Appraisal Complete!</div>
            <div className="landing__result-card">
              <p className="landing__result-label">Estimated Value</p>
              <h2 className="landing__result-value">
                {resultData.priceRange} <span className="landing__result-currency">USD</span>
              </h2>

              <div className="landing__result-details">
                <h3 className="landing__result-title">{resultData.title}</h3>
                <p className="landing__result-desc">{resultData.description}</p>

                <div className="landing__sources-list">
                  <p className="landing__sources-header">Market Sources:</p>
                  {resultData.sources?.map((source: string, index: number) => (
                    <div key={index} className="landing__source-item">
                      <span className="landing__needs-class"></span>
                      {source}
                    </div>
                  ))}
                </div>
              </div>

              <div className="landing__result-actions">
                {/* ... existing buttons ... */}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
