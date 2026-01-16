"use client";

import React, { useEffect, useState } from "react";
import {
  Camera,
  Zap,
  BarChart3,
  History,
  Search,
  Sparkles,
  X,
  Wand2,
  BriefcaseBusiness,
  Flame,
  ZapOff,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Loading from "./Loading";
import InfoModal from "./InfoModal";
import SubscribeButton from "./Payments";
import { getApiUrl } from "@/lib/api-config";
import { useApp } from "@/context/AppContext";
import getGradeColor from "@/helpers/colorGrade";

export default function HomeClient({ user: initialUser }: { user: any }) {
  const { dailyScansUsed, setDailyScansUsed, incrementScans } = useApp();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [itemCost, setItemCost] = useState<string>("");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { data: session, status } = useSession();
  const user = session?.user || initialUser;

  // useEffect(() => {
  //   if (user?.dailyScansCount !== undefined && user?.lastScanDate) {
  //     const lastUpdate = new Date(user.lastScanDate);
  //     const now = new Date();

  //     const isNewDay =
  //       lastUpdate.getUTCFullYear() !== now.getUTCFullYear() ||
  //       lastUpdate.getUTCMonth() !== now.getUTCMonth() ||
  //       lastUpdate.getUTCDate() !== now.getUTCDate();

  //     if (isNewDay) {
  //       setScansCount(0);
  //     } else {
  //       setScansCount(user.dailyScansCount);
  //     }
  //   }
  // }, [user?.dailyScansCount, user?.updatedAt]);

  useEffect(() => {
    if (user?.dailyScansCount !== undefined) {
      const lastUpdate = new Date(user.lastScanDate || new Date());
      const now = new Date();
      const isNewDay = lastUpdate.getUTCDate() !== now.getUTCDate();

      setDailyScansUsed(isNewDay ? 0 : user.dailyScansCount);
    }
  }, [user?.dailyScansCount, user?.lastScanDate]);

  const isPro = user?.subscriptionStatus === "pro";
  const isHobby = user?.subscriptionStatus === "hobby";
  const isBusiness = user?.subscriptionStatus === "business";
  const maxPhotos = isPro || isHobby || isBusiness ? 3 : 1;

  // --- 1. Robust Extraction Helper ---
  const extractFirstNumber = (val: any): number => {
    if (typeof val === "number") return val;
    if (typeof val !== "string") return 0;
    const noCommas = val.replace(/,/g, "");
    const match = noCommas.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  // --- 2. Consistent Profit Calculation ---
  const calculateNet = (value: any, cost: string, shippingVal: any) => {
    const cleanValue = extractFirstNumber(value);
    const numericCost = parseFloat(cost) || 0;
    const shipping = extractFirstNumber(shippingVal);
    const fees = cleanValue * 0.13;
    return cleanValue - fees - shipping - numericCost;
  };

  // --- Updated File Handler ---
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const limitedFiles = selectedFiles.slice(0, maxPhotos);

    setImages(limitedFiles);

    previews.forEach((url) => URL.revokeObjectURL(url));

    const newPreviews = limitedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const analyzeItem = async () => {
    if (images.length === 0) return;
    setLoading(true);

    const formData = new FormData();
    images.forEach((img) => {
      formData.append("image", img);
    });
    formData.append("mode", "appraisal");

    try {
      const res = await fetch(getApiUrl("/api/analyze"), {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setResult(data);
        incrementScans();
      } else if (res.status === 429) {
        setShowModal(true);
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

  if (status === "loading" && !initialUser) {
    return <Loading />;
  }

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
                ? "Hobbyist Plan"
                : isBusiness
                  ? "Business Plan"
                  : "Basic Plan"}
          </span>
        </div>
        <div className="home-stats__item">
          <BarChart3 size={16} className="orange-icon"/>
          <span className="home-stats__item">
            {dailyScansUsed} /{" "}
            {isPro ? "100" : isHobby ? "50" : isBusiness ? "250" : "5"} daily
            scans
          </span>
        </div>
      </section>

      <div className="home-container">
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

          <button
            className={`generate-btn ${loading ? "loading" : ""}`}
            disabled={images.length === 0 || loading}
            onClick={analyzeItem}
          >
            {loading ? (
              <Sparkles className="animate-spin" />
            ) : (
              <Search size={20} />
            )}
            {loading
              ? "Analyzing..."
              : `Appraise ${images.length} Photo${
                  images.length > 1 ? "s" : ""
                }`}
          </button>
        </div>

        {result && (
          <section className="home-result animate-fade-in">
            <div className="card result-card">
              <div className="result-card__header-flex">
                <div className="result-card__price-tag">
                  <label>Estimated Value</label>
                  <h2>{result.priceRange}</h2>
                </div>
                {result.grade && (
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
                <div className="result-card__sources">
                  <h4>Market Evidence</h4>
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

        <nav className="home-nav-grid">
          <Link href="/history" className="nav-card nav-card--pro">
            <History />
            <span>Scan History</span>
          </Link>
          {(isPro || isHobby || isBusiness) && (
            <Link href="/listing" className="nav-card nav-card--pro">
              <Wand2 />
              <span>Listing Studio</span>
            </Link>
          )}
        </nav>
      </div>

      <InfoModal
        isOpen={!!showModal}
        onClose={() => setShowModal(false)}
        title={"Too many scans"}
      >
        <div className="too-many-scans-cont">
          <div>
            You've reached your max scans for today. Upgrade your account for
            more scans!
          </div>
          <div className="upgrade-btn-cont">
            <SubscribeButton user={user} />
          </div>
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
