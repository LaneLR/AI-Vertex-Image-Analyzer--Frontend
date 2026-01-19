"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Calculator, History, Trash2, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ScanHistoryItem {
  id: string;
  title: string;
  lowResellValue: number;
  highResellValue: number;
  estimatedShipping: number;
  imageUrl?: string;
}

const PLATFORMS = [
  { name: "Custom", fee: 0 },
  { name: "eBay", fee: 13.25 },
  { name: "Poshmark", fee: 20 },
  { name: "Mercari", fee: 10 },
  { name: "Facebook Marketplace", fee: 5 },
  { name: "Depop", fee: 10 },
];

export default function CalculatorClient({
  history,
}: {
  history: ScanHistoryItem[];
}) {
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(
    null,
  );
  const [buyCost, setBuyCost] = useState<number | "">("");
  const [sellPrice, setSellPrice] = useState<number | "">("");
  const [shippingCost, setShippingCost] = useState<number | "">("");
  const [platformFeePercent, setPlatformFeePercent] = useState<string | number>(
    13.25,
  );
  const [otherCosts, setOtherCosts] = useState<number | "">("");

  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // Handle selecting an item from history
  const handleSelectItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const item = history.find((h) => h.id === e.target.value);
    if (item) {
      setSelectedItem(item);
      setSellPrice(item.lowResellValue);
      setShippingCost(item.estimatedShipping);
    } else {
      setSelectedItem(null);
    }
  };

  // Calculations
  const numericSell = Number(sellPrice) || 0;
  const numericBuy = Number(buyCost) || 0;
  const numericShipping = Number(shippingCost) || 0;
  const numericOther = Number(otherCosts) || 0;
  const numericFee = parseFloat(platformFeePercent.toString()) || 0;
  const totalFees = (numericSell * numericFee) / 100;
  const netProfit =
    numericSell - numericBuy - numericShipping - totalFees - numericOther;
  const margin = numericSell > 0 ? (netProfit / numericSell) * 100 : 0;

  return (
    <>
      <header className="help-page__header">
        <button onClick={handleBack} className="back-btn">
          <ArrowLeft size={20} />
        </button>
        <h1>Profit Calculator</h1>
        <div className="header-spacer" />
      </header>
      <main className="profit-calc">
        <div className="profit-calc__content">
          {/* SECTION: History Integration */}
          <section className="calc-card">
            <div className="calc-card__group">
              <label className="label-with-icon">
                <History size={18} /> Select from Scan History
              </label>
              <select
                className="calc-input"
                onChange={handleSelectItem}
                value={selectedItem?.id || ""}
              >
                <option value="">Manual Entry (No item selected)</option>
                {history.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedItem && (
              <div className="selected-item-preview">
                {selectedItem.imageUrl && (
                  <img src={selectedItem.imageUrl} alt="Item" />
                )}
                <div className="selected-item-preview__info">
                  <h4>{selectedItem.title}</h4>
                  <p>
                    Est. Range: ${selectedItem.lowResellValue} - $
                    {selectedItem.highResellValue}
                  </p>
                </div>
                <button
                  className="btn-clear"
                  onClick={() => setSelectedItem(null)}
                >
                  <Trash2 size={26} />
                </button>
              </div>
            )}
          </section>

          {/* SECTION: Inputs */}
          <div className="calc-grid">
            <section className="calc-card">
              <h3>Deal Specifics</h3>

              <div className="calc-card__group">
                <label>Cost to Buy ($)</label>
                <input
                  type="number"
                  value={buyCost}
                  onChange={(e) => setBuyCost(e.target.valueAsNumber || "")}
                  placeholder="0.00"
                  className="calc-input"
                />
              </div>

              <div className="calc-card__group">
                <label>Potential Sell Price ($)</label>
                <input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.valueAsNumber || "")}
                  placeholder="0.00"
                  className="calc-input"
                />
              </div>

              <div className="calc-card__group">
                <label>Shipping & Materials ($)</label>
                <input
                  type="number"
                  value={shippingCost}
                  onChange={(e) =>
                    setShippingCost(e.target.valueAsNumber || "")
                  }
                  placeholder="0.00"
                  className="calc-input"
                />
              </div>
            </section>

            <section className="calc-card">
              <h3>Fees & Overhead</h3>

              <div className="calc-card__group">
                <label>Platform</label>
                <select
                  className="calc-input"
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setPlatformFeePercent(val === 0 ? "" : val);
                  }}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.name} value={p.fee}>
                      {p.name} ({p.fee}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="calc-card__group">
                <label>Fee Percentage (%)</label>
                <input
                  className="calc-input"
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="0"
                  value={platformFeePercent}
                  onChange={(e) => {
                    let val = e.target.value;

                    if (
                      val.length > 1 &&
                      val.startsWith("0") &&
                      val[1] !== "."
                    ) {
                      val = val.substring(1);
                    }

                    setPlatformFeePercent(val);
                  }}
                  onBlur={() => {
                    if (platformFeePercent === "") setPlatformFeePercent(0);
                  }}
                />
              </div>

              <div className="calc-card__group">
                <label>Other Costs (Gas, Promoted Listings, etc.)</label>
                <input
                  type="number"
                  value={otherCosts}
                  onChange={(e) => setOtherCosts(e.target.valueAsNumber || "")}
                  placeholder="0.00"
                  className="calc-input"
                />
              </div>
            </section>
          </div>

          {/* SECTION: Result Display */}
          <section
            className={`result-display ${netProfit > 0 ? "result-display--pos" : netProfit < 0 ? "result-display--neg" : "result-display--neutral"}`}
          >
            <div className="result-display__main">
              <label>Estimated Net Profit</label>
              <h2>${netProfit.toFixed(2)}</h2>
            </div>
            <div className="result-display__stats">
              <div className="stat">
                <label>Margin</label>
                <span>{margin.toFixed(1)}%</span>
              </div>
              <div className="stat">
                <label>Total Fees</label>
                <span>${totalFees.toFixed(2)}</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
