"use client";

import { useState } from "react";
import InfoModal from "@/components/InfoModal";

export default function ManageBilling() {
  const [loading, setLoading] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        setErrorMessage(
          data.error ||
            "We encountered an issue opening the billing portal. Please try again later."
        );
        setIsErrorOpen(true);
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
      <InfoModal 
        isOpen={isErrorOpen} 
        onClose={() => setIsErrorOpen(false)} 
        title="Billing Notice"
      >
        <p>{errorMessage}</p>
      </InfoModal>
    </div>
  );
}
