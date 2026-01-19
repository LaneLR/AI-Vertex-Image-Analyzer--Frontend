"use client";

import React, { useState, useMemo } from "react";
import {
  Package,
  Trash2,
  Download,
  TrendingUp,
  Tag,
  ExternalLink,
  Link,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Plus,
  Minus,
} from "lucide-react";
import { getApiUrl } from "@/lib/api-config";

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

export default function InventoryClient({
  initialItems,
}: {
  initialItems: InventoryItem[];
}) {
  const [items, setItems] = useState(
    initialItems.map((item) => ({
      ...item,
      quantity: item?.quantity || 1,
      purchasePrice: item?.purchasePrice || 0,
    })),
  );

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => {
      const match = item.priceRange.match(/\$(\d+(?:\.\d+)?)/);
      const val = match ? parseFloat(match[1]) : 0;
      return sum + val * (item.quantity || 1);
    }, 0);
  }, [items]);

  const updateItemMetadata = async (
    id: string,
    updates: Partial<InventoryItem>,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );

    await fetch(getApiUrl(`/api/user/history/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  };

  const removeItem = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/user/history/${id}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inInventory: false }), // This triggers the 'Removed from inventory' logic
      });

      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        const errorData = await res.json();
        console.error("Failed to remove item:", errorData.error);
      }
    } catch (err) {
      console.error("Connection error during removal:", err);
    }
  };

  const downloadCSV = () => {
    const headers = [
      "Name",
      "Brand",
      "Model",
      "Qty",
      "Cost Basis",
      "Est Value",
      "Total Est Value",
    ];
    const rows = items.map((item) => {
      const match = item.priceRange.match(/\$(\d+(?:\.\d+)?)/);
      const unitValue = match ? parseFloat(match[1]) : 0;
      return [
        `"${item.itemTitle}"`,
        item.specs.Brand || "N/A",
        item.specs.Model || "N/A",
        item.quantity,
        item.purchasePrice,
        unitValue,
        (unitValue * (item.quantity || 1)).toFixed(2),
      ];
    });

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory_report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <>
      <header className="help-page__header">
        <Link href="/" className="back-btn">
          <ArrowLeft size={20} />
        </Link>
        <h1>Inventory Manager</h1>
        <div className="header-spacer" />
      </header>

      <main className="inventory">
        <div className="inventory__header">
          <div className="inventory__stats">
            <div className="inventory__stat-card">
              <TrendingUp size={40} className="inventory__stat-icon" />
              <div className="inventory__stat-info">
                <span className="inventory__stat-label">Stock Potential</span>
                <h2 className="inventory__stat-value">
                  ${totalValue.toFixed(2)}
                </h2>
              </div>
            </div>
            <button onClick={downloadCSV} className="inventory__download-btn">
              <Download size={18} /> Export CSV
            </button>
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
                    {/* Quantity Toggler */}
                    <div className="inventory-card__quantity">
                      <button
                        className="inventory-card__qty-btn"
                        onClick={() =>
                          updateItemMetadata(item.id, {
                            quantity: Math.max(1, (item.quantity || 1) - 1),
                          })
                        }
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
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Cost Input */}
                    <div className="inventory-card__cost">
                      <DollarSign size={14} />
                      <input
                        type="number"
                        placeholder="Cost"
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
                <button
                  onClick={() => {
                    /* Existing Remove Logic */
                  }}
                  className="history-card__delete-btn"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
