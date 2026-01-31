"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  // Added footer prop for buttons
  footer?: React.ReactNode;
}

export default function InfoModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: InfoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-overlay__backdrop" />

      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-container__handle" />

        <header className="modal-container__header">
          <h2 className="modal-container__title">{title}</h2>
          <button className="modal-container__close" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <div className="modal-container__content">{children}</div>

        {/* Action Buttons Area */}
        {footer && (
          <footer className="modal-container__footer">{footer}</footer>
        )}
      </div>
    </div>
  );
}
