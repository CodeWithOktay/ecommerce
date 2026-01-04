"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  noPadding?: boolean;
}

/**
 * Yeniden Kullanılabilir Modal Bileşeni
 * 
 * @param isOpen - Modalın açık olup olmadığını belirler
 * @param onClose - Modal kapatılmak istendiğinde çalışacak fonksiyon
 * @param title - Modal başlığı
 * @param children - Modal içeriği
 * @param size - Modal genişliği (sm, md, lg, xl, 2xl, full)
 * @param noPadding - İçerik padding'ini kaldırmak için (Örn: Tam sayfa formlar)
 */
export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "lg",
  noPadding = false 
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to allow render before animation starts
      requestAnimationFrame(() => setIsAnimating(true));
      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "unset";
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
    full: "max-w-[95vw] h-[95vh]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className={`relative w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-300 max-h-[90vh] flex flex-col ${
          sizeClasses[size]
        } ${
          isAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className={`overflow-y-auto custom-scrollbar ${noPadding ? "" : "p-6"}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
