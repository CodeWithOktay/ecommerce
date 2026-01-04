"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toggleFavorite } from "@/lib/actions/favorite";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FavoriteButtonProps {
  productId: string;
  initialIsFavorite?: boolean;
}

/**
 * Favori Butonu
 * 
 * - Ürünü favorilere ekler/çıkarır (toggle).
 * - Giriş yapılmamışsa login sayfasına yönlendirir.
 * - Optimistic update (iyimser güncelleme) yerine sonuç dönene kadar loading gösterir (Tercih meselesi).
 */
export default function FavoriteButton({
  productId,
  initialIsFavorite = false,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const previousState = isFavorite;
    setIsFavorite(!isFavorite);
    setLoading(true);

    const result = await toggleFavorite(productId);

    if (!result.success) {
      setIsFavorite(previousState);

      if (result.message === "Giriş yapmalısınız.") {
        toast.error("Favorilere eklemek için giriş yapmalısınız.");
        router.push("/login");
      } else {
        toast.error(result.message);
      }
    } else {
    if (result.isFavorited) {
        toast.custom((t) => (
           <div className={`${
             t.visible ? 'animate-enter' : 'animate-leave'
           } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}>
             <div className="p-4">
               <div className="flex items-center">
                 <div className="flex-shrink-0">
                    <Heart className="h-6 w-6 text-red-500" fill="currentColor" />
                 </div>
                 <div className="ml-3 w-0 flex-1 pt-0.5">
                   <p className="text-sm font-medium text-gray-900">
                     Favorilere Eklendi
                   </p>
                   <p className="mt-1 text-xs text-gray-500">
                     Ürün favori listenize kaydedildi.
                   </p>
                 </div>
               </div>
             </div>
             <div className="flex border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => router.push("/account/favorites")}
                  className="w-full border border-transparent rounded-none p-3 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                >
                  Listeyi Gör
                </button>
             </div>
           </div>
        ));
      } else {
        toast.custom((t) => (
           <div className={`${
             t.visible ? 'animate-enter' : 'animate-leave'
           } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 p-4 flex items-center`}>
              <Heart className="h-5 w-5 text-gray-400 mr-3" />
              <p className="text-sm font-medium text-gray-700">Favorilerden çıkarıldı</p>
           </div>
        ));
      }
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        p-2 rounded-full shadow-sm transition-all duration-300 hover:scale-110 active:scale-90
        ${
          isFavorite
            ? "bg-white text-red-500 hover:bg-red-50"
            : "bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50"
        }
      `}
      title={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      <Heart
        size={30}
        className={`transition-all duration-300 ${isFavorite ? "fill-current" : ""}`}
      />
    </button>
  );
}
