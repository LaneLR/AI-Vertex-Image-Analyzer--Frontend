// eslint-disable-next-line @typescript-eslint/no-explicit-any
"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Search,
  Clock,
  ChevronDown,
  ChevronUp,
  Tag,
  ExternalLink,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api-config";
import getGradeColor from "@/helpers/colorGrade";
import InfoModal from "./InfoModal";

interface HistoryItem {
  id: string;
  itemTitle: string;
  priceRange: string;
  description?: string;
  createdAt: string;
  platform: string;
  sources?: string[];
  grade?: string;
}

export default function HistoryClient({ user }: { user: any }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(getApiUrl("/api/user/history"));
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

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Instead of confirm(), we set the target ID to trigger the Confirm Modal
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(getApiUrl(`/api/user/history/${deleteTarget}`), {
        method: "DELETE",
      });

      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== deleteTarget));
        if (expandedId === deleteTarget) setExpandedId(null);
        setDeleteTarget(null); // Close modal
      } else {
        const data = await res.json();
        setDeleteTarget(null); // Close confirm modal
        setErrorMessage(data.error || "Failed to delete scan.");
      }
    } catch (err) {
      console.error("Failed to delete", err);
      setDeleteTarget(null);
      setErrorMessage("An error occurred while connecting to the server.");
    }
  };

  return (
    <main className="history-page">
      <nav className="history-page__nav">
        <Link href="/account" className="history-page__nav-back">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="history-page__nav-title">Scan History</h1>
        <div />
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
            <Link href="/" className="generate-btn">
              Start Scanning
            </Link>
          </div>
        ) : (
          <div className="history-page__list">
            {history.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className={`history-card ${
                    isExpanded ? "history-card--expanded" : ""
                  }`}
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="history-card__main">
                    <div className="history-card__icon-box">
                      {/* Show grade if exists, otherwise show Tag */}
                      {item.grade ? (
                        <span
                          className="history-card__grade-icon"
                          style={{ color: getGradeColor(item.grade) }}
                        >
                          {item.grade}
                        </span>
                      ) : (
                        <Tag size={20} />
                      )}
                    </div>
                    <div className="history-card__info">
                      <div className="history-card__header">
                        <h4 className="history-card__title">
                          {item.itemTitle}
                        </h4>
                        <div className="history-card__actions">
                          <span className="history-card__price">
                            {item.priceRange}
                          </span>
                          <button
                            onClick={(e) => handleDeleteClick(e, item.id)}
                            className="history-card__delete-btn"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="history-card__meta">
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <span className="history-card__dot">•</span>
                        <span>{item.platform}</span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="history-card__details">
                      <div className="history-card__divider" />
                      <p className="history-card__full-desc">
                        {item.description}
                      </p>

                      {item.sources && item.sources.length > 0 && (
                        <div className="history-card__sources">
                          <h5>Marketplace Sources:</h5>
                          <ul>
                            {item.sources.map((source, idx) => (
                              <li key={idx}>
                                {/* <ExternalLink size={12} />  */}
                                {source}
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

      <InfoModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Scan"
        footer={
          <div className="modal-footer-gap">
            <button
              className="btn-secondary"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </button>
            <button className="btn-danger" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        }
      >
        <p>
          Are you sure you want to remove this item from your history? This
          action cannot be undone.
        </p>
      </InfoModal>

      <InfoModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        title="Delete Error"
      >
        <div className="errorModal-cont">
          <p className="errorModal-text">{errorMessage}</p>
          <button
            className="generate-btn"
            onClick={() => setErrorMessage(null)}
          >
            Got it
          </button>
        </div>
      </InfoModal>
    </main>
  );
}
