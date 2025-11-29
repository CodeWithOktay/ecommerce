'use client';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useCart } from '@/context/cart/index';
import { Product } from '@/types/index';
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Link'e tıklanmasını engelle
    e.stopPropagation(); // Event'in yayılmasını durdur
    addToCart(product);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 hover:border-transparent relative overflow-hidden">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-xl mb-3">
        <Link href={`/urun/${product.id}`}>
          <Image
            src={product.image_url}
            alt={product.name}
            width={192}
            height={226}
            className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Product Info */}
      <Link href={`/urun/${product.id}`}>
        <h3 className="font-semibold text-gray-800 truncate mb-2">
          {product.name}
        </h3>
      </Link>

      {/* Price */}
      <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#667EEA] to-[#764BA2]">
        {product.price.toLocaleString('tr-TR', {
          // style: 'currency' yerine 'decimal' kullanıyoruz
          style: 'decimal',
          // Kuruşları (ondalık kısmı) her zaman göstermek için bu ayarları ekliyoruz
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{' '}
        ₺
      </p>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="mt-3 w-full bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold flex items-center justify-center gap-2"
      >
        <ShoppingCart /> Sepete Ekle
      </button>
    </div>
  );
}
