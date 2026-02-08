"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Package,
  Trash2,
  Download,
  ArrowLeft,
  Plus,
  Minus,
  Eraser,
  DollarSign,
} from "lucide-react";
import { getApiUrl } from "@/lib/api-config";
import { useRouter } from "next/navigation";
import InfoModal from "./InfoModal";
import Loading from "./Loading";
import { useApp } from "@/context/AppContext";

interface InventoryItem {
  id: string;
  itemTitle: string;
  priceRange: string;
  description: string;
  grade: string;
  platform: string;
  quantity?: number;
  purchasePrice?: number;
  specs: {
    Brand?: string;
    Model?: string;
    Condition?: string;
    "Material/Type"?: string;
  };
}

export default function InventoryClient() {
  const { user, isLoading, setIsLoading } = useApp();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch(getApiUrl("/api/user/history?inInventory=true"), {
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setItems(
          data.map((item: any) => ({
            ...item,
            quantity: item.quantity || 1,
            purchasePrice: item.purchasePrice || 0,
          })),
        );
      }
    } catch (err) {
      console.error("Failed to fetch inventory", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      //change back to business, set to pro for testing
    } else if (user.subscriptionStatus !== "pro") {
      router.push("/account");
    } else {
      fetchInventory();
    }
  }, [user, isLoading, router]);

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      // It is more efficient to have a bulk endpoint,
      // but sticking to your current logic:
      await Promise.all(
        items.map((item) =>
          fetch(getApiUrl(`/api/user/history/${item.id}`), {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ inInventory: false }),
          }),
        ),
      );
      setItems([]);
      setIsClearModalOpen(false);
    } catch (err) {
      console.error("Clear error:", err);
    } finally {
      setIsClearing(false);
    }
  };

  const stats = useMemo(() => {
    const totals = items.reduce(
      (acc, item) => {
        const match = item.priceRange.match(/\$(\d+(?:\.\d+)?)/);
        const unitValue = match ? parseFloat(match[1]) : 0;
        const qty = item.quantity || 1;

        acc.revenue += unitValue * qty;
        acc.cost += (item.purchasePrice || 0) * qty;
        return acc;
      },
      { revenue: 0, cost: 0 },
    );

    return {
      revenue: totals.revenue,
      cost: totals.cost,
      profit: totals.revenue - totals.cost,
    };
  }, [items]);

  const updateItemMetadata = async (
    id: string,
    updates: Partial<InventoryItem>,
  ) => {
    // Optimistic Update
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );

    await fetch(getApiUrl(`/api/user/history/${id}`), {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
  };

  const removeItem = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/user/history/${id}`), {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ inInventory: false }),
      });

      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error("Removal error:", err);
    }
  };

  const downloadCSV = () => {
    const headers = [
      "Inventory ID",
      "Name",
      "Brand",
      "Model",
      "Grade", // Now separate
      "Condition", // Now separate
      "Category",
      "Platform",
      "Qty",
      "Unit Cost",
      "Est Sale Price",
      "Total Cost Basis",
      "Total Est Revenue",
      "Total Est Profit",
      "ROI %",
    ];

    const rows = items.map((item) => {
      // Extract numerical value from priceRange (e.g., "$120.00" -> 120)
      const match = item.priceRange.match(/\$(\d+(?:\.\d+)?)/);
      const unitValue = match ? parseFloat(match[1]) : 0;
      const qty = item.quantity || 1;
      const unitCost = item.purchasePrice || 0;

      // Financial Calculations
      const totalCost = unitCost * qty;
      const totalRevenue = unitValue * qty;
      const totalProfit = totalRevenue - totalCost;
      const roi = unitCost > 0 ? ((unitValue - unitCost) / unitCost) * 100 : 0;

      return [
        `"${item.id}"`,
        `"${item.itemTitle.replace(/"/g, '""')}"`,
        `"${item.specs.Brand || "N/A"}"`,
        `"${item.specs.Model || "N/A"}"`,
        `"${item.grade || "N/A"}"`,
        `"${item.specs.Condition || "N/A"}"`,
        `"${item.specs["Material/Type"] || "N/A"}"`,
        `"${item.platform || "N/A"}"`,
        qty,
        unitCost.toFixed(2),
        unitValue.toFixed(2),
        totalCost.toFixed(2),
        totalRevenue.toFixed(2),
        totalProfit.toFixed(2),
        `${roi.toFixed(1)}%`,
      ];
    });

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory_report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="no-overlow-x">
        <header className="help-page__header">
          <button
            onClick={handleBack}
            className="back-btn"
            data-ph-capture-attribute-button-name="inventory-back-btn"
            data-ph-capture-attribute-feature="back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1>Inventory Manager</h1>
          <div className="header-spacer" />
        </header>

        <main className="inventory">
          <div className="inventory__header">
            <div className="inventory__stats-grid">
              <div className="inventory__stat-card">
                <span className="inventory__stat-label">
                  Total Potential Profit
                </span>
                <h2
                  className={`inventory__stat-value ${stats.profit > 0 ? "profit-text-pos" : stats.profit < 0 ? "profit-text-neg" : "profit-text-neutral"}`}
                >
                  ${stats.profit.toFixed(2)}
                </h2>
                {/* {stats.profit > 0 ? <TrendingUp size={20} className="profit-icon-pos" /> : <TrendingDown size={20} className="profit-icon-neg" />} */}
              </div>

              <div className="inventory__stat-card secondary">
                <span className="inventory__stat-label">Inventory Value</span>
                <h2 className="inventory__stat-value small">
                  ${stats.revenue.toFixed(2)}
                </h2>
              </div>

              <div className="inventory__stat-card secondary">
                <span className="inventory__stat-label">Total Cost Basis</span>
                <h2 className="inventory__stat-value small">
                  ${stats.cost.toFixed(2)}
                </h2>
              </div>
            </div>

            <div className="inventory__actions-bar">
              <div>
                <p className="inventory__count-hint">Inventory count</p>
                <p>
                  <b>
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </b>
                </p>
              </div>

              <div className="inventory__actions-group">
                <button
                  onClick={() => setIsClearModalOpen(true)}
                  className="inventory__clear-btn"
                  disabled={items.length === 0}
                  data-ph-capture-attribute-button-name="inventory-clear-items-btn"
                  data-ph-capture-attribute-feature="inventory"
                >
                  <Eraser size={16} /> Clear All
                </button>
                <button
                  onClick={downloadCSV}
                  className="inventory__download-btn"
                  disabled={items.length === 0}
                  data-ph-capture-attribute-button-name="inventory-download-csv-btn"
                  data-ph-capture-attribute-feature="inventory"
                >
                  <Download size={16} /> Export CSV
                </button>
              </div>
            </div>
          </div>

          <div className="inventory__grid">
            {items.map((item) => (
              <div key={item.id} className="inventory-card">
                <div className="inventory-card__body">
                  <div className="inventory-card__main">
                    <h4 className="inventory-card__title">{item.itemTitle}</h4>
                    <div className="inventory-card__badges">
                      <span className="inventory-card__badge inventory-card__badge--price">
                        {item.priceRange}
                      </span>
                    </div>

                    <div className="inventory-card__controls">
                      <div className="control-group">
                        <label>Quantity</label>
                        <div className="inventory-card__quantity">
                          <button
                            className="inventory-card__qty-btn"
                            onClick={() =>
                              updateItemMetadata(item.id, {
                                quantity: Math.max(1, (item.quantity || 1) - 1),
                              })
                            }
                            data-ph-capture-attribute-button-name="inventory-quantity-minus-btn"
                            data-ph-capture-attribute-feature="inventory"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="inventory-card__qty-value">
                            {item.quantity}
                          </span>
                          <button
                            className="inventory-card__qty-btn"
                            onClick={() =>
                              updateItemMetadata(item.id, {
                                quantity: (item.quantity || 1) + 1,
                              })
                            }
                            data-ph-capture-attribute-button-name="inventory-quantity-add-btn"
                            data-ph-capture-attribute-feature="inventory"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="control-group">
                        <label>Unit Cost</label>
                        <div className="inventory-card__cost">
                          <DollarSign size={18} />
                          <input
                            type="number"
                            className="inventory-card__cost-input"
                            value={item.purchasePrice || ""}
                            onChange={(e) =>
                              updateItemMetadata(item.id, {
                                purchasePrice: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="inventory-card__remove"
                    data-ph-capture-attribute-button-name="inventory-remove-item-btn"
                    data-ph-capture-attribute-feature="inventory"
                  >
                    <Trash2 size={21} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        <InfoModal
          isOpen={isClearModalOpen}
          onClose={() => setIsClearModalOpen(false)}
          title="Clear Inventory"
        >
          <div className="modal-content">
            <div className="delete-modal__warning">
              <p>
                Are you sure you want to remove <b>all items</b> from your
                inventory? This action cannot be undone.
              </p>
            </div>

            {/* <div
            className="modal-actions"
            style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}
          >
            <button
              className="secondary-btn"
              onClick={() => setIsClearModalOpen(false)}
              style={{ flex: 1 }}
            >
              Cancel
            </button> */}

            <div className="delete-modal__actions">
              <button
                className="modal-btn modal-btn--secondary"
                onClick={() => setIsClearModalOpen(false)}
                disabled={isClearing}
                data-ph-capture-attribute-button-name="inventory-clear-modal-btn-cancel"
                data-ph-capture-attribute-feature="inventory"
              >
                Cancel
              </button>
              <button
                className="modal-btn modal-btn--primary"
                onClick={handleClearAll}
                disabled={isClearing}
                data-ph-capture-attribute-button-name="inventory-clear-modal-btn-confirm"
                data-ph-capture-attribute-feature="inventory"
              >
                {isClearing ? "Clearing..." : "Yes, Clear All"}
              </button>
            </div>
            {/* </div> */}
          </div>
        </InfoModal>
      </div>
    </>
  );
}
