'use client';
import { Lock, Star, Truck } from 'lucide-react';
import Image from 'next/image';
import { ProductCard } from '@/components/product/ProductCard';
import { mockProducts } from '@/lib/data/mock-data';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <Image
              src="/kervanpazar-logo.png"
              alt="KervanPazar Logo"
              width={280}
              height={90}
              className="object-contain"
              priority
            />
          </div>
          <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
            Binlerce ürün, tek platform. Güvenli alışverişin yeni adresi.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Hızlı Teslimat</h3>
            <p className="text-gray-600 text-sm">Aynı gün kargo imkanı</p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Güvenli Ödeme</h3>
            <p className="text-gray-600 text-sm">256-bit SSL güvenliği</p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-amber-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Kalite Garantisi
            </h3>
            <p className="text-gray-600 text-sm">15 gün iade garantisi</p>
          </div>
        </div>
      </div>
    </main>
  );
}
