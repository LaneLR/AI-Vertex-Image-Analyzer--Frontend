"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Loading from "./Loading";
import { getApiUrl } from "@/lib/api-config";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscribeButtonProps {
  priceId: string;
  isPro?: boolean;
  isHobby?: boolean;
}

export default function SubscribeButton({ priceId, isPro = false, isHobby = false }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async () => {
    if (isPro || isHobby) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl("/api/stripe/checkout"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) throw new Error(data.error || "Failed to start checkout.");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Determine button text based on props
  const getButtonText = () => {
    if (isPro) return "Current Plan: Pro";
    if (isHobby) return "Current Plan: Hobby";
    
    // Check which ID this button represents to show correct upgrade text
    return priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID 
      ? "Upgrade to Pro" 
      : "Upgrade to Hobbyist";
  };

  return (
    <div className="subscribe-container">
      {loading ? (
        <Loading message="Connecting..." />
      ) : (
        <>
          <button
            className="generate-btn"
            onClick={handleSubscribe}
            disabled={isPro || isHobby || loading}
          >
            {getButtonText()}
          </button>
          {error && <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "5px" }}>{error}</p>}
        </>
      )}
    </div>
  );
}