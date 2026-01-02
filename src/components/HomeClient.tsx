"use client";

import React, { useEffect, useState } from "react";
import {
  Camera,
  Zap,
  BarChart3,
  History,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Loading from "./Loading";
import InfoModal from "./InfoModal";
import SubscribeButton from "./SubscribeButton";

export default function HomeClient({ user: initialUser }: { user: any }) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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

  // --- 1. Robust Extraction Helper ---
  const extractFirstNumber = (val: any): number => {
    if (typeof val === "number") return val;
    if (typeof val !== "string") return 0;
    const noCommas = val.replace(/,/g, '');
    const match = noCommas.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  // --- 2. Consistent Profit Calculation ---
  const calculateNet = (value: any, cost: string, shippingVal: any) => {
    const cleanValue = extractFirstNumber(value);
    const numericCost = parseFloat(cost) || 0;
    const shipping = extractFirstNumber(shippingVal); // Now dynamic
    const fees = cleanValue * 0.13;
    return cleanValue - fees - shipping - numericCost;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const analyzeItem = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("mode", "appraisal");

    try {
      const res = await fetch("/api/analyze", {
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

  const isPro = user?.subscriptionStatus === "pro";

  if (status === "loading" && !initialUser) {
    return <Loading />;
  }

  // --- 3. Pre-calculate values for display ---
  const rawValue = result?.priceRange || result?.estimatedValue || "0";
  const cleanEstimatedValue = extractFirstNumber(rawValue);
  const platformFees = cleanEstimatedValue * 0.13;
  const dynamicShipping = extractFirstNumber(result?.estimatedShippingCost || 0);
  const netProfit = calculateNet(rawValue, itemCost, dynamicShipping);

  return (
    <main className="home-screen">
      <section className="home-stats">
        <div className="home-stats__item">
          <Zap size={16} className="icon-gold" />
          <span>{isPro ? "Pro Plan" : "Basic Plan"}</span>
        </div>
        <div className="home-stats__item">
          <BarChart3 size={16} />
          <span className="home-stats__item">
            {scansCount} / {isPro ? "∞" : "5"} daily scans
          </span>
        </div>
      </section>

      <div className="home-container">
        <section className="home-hero">
          <h1>Identify & Appraise <span className="text-gradient">Instantly</span></h1>
          <p>Snapshot any item to get resale values and profit estimates.</p>
        </section>

        <div className="home-upload card">
          {preview ? (
            <div className="home-upload__preview">
              <img src={preview} alt="Preview" />
              <button
                className="btn-reset"
                onClick={() => {
                  setPreview(null);
                  setImage(null);
                  setResult(null);
                  setItemCost("");
                }}
              >
                Clear
              </button>
            </div>
          ) : (
            <label className="home-upload__dropzone">
              <input type="file" onChange={handleFile} accept="image/*" hidden />
              <div className="dropzone-ui">
                <div className="camera-icon-wrapper">
                  <Camera size={32} />
                </div>
                <h3>Capture or Upload</h3>
                <p>Take a clear photo of the item's front</p>
              </div>
            </label>
          )}

          <button
            className={`generate-btn ${loading ? "loading" : ""}`}
            disabled={!image || loading}
            onClick={analyzeItem}
          >
            {loading ? <Sparkles className="animate-spin" /> : <Search size={20} />}
            {loading ? "Analyzing..." : " Appraise Item"}
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
                  <span style={{ color: "var(--text-tertiary)", fontWeight: "700" }}>$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                  />
                </div>

                {itemCost && (
                  <div className="profit-summary" onClick={() => setShowBreakdown(!showBreakdown)}>
                    <div className="profit-main">
                      <span>Estimated Net Profit:</span>
                      <span className={`profit-amount ${netProfit > 0 ? "pos" : "neg"}`}>
                        ${netProfit.toFixed(2)}
                      </span>
                    </div>
                    <p className="tap-hint">{showBreakdown ? "Hide" : "View"} breakdown</p>

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
                              <td>-${(parseFloat(itemCost) || 0).toFixed(2)}</td>
                            </tr>
                            <tr className="total-row">
                              <td><strong>Net Take-home</strong></td>
                              <td><strong>${netProfit.toFixed(2)}</strong></td>
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
                    <div key={i} className="source-pill">{s}</div>
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
          <Link href="/listing" className="nav-card nav-card--pro">
            <Zap />
            <span>Listing Studio</span>
          </Link>
        </nav>
      </div>

      <InfoModal isOpen={!!showModal} onClose={() => setShowModal(false)} title={"Too many scans"}>
        <div className="too-many-scans-cont">
          <div>You've reached your max scans for today. Upgrade to Pro for unlimited scans!</div>
          <div className="upgrade-btn-cont">
            <SubscribeButton priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!} />
          </div>
        </div>
      </InfoModal>

      <InfoModal isOpen={!!showErrorModal} onClose={() => setShowErrorModal(false)} title={"Error scanning item"}>
        <div className="too-many-scans-cont">
          <div className="errorModal-cont">
            <div className="errorModal-text">One or more of the images could not be scanned.</div>
            <div className="errorModal-text">Please select a different photo and try again.</div>
          </div>
        </div>
      </InfoModal>
    </main>
  );
}