"use client";

import { Share2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ShareButton() {
  const handleShare = async () => {
    const shareData = {
      title: document.title,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // Toast kullanımı daha şık durur reis
        toast.success("Ürün linki kopyalandı!", {
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (err) {
      // Kullanıcı iptal ettiğinde hata fırlatmasın
      console.log("Paylaşım kapandı");
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleShare}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 shadow-sm transition-all duration-300 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 active:scale-90"
        title="Paylaş"
      >
        <Share2
          size={20}
          className="transition-transform group-hover:rotate-12"
        />
      </button>

      {/* Tooltip - Sadece masaüstünde görünür */}
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
        Paylaş
      </span>
    </div>
  );
}
