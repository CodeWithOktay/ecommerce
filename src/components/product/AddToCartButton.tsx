'use client';

import { useCart } from '@/context/cart';
import { Product } from '@/types';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

/**
 * Sepete Ekle Butonu Bileşeni
 *
 * Ürün detay sayfasında kullanılan sepete ekleme butonu.
 * Loading state, stok kontrolü ve animasyonlu feedback içerir.
 */
export default function AddToCartButton({ product }: { product: Product }) {
  // Sepet context'inden sepete ekleme fonksiyonunu al
  const { addToCart } = useCart();
  // Yükleme durumu state'i
  const [loading, setLoading] = useState(false);

  /**
   * Sepete ekleme işlemini yöneten fonksiyon
   * Loading state'i yönetir ve sepete ekleme işlemini gerçekleştirir
   */
  const handleAddToCart = () => {
    setLoading(true);
    addToCart(product);
    // Loading state'ini 1 saniye sonra kapat (toast bildirimi ile senkronize edilebilir)
    setTimeout(() => setLoading(false), 1000);
  };

  // Stok durumu kontrolü
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
      aria-label={isOutOfStock ? 'Ürün stokta yok' : 'Sepete ekle'}
    >
      {/* Loading durumunda spinner, normal durumda sepet ikonu */}
      {loading ? (
        <Loader2 size={24} className="animate-spin" />
      ) : (
        <ShoppingCart size={24} />
      )}
      {/* Duruma göre değişen buton metni */}
      <span>
        {isOutOfStock ? 'Stokta Yok' : loading ? 'Ekleniyor...' : 'Sepete Ekle'}
      </span>
    </button>
  );
}
