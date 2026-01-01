"use client";

import React, { useState } from "react";
import {
  Copy,
  Wand2,
  Package,
  Tag,
  Info,
  Check,
  RefreshCcw,
  Layout,
  ListChecks,
  ArrowLeft,
} from "lucide-react";
import Loading from "./Loading";
import Link from "next/link";

interface GenerateListingProps {
  user: any;
}

export default function GenerateListingClient({ user }: GenerateListingProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null); // Reset result on new image
    }
  };

  const generateListing = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image!);
    formData.append("mode", "listing");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      //replace with InfoModal
      alert("Error generating listing");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <main className="listing-page">
      <header className="listing-page__header">
        <Link href="/" className="back-btn">
          <ArrowLeft size={20} />
        </Link>
        <div className="listing-page__header-content">
          <Wand2 className="icon-primary" />
          <div>
            <h1>Listing Studio</h1>
            <p>AI-Optimized Marketplace Metadata</p>
          </div>
        </div>
        <div />
      </header>

      <div className="listing-grid">
        {/* Left Column: Input & Preview */}
        <section className="listing-grid__input">
          <div className="card listing-card--sticky">
            <h3 className="card-title">
              <Package size={18} /> Source Image
            </h3>
            <div className={`upload-zone ${preview ? "has-image" : ""}`}>
              {preview ? (
                <div className="preview-container">
                  <img src={preview} alt="Item Preview" />
                  <button
                    className="change-img-btn"
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                  >
                    <RefreshCcw size={16} /> Change Photo
                  </button>
                </div>
              ) : (
                <label className="dropzone-label">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    hidden
                  />
                  <div className="dropzone-content">
                    <div className="icon-circle">
                      <Package />
                    </div>
                    <span>Tap to upload item photo JPG, PNG or WebP</span>
                  </div>
                </label>
              )}
            </div>
            <button
              disabled={!image || loading}
              onClick={generateListing}
              className={`generate-btn ${loading ? "loading" : ""}`}
            >
              {loading ? "AI is writing..." : "Generate Listing Details"}
            </button>
          </div>
        </section>

        {/* Right Column: Results */}
        <section className="listing-grid__results">
          {!result && !loading ? (
            <div className="empty-state">
              <Layout size={48} />
              <h3>Your listing will appear here</h3>
              <p>
                Upload a clear photo of your item to generate SEO-friendly
                titles and descriptions.
              </p>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="shimmer-title" />
              <div className="shimmer-text" />
              <div className="shimmer-text" />
              <Loading />
            </div>
          ) : (
            <div className="results-wrapper">
              {/* Title Card */}
              <div className="result-group card">
                <div className="result-group__header">
                  <label>
                    <Tag size={14} /> Optimized Title
                  </label>
                  <button
                    onClick={() => copyToClipboard(result.title, "title")}
                  >
                    {copiedField === "title" ? (
                      <Check size={16} color="#22c55e" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                <p className="result-value--title">{result.title}</p>
              </div>

              {/* Description Card */}
              <div className="result-group card">
                <div className="result-group__header">
                  <label>
                    <Info size={14} /> Product Description
                  </label>
                  <button
                    onClick={() => copyToClipboard(result.description, "desc")}
                  >
                    {copiedField === "desc" ? (
                      <Check size={16} color="#22c55e" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                <div className="result-value--desc">{result.description}</div>
              </div>

              {/* Specs Grid */}
              <div className="result-group card">
                <div className="result-group__header">
                  <label>
                    <ListChecks size={14} /> Item Specifics
                  </label>
                </div>
                <div className="specs-grid">
                  {Object.entries(result.specs ?? {}).map(([key, val]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key}</span>
                      <span className="spec-value">{val as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}

              <div className="tags-container">
                <div className="result-group__header">
                  <label>
                    <ListChecks size={14} /> Tags
                  </label>
                </div>
<div className="tags-container--tags">


                {result.tags?.map((tag: string) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}</div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
