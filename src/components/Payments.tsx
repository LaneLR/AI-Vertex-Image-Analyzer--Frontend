"use client";

import React, { useEffect, useState } from "react";
import SubscribeButton from "@/components/SubscribeButton";
import { Check, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Capacitor } from "@capacitor/core";
import { useRouter } from "next/router";

export default function PaymentsClient({ user: initialUser }: { user: any }) {
  const { data: session } = useSession();
  const user = session?.user || initialUser;
  const [platform, setPlatform] = useState<string>("web");
  const router = useRouter();

  const isIOS = platform === "ios";
  const isAndroid = platform === "android";
  const isNative = platform !== "web";

  const isPro = user?.subscriptionStatus === "pro";
  const isHobby = user?.subscriptionStatus === "hobby";
  const isBasic = !isPro && !isHobby;

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
    basic: ["5 Scans per day", "Basic price estimates", "Manual profit entry"],
    hobby: [
      "100 Scans per day",
      "Access to Listing Generator",
      "Profit calculator",
      "Multi-platform comparison",
    ],
    pro: [
      "250 Scans per day",
      "Access to Listing Generator",
      "Profit calculator",
      "Multi-platform comparison",
    ],
  };

  return (
    <>
      <header className="help-page__header">
        <Link href="/" className="back-btn">
          <ArrowLeft size={20} />
        </Link>
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
            {/* PRO CARD */}
            <div className="planCard planCardPro">
              <h3 className="planCard__name">Pro</h3>
              <div className="planCard__price">
                19.99<span>/ mo</span>
              </div>
              <ul className="planCard__list">
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

            {/* HOBBY CARD */}
            <div className="planCard planCardPro">
              <h3 className="planCard__name">Hobbyist</h3>
              <div className="pricing-card__price">
                9.99<span>/ mo</span>
              </div>
              <ul className="planCard__list">
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
            <div className="planCard">
              <h3 className="planCard__name">Basic</h3>
              <div className="planCard__price">
                0<span>/ mo</span>
              </div>
              <ul className="planCard__list">
                {features.basic.map((f, i) => (
                  <li key={i}>
                    <Check size={18} /> {f}
                  </li>
                ))}
              </ul>
              <button className="generate-btn" disabled={isBasic}>
                {isBasic ? "Current Plan" : "Downgrade"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
