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
  X,
  Camera,
} from "lucide-react";
import Loading from "./Loading";
import Link from "next/link";

interface GenerateListingProps {
  user: any;
}

export default function GenerateListingClient({ user }: GenerateListingProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isPro = user?.subscriptionStatus === "pro";
  const maxPhotos = isPro ? 3 : 1;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const selectedFiles = files.slice(0, maxPhotos);
    setImages(selectedFiles);

    // Clean up old URLs
    previews.forEach((url) => URL.revokeObjectURL(url));
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    setResult(null);
  };

  const handleAddMore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && images.length < maxPhotos) {
      setImages((prev) => [...prev, file]);
      setPreviews((prev) => [...prev, URL.createObjectURL(file)]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const generateListing = async () => {
    if (images.length === 0) return;
    setLoading(true);
    const formData = new FormData();
    
    images.forEach((img) => {
      formData.append("image", img);
    });
    formData.append("mode", "listing");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || "Error generating listing");
      }
    } catch (err) {
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
              <Package size={18} /> Source Images
            </h3>
            
            <div className={`upload-zone ${previews.length > 0 ? "has-image" : ""}`}>
              {previews.length > 0 ? (
                <div className="multi-preview-wrapper">
                  <div className="preview-grid-system">
                    {previews.map((src, idx) => (
                      <div key={idx} className="preview-slot">
                        <img src={src} alt={`Preview ${idx + 1}`} />
                        <button className="remove-btn" onClick={() => removeImage(idx)}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    
                    {isPro && previews.length < 3 && (
                      <label className="add-slot-btn">
                        <input type="file" onChange={handleAddMore} accept="image/*" hidden />
                        <Camera size={20} />
                        <span>Add</span>
                      </label>
                    )}
                  </div>
                  
                  <button
                    className="change-img-btn"
                    onClick={() => {
                      setImages([]);
                      setPreviews([]);
                      setResult(null);
                    }}
                  >
                    <RefreshCcw size={16} /> Clear All
                  </button>
                </div>
              ) : (
                <label className="dropzone-label">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple={isPro}
                    hidden
                  />
                  <div className="dropzone-content">
                    <div className="icon-circle">
                      <Package />
                    </div>
                    <span>{isPro ? "Tap to upload up to 3 photos" : "Tap to upload item photo"}</span>
                  </div>
                </label>
              )}
            </div>

            <button
              disabled={images.length === 0 || loading}
              onClick={generateListing}
              className={`generate-btn ${loading ? "loading" : ""}`}
            >
              {loading ? "AI is writing..." : `Generate Details (${images.length} Photo${images.length !== 1 ? 's' : ''})`}
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
                Upload {isPro ? "different angles" : "a clear photo"} of your item to generate SEO-friendly
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
                  <button onClick={() => copyToClipboard(result.title, "title")}>
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
                  <button onClick={() => copyToClipboard(result.description, "desc")}>
                    {copiedField === "desc" ? (
                      <Check size={16} color="#22c55e" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                <div className="result-value--desc whitespace-pre-wrap">{result.description}</div>
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
              <div className="tags-container card">
                <div className="result-group__header">
                  <label>
                    <Tag size={14} /> Search Tags
                  </label>
                </div>
                <div className="tags-container--tags">
                  {result.tags?.map((tag: string) => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}