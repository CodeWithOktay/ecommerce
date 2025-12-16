"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toggleFavorite } from "@/lib/actions/favorite-actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FavoriteButtonProps {
  productId: string;
  initialIsFavorite?: boolean;
}

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
        toast.success("Favorilere eklendi ❤️");
      } else {
        toast.success("Favorilerden çıkarıldı");
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
        size={20}
        className={`transition-all duration-300 ${isFavorite ? "fill-current" : ""}`}
      />
    </button>
  );
}
