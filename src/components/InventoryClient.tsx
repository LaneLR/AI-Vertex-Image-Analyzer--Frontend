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
} from "lucide-react";
import { getApiUrl } from "@/lib/api-config";

interface InventoryItem {
  id: string;
  itemTitle: string;
  priceRange: string;
  description: string;
  grade: string;
  platform: string;
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
  const [items, setItems] = useState(initialItems);

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => {
      const match = item.priceRange.match(/\$(\d+(?:\.\d+)?)/);
      return sum + (match ? parseFloat(match[1]) : 0);
    }, 0);
  }, [items]);

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
      "ID",
      "Name",
      "Brand",
      "Model",
      "Grade",
      "Low Estimate",
      "High Estimate",
      "Platform",
    ];
    const rows = items.map((item) => [
      item.id,
      item.itemTitle,
      item.specs.Brand || "N/A",
      item.specs.Model || "N/A",
      item.grade || "N/A",
      item.priceRange.split("-")[0].trim(),
      item.priceRange.split("-")[1]?.trim() || "N/A",
      item.platform,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `inventory_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.click();
  };

  return (
    <>

      
    <main className="inventory">
      <div className="inventory__header">
        <div className="inventory__stats">
          <div className="inventory__stat-card">
            <TrendingUp className="inventory__stat-icon" />
            <div className="inventory__stat-info">
              <span className="inventory__stat-label">Potential Value</span>
              <h2 className="inventory__stat-value">
                ${totalValue.toFixed(2)}
              </h2>
            </div>
            <div />
          </div>
          <button onClick={downloadCSV} className="inventory__download-btn">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="inventory__grid">
        {items.length === 0 ? (
          <div className="inventory__empty">
            <Package size={48} />
            <p>Your inventory is empty. Add items from your scan history.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="inventory-card">
              <div className="inventory-card__body">
                <div className="inventory-card__main">
                  <h4 className="inventory-card__title">{item.itemTitle}</h4>
                  <p className="inventory-card__brand">
                    {item.specs.Brand} {item.specs.Model}
                  </p>
                  <div className="inventory-card__badges">
                    <span className="inventory-card__badge inventory-card__badge--price">
                      {item.priceRange}
                    </span>
                    <span className="inventory-card__badge">
                      Grade: {item.grade}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="history-card__delete-btn"
                  title="Remove from Inventory"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
    </>
  );
}
