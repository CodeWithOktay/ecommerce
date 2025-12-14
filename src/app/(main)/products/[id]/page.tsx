// src/app/urun/[id]/page.tsx

import { prisma } from "@/lib/prisma-client";
import {
  Check,
  Clock,
  Heart,
  RotateCcw,
  Shield,
  Star,
  Truck,
  Zap,
  X,
  List, // İkon eklendi
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/product/AddToCartButton";

// Yardımcı fonksiyon: Ürünü veritabanından çek
async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: true,
        // 🟢 YENİ: Özellik değerlerini ve isimlerini çekiyoruz
        attributeValues: {
          include: {
            attribute: true, // Özelliğin adını (Örn: Ekran Boyutu) almak için
          },
        },
      },
    });
    return product;
  } catch (error) {
    return null;
  }
}

/**
 * Dinamik Meta Veri
 */
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: "Ürün bulunamadı",
      description: "Aradığınız ürün bulunamadı",
    };
  }

  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];
  const imageUrl = mainImage ? mainImage.url : "/placeholder.png";

  return {
    title: `${product.name} | KervanPazar`,
    description: product.description?.substring(0, 160),
    openGraph: {
      images: [imageUrl],
      title: `${product.name} | KervanPazar`,
      description: product.description?.substring(0, 160),
    },
  };
}

/**
 * Ürün Detay Sayfası
 */
export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // --- 1. VERİ DÖNÜŞÜMÜ ---
  const rawPrice = Number(product.price);
  const rawSalePrice = product.salePrice ? Number(product.salePrice) : null;
  const hasDiscount = rawSalePrice !== null && rawSalePrice < rawPrice;
  const displayPrice = hasDiscount ? rawSalePrice! : rawPrice;
  const oldPrice = hasDiscount ? rawPrice : null;
  const discountRate = hasDiscount
    ? Math.round(((rawPrice - rawSalePrice!) / rawPrice) * 100)
    : 0;

  const mainImageObj =
    product.images.find((img) => img.isMain) || product.images[0];
  const mainImageUrl = mainImageObj ? mainImageObj.url : "/placeholder.png";

  const features = [
    { icon: Truck, text: "Ücretsiz Kargo", subtext: "300 TL ve üzeri" },
    { icon: Shield, text: "Güvenli Ödeme", subtext: "256-bit SSL" },
    { icon: RotateCcw, text: "Kolay İade", subtext: "14 gün içinde" },
    { icon: Clock, text: "Hızlı Teslimat", subtext: "1-3 iş günü" },
  ];

  const cartProductData = {
    id: product.id,
    name: product.name,
    price: displayPrice,
    images: product.images.map((img) => img.url),
    stock: product.stock,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Üst Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-3">
        <div className="container mx-auto px-4 text-center text-sm">
          🚀 <strong>Özel Fırsat!</strong> Bu üründe 12 aya varan taksit
          seçenekleri ve ücretsiz kargo!
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-3 text-sm flex-wrap">
            <Link
              href="/"
              className="text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Ana Sayfa
            </Link>
            <span className="text-gray-300">›</span>
            <Link
              href="/urunler"
              className="text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Ürünler
            </Link>
            <span className="text-gray-300">›</span>
            <Link
              href={`/category/${product.category.slug || product.categoryId}`}
              className="text-gray-500 hover:text-indigo-600 transition-colors capitalize"
            >
              {product.category.name}
            </Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-900 font-medium truncate max-w-40">
              {product.name}
            </span>
          </div>
        </nav>

        {/* Ana Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
          {/* --- SOL TARAF: GÖRSELLER --- */}
          <div className="xl:col-span-7">
            <div className="sticky top-8 space-y-6">
              {/* Ana Görsel */}
              <div className="relative h-96 md:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-white group border border-gray-100">
                <Image
                  src={mainImageUrl}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 60vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-red-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      %{discountRate} İndirim
                    </span>
                  </div>
                )}
              </div>

              {/* Küçük Görseller */}
              {product.images.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar">
                  {product.images.map((img) => (
                    <div
                      key={img.id}
                      className={`relative w-24 h-24 rounded-2xl overflow-hidden shadow-sm bg-white flex-shrink-0 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${img.isMain ? "border-indigo-600" : "border-transparent hover:border-indigo-300"}`}
                    >
                      <Image
                        src={img.url}
                        alt={`${product.name} thumbnail`}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Özellikler Grid (Icons) */}
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

          {/* --- SAĞ TARAF: BİLGİLER --- */}
          <div className="xl:col-span-5">
            <div className="space-y-8">
              {/* Üst Bilgiler Kartı */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-semibold rounded-full mb-3 border border-indigo-200">
                      {product.brand?.name || "Genel Marka"}
                    </span>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      {product.name}
                    </h1>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                      <div className="flex text-yellow-400">
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star
                          size={16}
                          fill="currentColor"
                          className="text-gray-300"
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700 ml-1">
                        4.8
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <Zap size={14} />
                    <span className="text-sm font-semibold">
                      Hızlı Gönderim
                    </span>
                  </div>
                </div>

                {/* Fiyat Bilgisi */}
                <div className="mb-6">
                  <div className="flex items-baseline space-x-4 mb-2">
                    <p
                      className={`text-4xl lg:text-5xl font-black ${hasDiscount ? "text-red-600" : "bg-gradient-to-r from-indigo-600 to-purple-700 text-transparent bg-clip-text"}`}
                    >
                      {displayPrice.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      ₺
                    </p>
                    {oldPrice && (
                      <p className="text-xl text-gray-400 line-through decoration-red-400">
                        {oldPrice.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        ₺
                      </p>
                    )}
                  </div>
                </div>

                {/* Stok Durumu */}
                <div
                  className={`inline-flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold mb-6 ${
                    product.stock > 0
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {product.stock > 0 ? (
                    <>
                      <Check size={16} className="text-green-600" />
                      <span>Stokta - Son {product.stock} ürün</span>
                    </>
                  ) : (
                    <>
                      <X size={16} className="text-red-600" />
                      <span>Stokta Yok</span>
                    </>
                  )}
                </div>

                {/* Butonlar */}
                <div className="space-y-4">
                  <AddToCartButton product={cartProductData} />
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      disabled={product.stock <= 0}
                      className="bg-green-700 hover:bg-green-600 disabled:bg-gray-400 border-2 border-transparent text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Hemen Al
                    </button>
                    <button className="bg-white text-red-600 border-2 border-red-100 hover:border-red-200 py-4 px-6 rounded-xl font-semibold hover:bg-red-50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                      <Heart size={18} />
                      <span>Favorile</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- ALT BÖLÜM: AÇIKLAMALAR VE ÖZELLİKLER --- */}
        <div className="mt-16 grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                {/* 🟢 YENİ: TEKNİK ÖZELLİKLER TABLOSU */}
                {product.attributeValues.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <List className="text-indigo-600" /> Teknik Özellikler
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                      {product.attributeValues.map((attr) => (
                        <div
                          key={attr.id}
                          className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0"
                        >
                          <span className="text-gray-500 font-medium text-sm">
                            {attr.attribute.name}
                          </span>
                          <span className="text-gray-900 font-semibold text-sm">
                            {attr.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Ürün Açıklaması
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {product.description ||
                    "Bu ürün için henüz detaylı açıklama girilmemiş."}
                </div>
              </div>
            </div>
          </div>

          {/* Yan Bannerlar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">Kurumsal Satış</h3>
              <p className="text-indigo-100 text-sm mb-4">
                Toplu alımlarınız için özel fiyat teklifi alın.
              </p>
              <button className="w-full bg-white text-indigo-600 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                Teklif İste
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
