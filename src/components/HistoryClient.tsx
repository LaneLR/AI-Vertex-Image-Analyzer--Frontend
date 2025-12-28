// eslint-disable-next-line @typescript-eslint/no-explicit-any
"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Search, Clock, ChevronDown, ChevronUp, Tag, ExternalLink } from "lucide-react";
import Link from "next/link";

interface HistoryItem {
  id: string;
  itemTitle: string;
  priceRange: string;
  description?: string;
  createdAt: string;
  platform: string;
  sources?: string[]; 
}

export default function HistoryClient({ user }: { user: any }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/user/history");
        const data = await res.json();
        if (Array.isArray(data)) setHistory(data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className="history-page">
      <nav className="history-page__nav">
        <Link href="/account" className="history-page__nav-back">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="history-page__nav-title">Scan History</h1>
      </nav>

      <div className="history-page__container">
        {loading ? (
          <div className="history-page__loading">
            <div className="spinner"></div>
            <p>Loading your scans...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="history-page__empty">
            <Search size={48} className="history-page__empty-icon" />
            <h3>No Scans Yet</h3>
            <p>Items you appraise will appear here.</p>
            <Link href="/" className="btn-primary">Start Scanning</Link>
          </div>
        ) : (
          <div className="history-page__list">
            {history.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div 
                  key={item.id} 
                  className={`history-card ${isExpanded ? 'history-card--expanded' : ''}`}
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="history-card__main">
                    <div className="history-card__icon-box">
                      <Tag size={20} />
                    </div>
                    <div className="history-card__info">
                      <div className="history-card__header">
                        <h4 className="history-card__title">{item.itemTitle}</h4>
                        <span className="history-card__price">{item.priceRange}</span>
                      </div>
                      <div className="history-card__meta">
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        <span className="history-card__dot">•</span>
                        <span>{item.platform}</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {isExpanded && (
                    <div className="history-card__details">
                      <div className="history-card__divider" />
                      <p className="history-card__full-desc">{item.description}</p>
                      
                      {item.sources && item.sources.length > 0 && (
                        <div className="history-card__sources">
                          <h5>Marketplace Sources:</h5>
                          <ul>
                            {item.sources.map((source, idx) => (
                              <li key={idx}>
                                <ExternalLink size={12} /> {source}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}