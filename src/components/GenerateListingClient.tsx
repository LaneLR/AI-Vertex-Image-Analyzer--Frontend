"use client";

import React, { useEffect, useRef, useState } from "react";
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
  Tags,
  BarChart3,
  CircleDollarSign,
} from "lucide-react";
import Loading from "./Loading";
import { getApiUrl } from "@/lib/api-config";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import InfoModal from "./InfoModal";

export default function GenerateListingClient() {
  const { user, dailyScansUsed, setDailyScansUsed, incrementScans, isLoading } =
    useApp();
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLAnchorElement>(null);
  const [activeTab, setActiveTab] = useState<"seo" | "studio">("seo");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [listingHistory, setListingHistory] = useState<any[]>([]);
  const [studioImages, setStudioImages] = useState<File[]>([]);
  const [studioPreviews, setStudioPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [useWhiteBackground, setUseWhiteBackground] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const isPro = user?.subscriptionStatus === "pro";
  const isHobby = user?.subscriptionStatus === "hobby";
  const isBusiness = user?.subscriptionStatus === "business";
  const maxPhotos = isPro || isBusiness ? 3 : isHobby ? 2 : 1;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
    if (
      user &&
      (user.subscriptionStatus === "basic" ||
        user.subscriptionStatus === "hobby") &&
      activeTab === "seo"
    ) {
      // Logic to handle restricted access if necessary
      // router.push("/account");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.dailyScansCount !== undefined) {
      setDailyScansUsed(user.dailyScansCount);
    }
  }, [user]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const downloadCSV = () => {
    if (listingHistory.length === 0) return;

    const headers = [
      "Title",
      "Description",
      "Category",
      "Tags",
      "Brand",
      "Model",
      "Condition",
      "Material",
    ];

    const rows = listingHistory.map((item) => [
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.tags.join(", ")}"`,
      `"${item.specs?.Brand || ""}"`,
      `"${item.specs?.Model || ""}"`,
      `"${item.specs?.Condition || ""}"`,
      `"${item.specs?.["Material/Type"] || ""}"`,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `listings_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareCSV = async () => {
    if (listingHistory.length === 0) return;

    // 1. Create the CSV Content
    const headers = [
      "Title",
      "Description",
      "Category",
      "Tags",
      "Brand",
      "Model",
      "Condition",
      "Material",
    ];
    const rows = listingHistory.map((item) => [
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.tags.join(", ")}"`,
      `"${item.specs?.Brand || ""}"`,
      `"${item.specs?.Model || ""}"`,
      `"${item.specs?.Condition || ""}"`,
      `"${item.specs?.["Material/Type"] || ""}"`,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    // 2. Create a File object (required for navigator.share)
    const filename = `listings_${new Date().toISOString().split("T")[0]}.csv`;
    const file = new File([csvContent], filename, { type: "text/csv" });

    // 3. Check if the browser supports sharing files
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "My SEO Listings Export",
          text: "Attached is the CSV export of my generated listings.",
        });
      } catch (err) {
        console.error("Error sharing:", err);
        // Fallback to download if user cancels or error occurs
        downloadCSV();
      }
    } else {
      // Fallback for browsers that don't support file sharing (Desktop)
      downloadCSV();
    }
  };

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
      // Ensure this points to your Express backend via getApiUrl
      const res = await fetch(getApiUrl("/api/listing/analyze"), {
        method: "POST",
        headers: {
          // Include your custom auth token if applicable
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        incrementScans();
        if (isBusiness) setListingHistory((prev) => [...prev, data]);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        throw new Error(data.error || "Generation failed");
      }
    } catch (err) {
      setAlertModal({
        title: "Error",
        message: "Failed to generate listing. Please try again.",
      });
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

  const applyWhiteBackground = (transparentUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // 1. Fill background with white
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // 2. Draw the transparent AI image on top
          ctx.drawImage(img, 0, 0);

          // 3. Convert back to a URL
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(URL.createObjectURL(blob));
            },
            "image/jpeg",
            0.9,
          ); // JPEG is better for white backgrounds
        }
      };
      img.src = transparentUrl;
    });
  };

  const processBackgroundRemoval = async () => {
    if (studioImages.length === 0) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("image", studioImages[0]);

    try {
      // Updated to use getApiUrl for the background removal route
      const res = await fetch(getApiUrl("/api/listing/remove-background"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Server error");

      const imageBlob = await res.blob();
      const imageUrl = URL.createObjectURL(imageBlob);

      if (useWhiteBackground) {
        const whiteBgUrl = await applyWhiteBackground(imageUrl);
        setResultImage(whiteBgUrl);
        URL.revokeObjectURL(imageUrl);
      } else {
        setResultImage(imageUrl);
      }
    } catch (err) {
      setAlertModal({
        title: "Studio Error",
        message: "Error processing image. Please try again.",
      });
    } finally {
      setTimeout(() => {
        backgroundRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <Loading />
      </div>
    );
  }
  if (!user) return null;

  return (
    <main className="listing-page">
      <header className="listing-page__header">
        <button onClick={handleBack} className="back-btn">
          <ArrowLeft size={20} />
        </button>
        <div className="listing-page__header-content">
          <div className="listing-page__header-container">
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
      </header>

      <div className="listing-studio__container">
        {activeTab === "seo" ? (
          /* --- SEO GENERATOR VIEW --- */
          <div className="listing-grid">
            <section className="listing-grid__input">
              <div className="card listing-card--sticky">
                <div className="listing-card--title">
                  <h3 className="card-title">
                    <Package size={28} /> SEO Generator
                  </h3>
                  <div className="home-stats__item">
                    <BarChart3 size={16} className="orange-icon" />
                    <span className="home-stats__item">
                      <b>
                        {dailyScansUsed} /{" "}
                        {isPro
                          ? "100"
                          : isHobby
                            ? "50"
                            : isBusiness
                              ? "250"
                              : "5"}{" "}
                        scans
                      </b>
                    </span>
                  </div>
                </div>
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
                              <X size={18} />
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

                {isBusiness && listingHistory.length > 0 && (
                  <div className="share-grid-container">
                    <div className="share-grid">
                      <button onClick={handleShareCSV} className="generate-btn">
                        <Upload size={13} />
                        Share
                      </button>

                      <button onClick={downloadCSV} className="secondary-btn">
                        <Download size={13} />
                        Save to File
                      </button>
                    </div>
                    <p className="download-hint">
                      CSV includes all {listingHistory.length} item(s) from this
                      session. Past sessions are not saved.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="listing-grid__results">
              {!result && !loading ? (
                <div className="empty-state">
                  <Layout size={48} />
                  <h3>Your listing details will appear here</h3>
                  <p>Upload angles of your item to generate SEO metadata</p>
                </div>
              ) : loading ? (
                <div className="loading-state">
                  <Loading />
                </div>
              ) : (
                <div className="results-wrapper">
                  <div className="result-group card">
                    {/* <div className="result-group__header">
                      <h1>BETA</h1>
                    </div> */}
                    <div className="result-group__header">
                      <label>
                        <Tag size={18} /> Optimized Title
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

                  <div className="result-group card" ref={resultsRef}>
                    <div className="result-group__header">
                      <label>
                        <CircleDollarSign size={18} /> Estimated resale price
                      </label>
                      <button
                        onClick={() =>
                          copyToClipboard(result.suggestedPrice, "price")
                        }
                      >
                        {copiedField === "price" ? (
                          <Check size={16} color="#22c55e" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                    <div className="result-value--desc whitespace-pre-wrap">
                      {result.suggestedPrice}
                    </div>
                  </div>

                  <div className="result-group card">
                    <div className="result-group__header">
                      <label>
                        <Layout size={18} /> Suggested platform for resale
                      </label>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            result.likelyBestPlatformToSellTheItemOn,
                            "platform",
                          )
                        }
                      >
                        {copiedField === "platform" ? (
                          <Check size={16} color="#22c55e" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                    <div className="result-value--desc whitespace-pre-wrap">
                      {result.likelyBestPlatformToSellTheItemOn}
                    </div>
                  </div>
                  <div className="result-group card">
                    <div className="result-group__header">
                      <label>
                        <Info size={18} /> Product Description
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
              {result?.tags && result?.tags.length > 0 && (
                <div className="result-group card">
                  <div className="result-group__header">
                    <label>
                      <Tags size={18} /> Optimized Tags
                    </label>
                    <span className="hint-text">Click tag to copy</span>
                  </div>
                  <div className="tags-container--tags">
                    {result?.tags.map((tag: string, index: number) => {
                      const tagKey = `tag-${index}`;
                      return (
                        <button
                          key={tagKey}
                          className={`tag-pill ${
                            copiedField === tagKey ? "copied" : ""
                          }`}
                          onClick={() => copyToClipboard(tag, tagKey)}
                        >
                          {tag}
                          {copiedField === tagKey ? (
                            <Check size={12} className="tag-icon" />
                          ) : (
                            <Copy size={12} className="tag-icon" />
                          )}
                        </button>
                      );
                    })}
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
                <div className="listing-card--title-col">
                  <h3 className="card-title">
                    <ImageIcon size={28} /> Photo Studio (Beta)
                  </h3>
                  <p className="hint-text-big">
                    For best results, take photos in a well-lit environment with
                    a solid background.
                  </p>
                </div>
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
                            <X size={18} />
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
                <div
                  className={`studio-option ${
                    useWhiteBackground ? "active" : ""
                  }`}
                >
                  <div className="studio-option__content">
                    <label htmlFor="white-bg" className="studio-option__label">
                      Apply solid white background
                      {/* <span className="studio-option__hint">(eBay/Amazon style)</span> */}
                    </label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        id="white-bg"
                        checked={useWhiteBackground}
                        onChange={(e) =>
                          setUseWhiteBackground(e.target.checked)
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
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
                <p className="download-hint">
                  Photo Studio does not count toward your daily scan limit.
                </p>
              </div>
            </section>

            <section className="listing-grid__results">
              {!resultImage && !isProcessing ? (
                <div className="empty-state">
                  <ImageIcon size={48} />
                  <h3>Your listing photo will appear here</h3>
                  {useWhiteBackground ? (
                    <p>The image will be have a white background</p>
                  ) : (
                    <p>The image will be have a transparent background</p>
                  )}
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
                        <ImageIcon size={18} /> Generated Image
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
                      ref={backgroundRef}
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
      <InfoModal
        isOpen={!!alertModal}
        onClose={() => setAlertModal(null)}
        title={alertModal?.title || "Notice"}
      >
        <div className="help-article">
          <p className="help-article__text">{alertModal?.message}</p>
          <div className="help-article__actions">
            <button
              className="modal-btn modal-btn--secondary"
              onClick={() => setAlertModal(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      </InfoModal>
    </main>
  );
}
