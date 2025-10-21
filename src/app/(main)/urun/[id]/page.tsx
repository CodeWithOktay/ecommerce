// src/app/urun/[id]/page.tsx

import { getProductById } from '@/lib/data/mock-data';
import {
  Award,
  Check,
  Clock,
  Heart,
  RotateCcw,
  Share2,
  Shield,
  Star,
  Truck,
  Zap,
} from 'lucide-react';
import type { Metadata } from 'next';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/product/AddToCartButton';
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProductById(params.id);
  if (!product) {
    return {
      title: 'Ürün bulunamadı',
      description: 'Aradığınız ürün bulunamadı',
    };
  }
  return {
    title: `${product.name} | KervanPazar`,
    description: product.description?.substring(0, 160),
    openGraph: {
      images: [product.image_url],
      title: `${product.name} | KervanPazar`,
      description: product.description?.substring(0, 160),
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const features = [
    { icon: Truck, text: 'Ücretsiz Kargo', subtext: '300 TL ve üzeri' },
    { icon: Shield, text: 'Güvenli Ödeme', subtext: '256-bit SSL' },
    { icon: RotateCcw, text: 'Kolay İade', subtext: '14 gün içinde' },
    { icon: Clock, text: 'Hızlı Teslimat', subtext: '1-3 iş günü' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-3">
        <div className="container mx-auto px-4 text-center text-sm">
          🚀 <strong>Özel Fırsat!</strong> Bu üründe 12 aya varan taksit
          seçenekleri ve ücretsiz kargo!
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-3 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Ana Sayfa
            </Link>
            <span className="text-gray-300">›</span>
            <a
              href="/urunler"
              className="text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Ürünler
            </a>
            <span className="text-gray-300">›</span>
            <a
              href={`/kategori/${product.category_id}`}
              className="text-gray-500 hover:text-indigo-600 transition-colors capitalize"
            >
              {product.subcategory_name || product.category_id}
            </a>
            <span className="text-gray-300">›</span>
            <span className="text-gray-900 font-medium truncate max-w-40">
              {product.name}
            </span>
          </div>
        </nav>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
          {/* Sol Taraf: Ürün Görseli */}
          <div className="xl:col-span-7">
            <div className="sticky top-8 space-y-6">
              {/* Ana Görsel */}
              <div className="relative h-96 md:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-white group">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 60vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Aksiyon Butonları */}
                <div className="absolute top-4 right-4 flex flex-col space-y-3">
                  <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group/btn">
                    <Heart
                      size={20}
                      className="text-gray-600 group-hover/btn:text-red-500 transition-colors"
                    />
                  </button>
                  <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group/btn">
                    <Share2
                      size={20}
                      className="text-gray-600 group-hover/btn:text-indigo-600 transition-colors"
                    />
                  </button>
                </div>

                {/* İndirim Badge */}
                {product.old_price && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                      -%
                      {Math.round(
                        (1 - product.price / product.old_price) * 100
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Küçük Görseller */}
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg bg-white flex-shrink-0 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-indigo-500"
                  >
                    <Image
                      src={product.image_url}
                      alt={`${product.name} ${item}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Özellikler Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <feature.icon
                      className="mx-auto mb-2 text-indigo-600"
                      size={24}
                    />
                    <p className="font-semibold text-gray-900 text-sm">
                      {feature.text}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {feature.subtext}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Taraf: Ürün Bilgisi */}
          <div className="xl:col-span-5">
            <div className="space-y-8">
              {/* Üst Bilgiler */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-semibold rounded-full mb-3 border border-indigo-200">
                      {product.brand || 'Premium Marka'}
                    </span>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      {product.name}
                    </h1>
                  </div>
                </div>

                {/* Rating ve Satış Bilgisi */}
                <div className="flex items-center space-x-6 mb-6">
                  {product.rating !== undefined && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < product.rating! ? 'currentColor' : 'none'}
                            stroke={
                              i < product.rating! ? 'currentColor' : '#FBBF24'
                            }
                            className="text-yellow-400"
                          />
                        ))}
                        <span className="text-sm font-bold text-gray-700 ml-1">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        (42 değerlendirme)
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <Zap size={14} />
                    <span className="text-sm font-semibold">Çok Satan</span>
                  </div>
                </div>

                {/* Fiyat Bilgisi */}
                <div className="mb-6">
                  <div className="flex items-baseline space-x-4 mb-2">
                    <p className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-700 text-transparent bg-clip-text">
                      {product.price.toLocaleString('tr-TR', {
                        // style: 'currency' yerine 'decimal' kullanıyoruz
                        style: 'decimal',
                        // Kuruşları (ondalık kısmı) her zaman göstermek için bu ayarları ekliyoruz
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      ₺
                    </p>
                    {product.old_price && (
                      <div className="flex flex-col">
                        <p className="text-xl text-gray-400 line-through">
                          {product.old_price.toLocaleString('tr-TR', {
                            // style: 'currency' yerine 'decimal' kullanıyoruz
                            style: 'decimal',
                            // Kuruşları (ondalık kısmı) her zaman göstermek için bu ayarları ekliyoruz
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{' '}
                          ₺
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Taksit Seçenekleri */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Taksit Seçenekleri
                      </span>
                      <Award className="text-indigo-600" size={16} />
                    </div>
                    <div className="space-y-2">
                      {[3, 6, 9, 12].map((taksit) => (
                        <div
                          key={taksit}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-600">{taksit} taksit</span>
                          <span className="font-semibold text-gray-900">
                            {(product.price / taksit).toLocaleString('tr-TR', {
                              // style: 'currency' yerine 'decimal' kullanıyoruz
                              style: 'decimal',
                              // Kuruşları (ondalık kısmı) her zaman göstermek için bu ayarları ekliyoruz
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{' '}
                            ₺
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stok Durumu */}
                {product.stock !== undefined && (
                  <div
                    className={`inline-flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold mb-6 ${
                      product.stock > 0
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    <Check
                      size={16}
                      className={
                        product.stock > 0 ? 'text-green-600' : 'text-red-600'
                      }
                    />
                    <span>
                      {product.stock > 0 ? (
                        <>Stokta - Son {product.stock} ürün</>
                      ) : (
                        <>Stokta Yok</>
                      )}
                    </span>
                  </div>
                )}

                {/* Sepete Ekle Butonu */}
                <div className="space-y-4">
                  <AddToCartButton product={product} />

                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-green-700 hover:bg-green-600 border-2 border-gray-300 text-white py-4 px-6 rounded-xl font-semibold hover:border-gray-400 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      Hemen Satın Al
                    </button>
                    <button className="bg-red-700 text-white py-4 px-6 rounded-xl font-semibold hover:bg-red-600 hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                      <Heart size={18} />
                      <span>Favorilere Ekle</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hızlı Bilgiler */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                  Hızlı Bilgiler
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Kategori</span>
                    <span className="font-semibold text-gray-900">
                      {product.subcategory_name || product.category_id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Marka</span>
                    <span className="font-semibold text-gray-900">
                      {product.brand || 'Belirtilmemiş'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Garanti</span>
                    <span className="font-semibold text-green-600">24 Ay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ürün Açıklaması ve Detaylar */}
        <div className="mt-16 grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Ana Açıklama */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Ürün Açıklaması
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                  <p className="text-lg mb-6">{product.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Teknik Özellikler
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-center space-x-3">
                          <Check className="text-green-500" size={18} />
                          <span>Yüksek Kaliteli Malzeme</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <Check className="text-green-500" size={18} />
                          <span>Uzun Ömürlü Kullanım</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <Check className="text-green-500" size={18} />
                          <span>Kolay Kurulum</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Paket İçeriği
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-center space-x-3">
                          <Check className="text-green-500" size={18} />
                          <span>Ana Ürün</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <Check className="text-green-500" size={18} />
                          <span>Kullanım Kılavuzu</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <Check className="text-green-500" size={18} />
                          <span>Garanti Belgesi</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Yan Bilgi */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white">
              <h3 className="font-bold text-lg mb-3">Premium Üyelik</h3>
              <p className="text-indigo-100 mb-4">
                Premium üye olun, ekstra indirimler ve özel fırsatlardan
                yararlanın!
              </p>
              <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Hemen Üye Ol
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">
                Müşteri Yorumları
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex text-yellow-400">
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                    </div>
                    <span className="text-sm font-semibold">5.0</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Ürün çok kaliteli, hızlı kargo için teşekkürler!
                  </p>
                  <span className="text-xs text-gray-500 block mt-2">
                    - Ahmet Y.
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex text-yellow-400">
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                    </div>
                    <span className="text-sm font-semibold">5.0</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Ürün çok kaliteli, Müşteri Hizmetleri çok ilgili.
                  </p>
                  <span className="text-xs text-gray-500 block mt-2">
                    - Oktay Y.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
