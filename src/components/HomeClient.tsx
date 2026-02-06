"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  Zap,
  BarChart3,
  Search,
  Sparkles,
  X,
  BriefcaseBusiness,
  Flame,
  ZapOff,
  Layout,
  Gem,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added router
import Loading from "./Loading";
import InfoModal from "./InfoModal";
import { getApiUrl } from "@/lib/api-config";
import { useApp } from "@/context/AppContext";
import getGradeColor from "@/helpers/colorGrade";
import { resizeImage } from "@/utils/imageUtils";

export default function HomeClient() {
  const { user, isLoading, dailyScansUsed, setDailyScansUsed, incrementScans } =
    useApp();
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [addToInventory, setAddToInventory] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="loading-state">
        <Loading />
      </div>
    );
  }

  const isPro = user?.subscriptionStatus === "pro";
  const isHobby = user?.subscriptionStatus === "hobby";
  const isBusiness = user?.subscriptionStatus === "business";
  const isBasic = user?.subscriptionStatus === "basic";
  const maxPhotos = isPro || isBusiness ? 3 : isHobby ? 2 : 1;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const limitedFiles = selectedFiles.slice(0, maxPhotos);

    setImages(limitedFiles);

    previews.forEach((url) => URL.revokeObjectURL(url));

    const newPreviews = limitedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  // const analyzeItem = async () => {
  //   if (images.length === 0) return;
  //   setLoading(true);

  //   const formData = new FormData();

  //   try {
  //     // 1. Resize all images in parallel before sending
  //     // This reduces the payload from ~20MB down to ~300KB
  //     const resizedImageBlobs = await Promise.all(
  //       images.map((img) => resizeImage(img, 768)),
  //     );

  //     // 2. Append the resized Blobs to FormData
  //     resizedImageBlobs.forEach((blob, index) => {
  //       // We give it a filename so the backend Multer knows it's an image
  //       formData.append("image", blob, `image-${index}.jpg`);
  //     });

  //     formData.append("mode", "appraisal");
  //     formData.append("addToInventory", String(addToInventory));

  //     const token = localStorage.getItem("token");
  //     const res = await fetch(getApiUrl("/api/analyze"), {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       setResult(data);
  //       incrementScans();
  //       setTimeout(() => {
  //         resultsRef.current?.scrollIntoView({
  //           behavior: "smooth",
  //           block: "start",
  //         });
  //       }, 100);
  //     } else if (res.status === 429) {
  //       setShowModal(true);
  //     } else if (res.status === 401) {
  //       router.push("/login");
  //     } else {
  //       setShowErrorModal(true);
  //     }
  //   } catch (err) {
  //     console.error("Analysis Error:", err);
  //     setShowErrorModal(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //not changing image size smaller
  const analyzeItem = async () => {
    if (images.length === 0) return;

    setLoading(true);

    const formData = new FormData();

    images.forEach((img) => formData.append("image", img));

    formData.append("mode", "appraisal");

    formData.append("addToInventory", String(addToInventory));

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(getApiUrl("/api/listing/analyze"), {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);

        incrementScans();
      } else if (res.status === 429) {
        setShowModal(true);
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error(err);

      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAdditionalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && images.length < 3) {
      setImages((prev) => [...prev, file]);
      setPreviews((prev) => [...prev, URL.createObjectURL(file)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];

    // Revoke the URL to save memory
    URL.revokeObjectURL(newPreviews[index]);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setPreviews(newPreviews);
  };

  return (
    <main className="home-screen">
      <section className="home-stats">
        <div className="home-stats__item">
          {isBusiness ? (
            <BriefcaseBusiness size={18} className="orange-icon" />
          ) : isPro ? (
            <Flame size={18} className="orange-icon" />
          ) : isHobby ? (
            <Zap size={18} className="orange-icon" />
          ) : (
            <ZapOff size={18} />
          )}
          <span>
            {isPro
              ? "Pro Plan"
              : isHobby
                ? "Hobby Plan"
                : isBusiness
                  ? "Elite Plan"
                  : "Free Plan"}
          </span>
        </div>
        {/* <div className="home-stats--title">
          <span className="primary-text">Resale</span>
          <span className="secondary-text">IQ</span>
        </div> */}
        <div className="home-stats__item">
          <BarChart3 size={16} className="orange-icon" />
          <span className="home-stats__item">
            {dailyScansUsed} /{" "}
            {isPro ? "100" : isHobby ? "50" : isBusiness ? "250" : "5"} scans
          </span>
        </div>
      </section>

      <div className="home-container">
        <div className="home-top-section">
          <section className="home-hero">
            <h1>Identify & Appraise Instantly</h1>
            <p>Snapshot any item to get resale values and profit estimates.</p>
          </section>

          <div className="home-upload card">
            {previews.length > 0 ? (
              <div className="home-upload__preview-container">
                <div className="preview-grid multi">
                  {/* Render existing previews */}
                  {previews.map((src, idx) => (
                    <div key={idx} className="preview-item">
                      <img src={src} alt="Preview" className="preview-img" />
                      <button
                        className="remove-single"
                        onClick={() => handleRemoveImage(idx)}
                        data-ph-capture-attribute-button-name="dashboard-remove-image-btn"
                        data-ph-capture-attribute-feature="dashboard"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Show empty slots for Pro users to add more (up to 3) */}
                  {(isPro || isHobby || isBusiness) && previews.length < 3 && (
                    <label className="add-more-slot">
                      <input
                        type="file"
                        onChange={handleAdditionalFile}
                        accept="image/*"
                        hidden
                      />
                      <Camera size={20} />
                      <span>Add Photo</span>
                    </label>
                  )}
                </div>

                <button
                  className="btn-reset"
                  onClick={() => {
                    setPreviews([]);
                    setImages([]);
                    setResult(null);
                  }}
                  data-ph-capture-attribute-button-name="dashboard-remove-all-image-btn"
                  data-ph-capture-attribute-feature="dashboard"
                >
                  Clear All
                </button>
              </div>
            ) : (
              /* Standard Dropzone for the first upload */
              <label className="home-upload__dropzone">
                <input
                  type="file"
                  onChange={handleFile}
                  accept="image/*"
                  multiple={isPro || isHobby || isBusiness}
                  hidden
                />
                <div className="dropzone-ui">
                  <div className="camera-icon-wrapper">
                    <Camera size={32} />
                  </div>
                  <h3>
                    {isPro || isHobby || isBusiness
                      ? "Upload up to 3 photos"
                      : "Capture or Upload"}
                  </h3>
                  <p className="image-subtext">
                    Show different angles for more accurate anaysis
                  </p>
                </div>
              </label>
            )}
            {isBusiness && (
              <div
                className={`studio-option ${addToInventory ? "active" : ""}`}
              >
                <div className="studio-option__content">
                  <label
                    htmlFor="inventory-toggle"
                    className="studio-option__label"
                  >
                    Auto-add to Inventory
                  </label>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      id="inventory-toggle"
                      checked={addToInventory}
                      onChange={(e) => setAddToInventory(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}
            <button
              className={`generate-btn ${loading ? "loading" : ""}`}
              disabled={images.length === 0 || loading}
              onClick={analyzeItem}
              data-ph-capture-attribute-button-name="dashboard-analyze-btn"
              data-ph-capture-attribute-feature="dashboard"
            >
              {loading ? (
                <Sparkles className="animate-spin" />
              ) : (
                <Search size={20} />
              )}
              {loading
                ? "Analyzing..."
                : `Appraise Item (${images.length} Photo${
                    images.length !== 1 ? "s" : ""
                  })`}
            </button>
          </div>
        </div>

        {!result && !loading ? (
          <div className="empty-state">
            <Gem size={48} />
            <h3>Your item's appraisal details will appear here</h3>
            <p>
              For more accurate results, show as many defining details of your
              item as possible
            </p>
          </div>
        ) : loading ? (
          <div className="loading-state">
            <Loading />
          </div>
        ) : (
          <section className="home-result animate-fade-in">
            <div className="card result-card" ref={resultsRef}>
              <div className="result-card__header-flex">
                <div className="result-card__price-tag">
                  <label>Estimated Value</label>
                  <h2>{result.priceRange}</h2>
                </div>
                {!isBasic && result.grade && (
                  <div
                    className="grade-badge"
                    style={{ borderColor: getGradeColor(result.grade) }}
                  >
                    <span className="grade-badge__label">FLIP GRADE</span>
                    <span
                      className="grade-badge__value"
                      style={{ color: getGradeColor(result.grade) }}
                    >
                      {result.grade}
                    </span>
                  </div>
                )}
              </div>

              <div className="result-card__body">
                <h3>{result.title}</h3>
                <p>{result.description}</p>
              </div>

              {result.sources && (
                <div className="result-card__sources" ref={resultsRef}>
                  <h4>Details from Online Listings</h4>
                  {result.sources.map((s: string, i: number) => (
                    <div key={i} className="source-pill">
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <InfoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={"Limit Reached"}
      >
        <div className="too-many-scans-cont">
          <p>
            You've reached your max scans for today. Upgrade your account for
            more!
          </p>
          <Link
            href="/payments"
            className="generate-btn"
            data-ph-capture-attribute-button-name="dashboard-view-plans-btn"
            data-ph-capture-attribute-feature="dashboard"
          >
            View Plans
          </Link>
        </div>
      </InfoModal>

      <InfoModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={"Error"}
      >
        <div className="errorModal-cont">
          <p>One or more images could not be scanned. Please try again.</p>
        </div>
      </InfoModal>

      <InfoModal
        isOpen={!!showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={"Error scanning item"}
      >
        <div className="too-many-scans-cont">
          <div className="errorModal-cont">
            <div className="errorModal-text">
              One or more of the images could not be scanned.
            </div>
            <div className="errorModal-text">
              Please select a different photo and try again.
            </div>
          </div>
        </div>
      </InfoModal>
    </main>
  );
}
