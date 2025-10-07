"use client";
import { Product } from "../types";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 hover:border-transparent relative overflow-hidden">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-xl mb-3">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <h3 className="font-semibold text-gray-800 truncate mb-2">
        {product.name}
      </h3>

      {/* Price */}
      <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#667EEA] to-[#764BA2]">
        {product.price.toLocaleString("tr-TR", {
          style: "currency",
          currency: "TRY",
          minimumFractionDigits: 2,
        })}
      </p>

      {/* Add to Cart Button */}
      <button
        onClick={() => addToCart(product)}
        className="mt-3 w-full bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold flex items-center justify-center gap-2"
      >
        🛒 Sepete Ekle
      </button>
    </div>
  );
}
