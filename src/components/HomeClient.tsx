"use client";

import React, { useState, useRef } from "react";
import { Camera, Upload, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { resizeImage } from "@/utils/imageUtils";
import "../styles/common/_landing.scss";

interface GeminiResult {
  sources: string[];
  title: string;
  description: string;
  priceRange: string;
  platform: string;
}

export default function HomeClient({ initialUser }: { initialUser: any }) {
  const [image, setImage] = useState<string | null>(null);
  const [resultData, setResultData] = useState<GeminiResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isSubscriber, dailyScansUsed, maxFreeScans, incrementScans } = useApp();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Security: Client-side check before burning AI credits
    if (!isSubscriber && dailyScansUsed >= maxFreeScans) {
      alert("Daily limit reached! Upgrade to Pro for unlimited scans.");
      return;
    }

    setImage(URL.createObjectURL(file));
    setIsAnalyzing(true);

    try {
      const optimizedBlob = await resizeImage(file, 768);
      const formData = new FormData();
      formData.append("image", optimizedBlob); // Using optimized image

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setResultData(data);
        incrementScans();
      } else {
        alert(data.error || "Analysis failed");
      }
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
              <p className="landing__placeholder-text">Preview will appear here</p>
            </div>
          )}
        </div>

        {/* INPUT ACTIONS */}
        <div className="landing__actions">
          <button onClick={triggerFileInput} className="landing__action landing__action--photo">
            <Camera className="landing__action-icon" /> TAKE PHOTO
          </button>
          <button onClick={triggerFileInput} className="landing__action landing__action--gallery">
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
                      {source}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}