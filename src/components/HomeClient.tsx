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
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Loading from "./Loading";
import InfoModal from "./InfoModal";
import SubscribeButton from "./SubscribeButton";
import { getApiUrl } from "@/lib/api-config";

export default function HomeClient({ user: initialUser }: { user: any }) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scansCount, setScansCount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [itemCost, setItemCost] = useState<string>("");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { data: session, status } = useSession();
  const user = session?.user || initialUser;

  useEffect(() => {
    if (user?.dailyScansCount !== undefined) {
      setScansCount(user.dailyScansCount);
    }
  }, [user?.dailyScansCount]);

  const isPro = user?.subscriptionStatus === "pro";
  const isHobby = user?.subscriptionStatus === "hobby";
  const maxPhotos = isPro || isHobby ? 3 : 1;

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
        setScansCount((prev) => prev + 1);
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

  const rawValue = result?.priceRange || result?.estimatedValue || "0";
  const cleanEstimatedValue = extractFirstNumber(rawValue);
  const platformFees = cleanEstimatedValue * 0.13;
  const dynamicShipping = extractFirstNumber(
    result?.estimatedShippingCost || 0
  );
  const netProfit = calculateNet(rawValue, itemCost, dynamicShipping);

  return (
    <main className="home-screen">
      <section className="home-stats">
        <div className="home-stats__item">
          <Zap size={16} className="icon-gold" />
          <span>
            {isPro ? "Pro Plan" : isHobby ? "Hobbyist Plan" : "Basic Plan"}
          </span>
        </div>
        <div className="home-stats__item">
          <BarChart3 size={16} />
          <span className="home-stats__item">
            {scansCount} / {isPro ? "250" : isHobby ? "100" : "5"} daily scans
          </span>
        </div>
      </section>

      <div className="home-container">
        <section className="home-hero">
          <h1>
            Identify & Appraise <span className="text-gradient">Instantly</span>
          </h1>
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
                {(isPro || isHobby) && previews.length < 3 && (
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
                multiple={isPro || isHobby}
                hidden
              />
              <div className="dropzone-ui">
                <div className="camera-icon-wrapper">
                  <Camera size={32} />
                </div>
                <h3>
                  {isPro || isHobby
                    ? "Upload up to 3 photos"
                    : "Capture or Upload"}
                </h3>
                <p>Show different angles for better accuracy</p>
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
              <div className="result-card__price-tag">
                <label>Estimated Value</label>
                <h2>{result.priceRange}</h2>
              </div>

              <div className="result-card__body">
                <h3>{result.title}</h3>
                <p>{result.description}</p>
              </div>

              <div className="profit-calculator">
                <h3>Input the Item's Cost to Estimate Your Profit Margin</h3>
                <div className="input-group">
                  <div>Item Cost</div>
                  <span
                    style={{ color: "var(--text-tertiary)", fontWeight: "700" }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                  />
                </div>

                {itemCost && (
                  <div
                    className="profit-summary"
                    onClick={() => setShowBreakdown(!showBreakdown)}
                  >
                    <div className="profit-main">
                      <span>Estimated Net Profit:</span>
                      <span
                        className={`profit-amount ${
                          netProfit > 0 ? "pos" : "neg"
                        }`}
                      >
                        ${netProfit.toFixed(2)}
                      </span>
                    </div>
                    <p className="tap-hint">
                      {showBreakdown ? "Hide" : "View"} breakdown
                    </p>

                    {showBreakdown && (
                      <div className="profit-accordion">
                        <table className="fees-table">
                          <tbody>
                            <tr>
                              <td>Est. Sale Price (Low End)</td>
                              <td>+${cleanEstimatedValue.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td>Est. Platform Fee (13%)</td>
                              <td>-${platformFees.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td>Est. Shipping/Materials</td>
                              <td>-${dynamicShipping.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td>Your Cost</td>
                              <td>
                                -${(parseFloat(itemCost) || 0).toFixed(2)}
                              </td>
                            </tr>
                            <tr className="total-row">
                              <td>
                                <strong>Net Take-home</strong>
                              </td>
                              <td>
                                <strong>${netProfit.toFixed(2)}</strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
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
          <Link href="/history" className="nav-card">
            <History />
            <span>History</span>
          </Link>
          {(isPro || isHobby) && (
            <Link href="/listing" className="nav-card nav-card--pro">
              <Zap />
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
            <SubscribeButton
              priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!}
            />
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
