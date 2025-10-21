// src/app/urun/[id]/_components/AddToCartButton.tsx (YENİ TASARIM)

'use client';

import { useCart } from '@/context/cart';
import { Product } from '@/types';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = () => {
    setLoading(true);
    addToCart(product);
    setTimeout(() => setLoading(false), 1000); // Toast bildirimi ile senkronize edilebilir
  };

  const isOutOfStock = product.stock === 0;

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || isOutOfStock}
      className="w-full h-16 rounded-2xl font-bold text-white text-lg transition-all duration-300
                 bg-gradient-to-r from-purple-600 to-pink-500
                 hover:from-purple-700 hover:to-pink-600
                 hover:shadow-xl hover:-translate-y-1
                 active:scale-95
                 flex items-center justify-center gap-3
                 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
      {loading ? (
        <Loader2 size={24} className="animate-spin" />
      ) : (
        <ShoppingCart size={24} />
      )}
      <span>
        {isOutOfStock ? 'Stokta Yok' : loading ? 'Ekleniyor...' : 'Sepete Ekle'}
      </span>
    </button>
  );
}
