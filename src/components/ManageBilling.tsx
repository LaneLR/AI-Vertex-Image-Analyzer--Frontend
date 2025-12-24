"use client";

import { useState } from "react";

export default function ManageBilling() {
  const [loading, setLoading] = useState(false);

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        alert(data.error || "Could not open billing portal.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings__billing-section">
      <button 
        className="settings__btn settings__btn--secondary" 
        onClick={handleManageBilling}
        disabled={loading}
      >
        {loading ? "Loading..." : "Manage Subscription & Billing"}
      </button>
    </div>
  );
}