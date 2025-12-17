"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right" // Sağ üstte çıksın
      reverseOrder={false}
      toastOptions={{
        // Genel Ayarlar
        duration: 2000,
        className: "text-sm font-medium shadow-xl",

        // ✅ BAŞARILI (YEŞİL POPUP)
        success: {
          style: {
            background: "#10B981", // Tailwind Green-500
            color: "#fff", // Beyaz yazı
            padding: "16px",
            borderRadius: "12px",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10B981",
          },
        },

        // ❌ HATA (KIRMIZI POPUP)
        error: {
          style: {
            background: "#EF4444", // Tailwind Red-500
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#EF4444",
          },
        },
      }}
    />
  );
}
