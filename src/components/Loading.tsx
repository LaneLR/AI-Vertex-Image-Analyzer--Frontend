"use client";

import React from "react";

interface LoadingProps {
  message?: string;
  fullPage?: boolean;
}

export default function Loading({
  message = "Loading...",
  fullPage = true,
}: LoadingProps) {
  return (
    <div
      className={`loading-container ${fullPage ? "loading-container--full" : ""}`}
    >
      <div className="loading-spinner">
        <div className="loading-spinner__circle"></div>
        <div className="loading-spinner__inner-circle"></div>
      </div>
      {message && <p className="loading-text">{message}</p>}
    </div>
  );
}
