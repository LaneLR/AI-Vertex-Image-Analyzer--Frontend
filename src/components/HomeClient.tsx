"use client";

import React, { useState } from "react";
import { Camera, Zap, BarChart3, History, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Loading from "./Loading";

export default function HomeClient({ user: initialUser }: { user: any }) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // status can be "loading", "authenticated", or "unauthenticated"
  const { data: session, status } = useSession();
  
  // Use session user if available, otherwise fallback to the initial user from server
  const user = session?.user || initialUser;

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
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Prevent crash while session is mounting
  if (status === "loading" && !initialUser) {
    return <Loading />;
  }

  return (
    <main className="home-screen">
      <section className="home-stats">
        <div className="home-stats__item">
          <Zap size={16} className="icon-gold" />
          {/* 2. Added optional chaining user?. to safely check status */}
          <span>{user?.subscriptionStatus === 'pro' ? 'Pro Plan' : 'Basic Plan'}</span>
        </div>
        <div className="home-stats__item">
          <BarChart3 size={16} />
          <span className="home-stats__item">
            {user?.dailyScansCount || 0} / {user?.subscriptionStatus === 'pro' ? '∞' : '5'} daily scans
          </span>
        </div>
      </section>

      <div className="home-container">
        <section className="home-hero">
          <h1>Identify & Appraise <span className="text-gradient">Instantly</span></h1>
          <p>Snapshot any item to get real-world resale values and market data.</p>
        </section>

        <div className="home-upload card">
          {preview ? (
            <div className="home-upload__preview">
              <img src={preview} alt="Preview" />
              <button className="btn-reset" onClick={() => {setPreview(null); setImage(null); setResult(null);}}>
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
            className={`generate-btn ${loading ? 'loading' : ''}`}
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
    </main>
  );
}