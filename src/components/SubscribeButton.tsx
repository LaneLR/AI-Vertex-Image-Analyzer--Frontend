"use client";

import { useState } from "react";
import Loading from "./Loading";
import { getApiUrl } from "@/lib/api-config";
import { useRouter } from "next/navigation";

interface SubscribeButtonProps {
  priceId: string;
  isCurrentPlan?: boolean; // Simplified prop
}

export default function SubscribeButton({ 
  priceId, 
  isCurrentPlan = false 
}: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async () => {
    // Prevent checkout if they are already on this plan
    if (isCurrentPlan) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      // 2. Call your Express backend with the Authorization header
      const response = await fetch(getApiUrl("/api/stripe/checkout"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Critical for Express middleware
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      // Handle expired or invalid tokens
      if (response.status === 401) {
        localStorage.removeItem("token"); // Clean up local storage
        router.push("/login");
        return;
      }

      if (!response.ok) throw new Error(data.error || "Failed to start checkout.");

      // 3. Redirect to Stripe Hosted Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (isCurrentPlan) return "Current Plan";
    
    const PRO_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
    const BUSINESS_ID = process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID;
    const HOBBY_ID = process.env.NEXT_PUBLIC_STRIPE_HOBBY_PRICE_ID;

    if (priceId === PRO_ID) return "Switch to Pro";
    if (priceId === BUSINESS_ID) return "Switch to Business";
    if (priceId === HOBBY_ID) return "Switch to Hobbyist";
    return "";
  };

  return (
    <div className="subscribe-container">
      {loading ? (
        <Loading message="Preparing checkout..." />
      ) : (
        <>
          <button
            className="generate-btn"
            onClick={handleSubscribe}
            disabled={isCurrentPlan || loading}
          >
            {getButtonText()}
          </button>
          {error && (
            <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "5px", textAlign: "center" }}>
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}