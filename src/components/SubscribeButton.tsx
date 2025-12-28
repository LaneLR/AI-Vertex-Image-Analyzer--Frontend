// eslint-disable-next-line @typescript-eslint/no-explicit-any
"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import Loading from "./Loading"; // Using the component we created

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscribeButtonProps {
  priceId: string;
  isPro?: boolean;
}

export default function SubscribeButton({ priceId, isPro = false }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (isPro) return; 
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start checkout.");
      }

      if (data.url) {
        window.location.href = data.url;
      } else if (data.sessionId) {
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: data.sessionId });
      }
      
    } catch (err: any) {
      setError(err.message);
      console.error("Subscription error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="subscribe-container">
      {loading ? (
        <Loading message="Connecting to Stripe..." />
      ) : (
        <>
          <button
            className={`account__upgrade-btn`}
            onClick={handleSubscribe}
            disabled={isPro || loading}
          >
            {isPro ? "Current Plan: Pro" : "Upgrade to Pro"}
          </button>
          
          {error && (
            <p className="error-text" style={{ color: "#ef4444", marginTop: "1rem", fontSize: "0.875rem" }}>
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}