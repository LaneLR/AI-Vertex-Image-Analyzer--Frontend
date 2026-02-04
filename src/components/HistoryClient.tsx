// eslint-disable-next-line @typescript-eslint/no-explicit-any
"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
  Tag,
  Trash2,
  Package,
  Boxes,
} from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api-config";
import getGradeColor from "@/helpers/colorGrade";
import InfoModal from "./InfoModal";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import { useApp } from "@/context/AppContext";

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

export default function HistoryClient() {
  const { user, isLoading, setIsLoading } = useApp();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<string[]>([
    "Today",
    "Last 7 Days",
  ]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const isHobby = user?.subscriptionStatus === "hobby";
  const isPro = user?.subscriptionStatus === "pro";
  const isBusiness = user?.subscriptionStatus === "business";

  useEffect(() => {
    // Only fetch if we have a user and auth is finished loading
    if (isLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function fetchHistory() {
      try {
        const token = localStorage.getItem("token"); // Retrieve your JWT
        const res = await fetch(getApiUrl("/api/user/history"), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setHistory(data);
        } else if (res.status === 401) {
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, [user, isLoading, router]);

  const authFetch = (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    return fetch(getApiUrl(url), {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAddToInventory = async (id: string) => {
    try {
      const res = await authFetch(`/api/user/history/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ inInventory: true }),
      });

      if (res.ok) {
        setSuccessMessage("Item added to your inventory!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Failed to add to inventory.");
      }
    } catch (err) {
      setErrorMessage("An error occurred.");
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await authFetch(`/api/user/history/${deleteTarget}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== deleteTarget));
        if (expandedId === deleteTarget) setExpandedId(null);
        setDeleteTarget(null);
      } else {
        setErrorMessage("Failed to delete scan.");
      }
    } catch (err) {
      setErrorMessage("An error occurred.");
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const groupHistoryByDate = (items: HistoryItem[]) => {
    const groups: { [key: string]: HistoryItem[] } = {};
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    items.forEach((item) => {
      const itemDate = new Date(item.createdAt);
      let groupKey = "";

      if (itemDate >= today) {
        groupKey = "Today";
      } else if (itemDate >= sevenDaysAgo) {
        groupKey = "Last 7 Days";
      } else {
        groupKey = itemDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      }

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    });

    return groups;
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const groupedHistory = groupHistoryByDate(history);

  if (isLoading) {
    return (
      <div className="loading-state">
        <Loading />
      </div>
    );
  }
  if (!user) return null;

  return (
    <main className="history-page">
      <nav className="history-page__nav">
        <button
          onClick={handleBack}
          className="back-btn"
          data-ph-capture-attribute-button-name="history-back-btn"
          data-ph-capture-attribute-feature="back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="history-page__nav-title">Scan History</h1>
        <div className="header-spacer" />
      </nav>

      <div className="history-page__container">
        {isLoading ? (
          <div className="history-page__loading">
            <div className="spinner"></div>
            <p>Loading your scans...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="history-page__empty">
            <Search size={48} className="history-page__empty-icon" />
            <h3>No Scans Yet</h3>
            <p>Items you appraise will appear here.</p>
            <Link
              href="/dashboard"
              className="generate-btn"
              data-ph-capture-attribute-button-name="history-start-scanning-btn"
              data-ph-capture-attribute-feature="history"
            >
              Start Scanning
            </Link>
          </div>
        ) : (
          <div className="history-page__list">
            {Object.entries(groupedHistory).map(([label, items]) => {
              const isSectionOpen = openSections.includes(label);
              return (
                <div key={label} className="history-section">
                  <div
                    className="history-section__header"
                    onClick={() => toggleSection(label)}
                    data-ph-capture-attribute-button-name="history-expand-section-btn"
                    data-ph-capture-attribute-feature="history"
                  >
                    <h3 className="history-section__label">
                      {label}
                      {isSectionOpen ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </h3>

                    {/* </div> */}
                  </div>
                  {isSectionOpen && (
                    <div className="history-section__items">
                      {items.map((item) => {
                        const isExpanded = expandedId === item.id;
                        return (
                          <div
                            key={item.id}
                            className={`history-card ${
                              isExpanded ? "history-card--expanded" : ""
                            }`}
                            onClick={() => toggleExpand(item.id)}
                            data-ph-capture-attribute-button-name="history-expand-btn"
                            data-ph-capture-attribute-feature="history"
                          >
                            <div className="history-card__main">
                              <div className="history-card__icon-box">
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
                                      onClick={(e) =>
                                        handleDeleteClick(e, item.id)
                                      }
                                      className="history-card__delete-btn"
                                      data-ph-capture-attribute-button-name="history-delete-item-btn"
                                      data-ph-capture-attribute-feature="history"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                    {isBusiness ||
                                      (isPro && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToInventory(item.id);
                                          }}
                                          data-ph-capture-attribute-button-name="history-add-inventory-btn"
                                          data-ph-capture-attribute-feature="history"
                                          className="history-card__inventory-btn"
                                          title="Add to Inventory"
                                        >
                                          <Boxes size={18} />
                                        </button>
                                      ))}
                                  </div>
                                </div>
                                <div className="history-card__meta">
                                  <span>
                                    {new Date(
                                      item.createdAt,
                                    ).toLocaleDateString()}
                                  </span>
                                  {/* <span className="history-card__dot">•</span> */}
                                  {/* <span>{item.platform}</span> */}
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
                                <p className="history-card__desc-title">
                                  {item.itemTitle}
                                </p>
                                <p className="history-card__full-desc">
                                  {item.description}
                                </p>

                                {item.sources && item.sources.length > 0 && (
                                  <div className="history-card__sources">
                                    <h5>Marketplace Sources:</h5>
                                    <ul>
                                      {item.sources.map((source, idx) => (
                                        <li key={idx}>{source}</li>
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
              );
            })}
          </div>
        )}

        {/* Modals are placed outside the loop for better performance */}
        <InfoModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Scan"
          footer={
            <div className="modal-footer-gap">
              <button
                className="btn-secondary"
                onClick={() => setDeleteTarget(null)}
                data-ph-capture-attribute-button-name="history-delete-modal-btn-cancel"
                data-ph-capture-attribute-feature="history"
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={confirmDelete}
                data-ph-capture-attribute-button-name="history-delete-modal-btn-confirm"
                data-ph-capture-attribute-feature="history"
              >
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
              data-ph-capture-attribute-button-name="history-error-modal-btn-close"
              data-ph-capture-attribute-feature="history"
            >
              Close
            </button>
          </div>
        </InfoModal>

        {successMessage && (
          <div className="history-page__toast success">
            <Package size={18} />
            {successMessage}
          </div>
        )}
      </div>
    </main>
  );
}
