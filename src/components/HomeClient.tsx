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
  RefreshCcw,
  Scan,
  ScanSearch,
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
  const [gradeAModal, setGradeAModal] = useState(false);
  const [gradeBModal, setGradeBModal] = useState(false);
  const [gradeCModal, setGradeCModal] = useState(false);
  const [gradeDModal, setGradeDModal] = useState(false);
  const [gradeFModal, setGradeFModal] = useState(false);

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
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 150);
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

  const getGradeModal = (grade: string) => {
    switch (grade) {
      case "A":
        setGradeAModal(true);
        break;
      case "B":
        setGradeBModal(true);
        break;
      case "C":
        setGradeCModal(true);
        break;
      case "D":
        setGradeDModal(true);
        break;
      case "F":
        setGradeFModal(true);
      default:
        break;
    }
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
            <p>Snapshot any item to get resale values!</p>
          </section>

          <div className="home-upload card">
            <div
              className={`upload-zone ${previews.length > 0 ? "has-image" : ""}`}
            >
              {previews.length > 0 ? (
                <div className="multi-preview-wrapper">
                  <div className="preview-grid-system">
                    {previews.map((src, idx) => (
                      <div key={idx} className="preview-slot">
                        <img src={src} alt={`Preview ${idx + 1}`} />
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveImage(idx)}
                          data-ph-capture-attribute-button-name="dashboard-remove-image-btn"
                          data-ph-capture-attribute-feature="dashboard"
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
                            onChange={handleAdditionalFile}
                            accept="image/*"
                            hidden
                          />
                          <Camera size={26} />
                          <span>Add Photo</span>
                        </label>
                      )}
                  </div>

                  <button
                    className="change-img-btn"
                    onClick={() => {
                      setPreviews([]);
                      setImages([]);
                      setResult(null);
                    }}
                    data-ph-capture-attribute-button-name="dashboard-remove-all-image-btn"
                    data-ph-capture-attribute-feature="dashboard"
                  >
                    <RefreshCcw size={16} /> Clear All
                  </button>
                </div>
              ) : (
                <label className="dropzone-label">
                  <input
                    type="file"
                    onChange={handleFile}
                    accept="image/*"
                    multiple={isPro || isHobby || isBusiness}
                    hidden
                  />
                  <div className="dropzone-content">
                    <div className="icon-circle">
                      <Camera size={40} />
                    </div>
                    <h3>
                      {isPro || isHobby || isBusiness
                        ? "Tap to take or upload photos"
                        : "Tap to take or upload a photo"}
                    </h3>
                    <p className="image-subtext">
                      Show different angles for more accurate analysis
                    </p>
                  </div>
                </label>
              )}
            </div>

            {/* Business Toggle remains at the bottom of the card */}
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
          </div>
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
              <ScanSearch size={20} />
            )}
            {loading
              ? "Analyzing..."
              : `Appraise Item (${images.length} Photo${images.length !== 1 ? "s" : ""})`}
          </button>
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
                    onClick={() => getGradeModal(result?.grade)}
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
            <br />
            <div className="errorModal-text">
              Please select a different photo and try again.
            </div>
          </div>
        </div>
      </InfoModal>

      <InfoModal
        isOpen={!!gradeAModal}
        onClose={() => setGradeAModal(false)}
        title={"Resale Grade A"}
      >
        <div>
          <strong>High Value | High Demand | High Stability</strong>
          <br />
          <br />
          <div>
            Grade A items are in high demand. It combines a high sell-through
            rate with consistent pricing and generally high margins. Items of
            this grade have high demand and low supply, meaning you can list
            this item and expect it to sell quickly.
          </div>
          <br />
          <div>
            <strong>Strategy:</strong> Buy if the margin is right.
          </div>
        </div>
        <br />
        <div className="delete-modal__actions">
          <button
            className="modal-btn modal-btn--secondary"
            onClick={() => setGradeAModal(false)}
            data-ph-capture-attribute-button-name="account-modal-btn-close"
            data-ph-capture-attribute-feature="account"
          >
            Close
          </button>
        </div>
      </InfoModal>

      <InfoModal
        isOpen={!!gradeBModal}
        onClose={() => setGradeBModal(false)}
        title={"Resale Grade B"}
      >
        <div>
          <strong>Good Value | Moderate Demand | Reliable</strong>
          <br />
          <br />
          <div>
            Grade B items are dependable earners. While they might not sell
            within 24 hours like a Grade A, they have a proven track record. You
            may encounter slight price fluctuations or a few more competitors,
            but the demand is strong enough to move the item at a healthy
            profit.
          </div>
          <br />
          <div>
            <strong>Strategy:</strong> Buy if the margin is right.
          </div>
        </div>
        <br />
        <div className="delete-modal__actions">
          <button
            className="modal-btn modal-btn--secondary"
            onClick={() => setGradeBModal(false)}
            data-ph-capture-attribute-button-name="account-modal-btn-close"
            data-ph-capture-attribute-feature="account"
          >
            Close
          </button>
        </div>
      </InfoModal>

      <InfoModal
        isOpen={!!gradeCModal}
        onClose={() => setGradeCModal(false)}
        title={"Resale Grade C"}
      >
        <div>
          <strong>High Value | Low Velocity | Volatile</strong>
          <br />
          <br />
          <div>
            Grade C items are often worth the buy, but can sit on your shelf for
            a while before the right buyer comes along. The price might also be
            volatile, swinging up and down based on trends.
          </div>
          <br />
          <div>
            <strong>Strategy:</strong> Only buy if you are comfortable holding
            onto the item for a long period or if the profit margin is massive.
          </div>
        </div>
        <br />
        <div className="delete-modal__actions">
          <button
            className="modal-btn modal-btn--secondary"
            onClick={() => setGradeCModal(false)}
            data-ph-capture-attribute-button-name="account-modal-btn-close"
            data-ph-capture-attribute-feature="account"
          >
            Close
          </button>
        </div>
      </InfoModal>

      <InfoModal
        isOpen={!!gradeDModal}
        onClose={() => setGradeDModal(false)}
        title={"Resale Grade D"}
      >
        <div>
          <strong>Low Value | High Saturation | Low Margin</strong>
          <br />
          <br />
          <div>
            Grade D items are tough to profit from. These are usually commodity
            items where hundreds of other sellers are offering the same thing
            and there is high supply on the market. Your profit will most likely
            be minimal.
          </div>
          <br />
          <div>
            <strong>Strategy:</strong> Usually best to pass, unless you are
            selling in very high volume.
          </div>
        </div>
        <br />
        <div className="delete-modal__actions">
          <button
            className="modal-btn modal-btn--secondary"
            onClick={() => setGradeDModal(false)}
            data-ph-capture-attribute-button-name="account-modal-btn-close"
            data-ph-capture-attribute-feature="account"
          >
            Close
          </button>
        </div>
      </InfoModal>

      <InfoModal
        isOpen={!!gradeFModal}
        onClose={() => setGradeFModal(false)}
        title={"Resale Grade F"}
      >
        <div>
          <strong>No or Low Value | High Risk | Restricted</strong>
          <br />
          <br />
          <div>
            Grade F items have virtually no viable resale market. This could be
            due to extreme market saturation, very low consumer demand, or the
            item being flagged as potentially counterfeit or restricted on major
            platforms.
          </div>
          <br />
          <div>
            <strong>Strategy:</strong> Avoid. This item is likely to cost you
            more in time and fees than it is worth.
          </div>
        </div>
        <br />
        <div className="delete-modal__actions">
          <button
            className="modal-btn modal-btn--secondary"
            onClick={() => setGradeFModal(false)}
            data-ph-capture-attribute-button-name="account-modal-btn-close"
            data-ph-capture-attribute-feature="account"
          >
            Close
          </button>
        </div>
      </InfoModal>
    </main>
  );
}
