"use client";

import { useState } from "react";
import InfoModal from "@/components/InfoModal";
import { getApiUrl } from "@/lib/api-config";

export default function ManageBilling() {
  const [loading, setLoading] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl("/api/stripe/portal"), {
        method: "POST",
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        setErrorMessage(
          data.error ||
            "We encountered an issue opening the billing portal. Please try again later.",
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
        data-ph-capture-attribute-button-name="billing-manage-billing-btn"
        data-ph-capture-attribute-feature="manage-billing"
      >
        {loading ? "Loading..." : "Manage Subscription & Billing"}
      </button>
      <InfoModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Billing Notice"
      >
        <p>An error has occurred. Please try again later.</p>
        <br />
        <div className="delete-modal__actions">
          <button
            className="modal-btn modal-btn--secondary"
            onClick={() => setIsErrorOpen(false)}
            data-ph-capture-attribute-button-name="account-modal-btn-close"
            data-ph-capture-attribute-feature="account"
          >
            Close
          </button>
        </div>
      </InfoModal>
    </div>
  );
}
