"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function InfoModal({ isOpen, onClose, title, children }: InfoModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
      >
        <header className="modal-container__header">
          <h2 className="modal-container__title">{title}</h2>
          <button className="modal-container__close" onClick={onClose}>
            <X size={24} />
          </button>
        </header>
        <div className="modal-container__content">
          {children}
        </div>
      </div>
    </div>
  );
}