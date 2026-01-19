"use client";

import React, { useEffect, useState } from "react";
import SubscribeButton from "@/components/SubscribeButton";
import { Check, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Capacitor } from "@capacitor/core";
import { useRouter } from "next/navigation";

export default function PaymentsClient({ user: initialUser }: { user: any }) {
  const { data: session } = useSession();
  const user = session?.user || initialUser;
  const [platform, setPlatform] = useState<string>("web");
  const router = useRouter();

  const isIOS = platform === "ios";
  const isAndroid = platform === "android";
  const isNative = platform !== "web";

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const isPro = user?.subscriptionStatus === "pro";
  const isHobby = user?.subscriptionStatus === "hobby";
  const isBusiness = user?.subscriptionStatus === "business";
  const isBasic = !isPro && !isHobby && !isBusiness;

  useEffect(() => {
    // This returns 'ios', 'android', or 'web'
    const currentPlatform = Capacitor.getPlatform();
    setPlatform(currentPlatform);

    //finish this setup for not letting apple pay users checkout to stripe
    // if (
    //   (isNative && user?.paymentProvider === "stripe") ||
    //   (isNative &&
    //     (user?.paymentProvider === "" || user?.paymentProvider === null))
    // ) {
    //   router.push("/");
    // }
  }, []);

  const features = {
    basic: ["5 Scans per day", "1 Image per scan", "Basic price estimates"],
    hobby: [
      "50 scans per day",
      "Profit calculator",
      "2 Images per scan",
      "Improved accuracy price estimates",
      "Access to SEO Generator to create SEO-optimized listing details",
    ],
    pro: [
      "100 scans per day",
      "Profit calculator",
      "3 Images per scan",
      "High accuracy price estimates",
      "Access to SEO Generator to create SEO-optimized listing details",
      "Access to Photo Studio to automatically remove backgrounds for listing photos",
      "Multi-platform and marketplace price comparison",
      "Item sell-through rates and demand indicators",
    ],
    business: [
      "250 scans per day",
      "Profit calculator",
      "3 Images per scan",
      "High accuracy price estimates",
      "Access to SEO Generator to create SEO-optimized listing details",
      "Access to Photo Studio to automatically remove backgrounds for listing photos",
      "Multi-platform and marketplace price comparison",
      "Item sell-through rates and demand indicators",
      "CSV download of listings for bulk uploading",
    ],
  };

  return (
    <>
      <header className="help-page__header">
        <button onClick={handleBack} className="back-btn">
          <ArrowLeft size={20} />
        </button>
        <h1>Payment Center</h1>
        <div className="header-spacer" />
      </header>

      <main className="pricing-section">
        <header className="pricing-section__header">
          <h1 className="pricing-section__title">Upgrade Your Sourcing</h1>
          <p className="pricing-section__subtitle">
            Choose the plan that fits you.
          </p>
        </header>

        <div className="pricing-section__grid">
          <div className="web__pricingWrapper">
            {/* BUSINESS CARD */}
            <div className="paymentCard planCardPro">
              <h3 className="paymentCard__name">Business</h3>
              <div className="paymentCard__price">
                34.99<span>/ mo</span>
              </div>
              <ul className="paymentCard__list">
                {features.business.map((f, i) => (
                  <li key={i}>
                    <Check size={18} /> {f}
                  </li>
                ))}
              </ul>
              <SubscribeButton
                priceId={process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID!}
                isBusiness={isBusiness}
              />
            </div>

            {/* PRO CARD */}
            <div className="paymentCard planCardPro">
              <h3 className="paymentCard__name">Pro</h3>
              <div className="paymentCard__price">
                19.99<span>/ mo</span>
              </div>
              <ul className="paymentCard__list">
                {features.pro.map((f, i) => (
                  <li key={i}>
                    <Check size={18} /> {f}
                  </li>
                ))}
              </ul>
              <SubscribeButton
                priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!}
                isPro={isPro}
              />
            </div>

            {/* HOBBYIST CARD */}
            <div className="paymentCard planCardPro">
              <h3 className="paymentCard__name">Hobbyist</h3>
              <div className="paymentCard__price">
                9.99<span>/ mo</span>
              </div>
              <ul className="paymentCard__list">
                {features.hobby.map((f, i) => (
                  <li key={i}>
                    <Check size={18} /> {f}
                  </li>
                ))}
              </ul>
              <SubscribeButton
                priceId={process.env.NEXT_PUBLIC_STRIPE_HOBBY_PRICE_ID!}
                isHobby={isHobby}
              />
            </div>

            {/* BASIC CARD */}
            <div className="paymentCard">
              <h3 className="paymentCard__name">Basic</h3>
              <div className="paymentCard__price">
                0<span>/ mo</span>
              </div>
              <ul className="paymentCard__list">
                {features.basic.map((f, i) => (
                  <li key={i}>
                    <Check size={18} /> {f}
                  </li>
                ))}
              </ul>
              <button className="generate-btn" disabled={isBasic}>
                {isBasic ? "Current Plan" : "Free"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
