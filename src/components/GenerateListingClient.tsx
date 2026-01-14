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
  ArrowLeft,
  X,
  Camera,
  Image as ImageIcon,
  Download,
  Upload,
  Loader2,
} from "lucide-react";
import Loading from "./Loading";
import Link from "next/link";
import { getApiUrl } from "@/lib/api-config";

interface GenerateListingProps {
  user: any;
}

export default function GenerateListingClient({ user }: GenerateListingProps) {
  // Tabs & General State
  const [activeTab, setActiveTab] = useState<"seo" | "studio">("seo");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // SEO Generator State
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Background Removal (Studio) State
  const [studioImages, setStudioImages] = useState<File[]>([]);
  const [studioPreviews, setStudioPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const isPro = user?.subscriptionStatus === "pro";
  const isHobby = user?.subscriptionStatus === "hobby";
  const isBusiness = user?.subscriptionStatus === "business";
  const maxPhotos = isPro || isHobby || isBusiness ? 3 : 1;

  // --- SEO HANDLERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const selectedFiles = files.slice(0, maxPhotos);
    setImages(selectedFiles);
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
    images.forEach((img) => formData.append("image", img));
    formData.append("mode", "listing");

    try {
      const res = await fetch(getApiUrl("/api/analyze"), {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else alert(data.error || "Error generating listing");
    } catch (err) {
      alert("Error generating listing");
    } finally {
      setLoading(false);
    }
  };

  // --- PHOTO STUDIO HANDLERS ---
  const handleStudioImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStudioImages([file]);
    studioPreviews.forEach((url) => URL.revokeObjectURL(url));
    setStudioPreviews([URL.createObjectURL(file)]);
    setResultImage(null);
  };

  const processBackgroundRemoval = async () => {
    if (studioImages.length === 0) return;

    setIsProcessing(true);
    // Cleanup old result if it exists to save memory
    if (resultImage) {
      URL.revokeObjectURL(resultImage);
      setResultImage(null);
    }

    const formData = new FormData();
    formData.append("image", studioImages[0]);

    try {
      const res = await fetch("/api/listing/remove-bg", {
        method: "POST",
        body: formData,
        // Note: Headers are NOT needed here; the browser sets them automatically for FormData
      });

      if (!res.ok) {
        // Use .text() instead of .json() for the error check to avoid the token error
        const errorText = await res.text();
        console.error("Backend Error:", errorText);
        throw new Error("The server returned an error. Check logs.");
      }

      const imageBlob = await res.blob();
      // 2. Create a local URL for that Blob
      const imageUrl = URL.createObjectURL(imageBlob);

      // 3. Set the URL to state so the <img> tag can display it
      setResultImage(imageUrl);
    } catch (err: any) {
      console.error("Studio Error:", err);
      alert(err.message);
    } finally {
      setIsProcessing(false);
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
          <div>
            <div className="listing-page__header-title">
              <Wand2 className="icon-primary" />
              <h1>Listing Studio</h1>
            </div>

            <div className="tab-switcher">
              <button
                className={`listing-page__pointer ${
                  activeTab === "seo" ? "active" : ""
                }`}
                onClick={() => setActiveTab("seo")}
              >
                SEO Generator
              </button>
              <button
                className={`listing-page__pointer ${
                  activeTab === "studio" ? "active" : ""
                }`}
                onClick={() => setActiveTab("studio")}
              >
                Photo Studio
              </button>
            </div>
          </div>
        </div>
        <div />
      </header>

      <div className="listing-studio__container">
        {activeTab === "seo" ? (
          /* --- SEO GENERATOR VIEW --- */
          <div className="listing-grid">
            <section className="listing-grid__input">
              <div className="card listing-card--sticky">
                <h3 className="card-title">
                  <Package size={28} /> SEO Generator
                </h3>
                <div
                  className={`upload-zone ${
                    previews.length > 0 ? "has-image" : ""
                  }`}
                >
                  {previews.length > 0 ? (
                    <div className="multi-preview-wrapper">
                      <div className="preview-grid-system">
                        {previews.map((src, idx) => (
                          <div key={idx} className="preview-slot">
                            <img src={src} alt={`Preview ${idx + 1}`} />
                            <button
                              className="remove-btn"
                              onClick={() => removeImage(idx)}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {(isPro || isHobby || isBusiness) &&
                          previews.length < 3 && (
                            <label className="add-slot-btn">
                              <input
                                type="file"
                                onChange={handleAddMore}
                                accept="image/*"
                                hidden
                              />
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
                        multiple={isPro || isHobby || isBusiness}
                        hidden
                      />
                      <div className="dropzone-content">
                        <div className="icon-circle">
                          <Upload />
                        </div>
                        <span>
                          {isPro || isHobby || isBusiness
                            ? "Tap to upload up to 3 photos"
                            : "Tap to upload item photo"}
                        </span>
                      </div>
                    </label>
                  )}
                </div>
                <button
                  disabled={images.length === 0 || loading}
                  onClick={generateListing}
                  className={`generate-btn ${loading ? "loading" : ""}`}
                >
                  {loading
                    ? "AI is writing..."
                    : `Generate Details (${images.length} Photo${
                        images.length !== 1 ? "s" : ""
                      })`}
                </button>
              </div>
            </section>

            <section className="listing-grid__results">
              {!result && !loading ? (
                <div className="empty-state">
                  <Layout size={48} />
                  <h3>Your listing details will appear here</h3>
                  <p>Upload angles of your item to generate SEO metadata.</p>
                </div>
              ) : loading ? (
                <div className="loading-state">
                  <Loading />
                </div>
              ) : (
                <div className="results-wrapper">
                  <div className="result-group card">
                    <div className="result-group__header">
                      <h1>BETA</h1>
                    </div>
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
                  <div className="result-group card">
                    <div className="result-group__header">
                      <label>
                        <Info size={14} /> Product Description
                      </label>
                      <button
                        onClick={() =>
                          copyToClipboard(result.description, "desc")
                        }
                      >
                        {copiedField === "desc" ? (
                          <Check size={16} color="#22c55e" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                    <div className="result-value--desc whitespace-pre-wrap">
                      {result.description}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* --- PHOTO STUDIO VIEW --- */
          <div className="listing-grid">
            <section className="listing-grid__input">
              <div className="card listing-card--sticky">
                <h3 className="card-title">
                  <ImageIcon size={28} /> Photo Studio (Beta)
                </h3>
                <div
                  className={`upload-zone ${
                    studioPreviews.length > 0 ? "has-image" : ""
                  }`}
                >
                  {studioPreviews.length > 0 ? (
                    <div className="multi-preview-wrapper">
                      <div className="preview-grid-system">
                        <div className="preview-slot">
                          <img src={studioPreviews[0]} alt="Studio Preview" />
                          <button
                            className="remove-btn"
                            onClick={() => {
                              setStudioImages([]);
                              setStudioPreviews([]);
                              setResultImage(null);
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="change-img-btn"
                        onClick={() => {
                          setStudioImages([]);
                          setStudioPreviews([]);
                          setResultImage(null);
                        }}
                      >
                        <RefreshCcw size={16} /> Replace Photo
                      </button>
                    </div>
                  ) : (
                    <label className="dropzone-label">
                      <input
                        type="file"
                        onChange={handleStudioImageChange}
                        accept="image/*"
                        hidden
                      />
                      <div className="dropzone-content">
                        <div className="icon-circle">
                          <Upload />
                        </div>
                        <span>Tap to upload a photo</span>
                      </div>
                    </label>
                  )}
                </div>
                <button
                  disabled={studioImages.length === 0 || isProcessing}
                  onClick={processBackgroundRemoval}
                  className={`generate-btn ${isProcessing ? "loading" : ""}`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />{" "}
                      Processing...
                    </>
                  ) : (
                    `Remove Background`
                  )}
                </button>
              </div>
            </section>

            <section className="listing-grid__results">
              {!resultImage && !isProcessing ? (
                <div className="empty-state">
                  <ImageIcon size={48} />
                  <h3>Your listing photo will appear here</h3>
                  <p>The image will be have a plain white background.</p>
                </div>
              ) : isProcessing ? (
                <div className="loading-state">
                  <Loading />
                  <p
                    style={{
                      textAlign: "center",
                      marginTop: "1rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    AI is removing the background...
                  </p>
                </div>
              ) : (
                <div className="results-wrapper">
                  <div className="result-group card">
                    <div className="result-group__header">
                      <label>
                        <ImageIcon size={14} /> Generated Image
                      </label>
                      <a
                        href={resultImage!}
                        download="listing-photo.png"
                        className="listing-page__pointer"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                    <div className="result-zone image-preview">
                      <img
                        src={resultImage!}
                        alt="Result"
                        style={{ width: "100%", borderRadius: "8px" }}
                      />
                    </div>
                    <a
                      href={resultImage!}
                      download="listing-photo.png"
                      className="generate-btn"
                      style={{ marginTop: "1.5rem", textDecoration: "none" }}
                    >
                      <Download size={18} /> Download Image
                    </a>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
