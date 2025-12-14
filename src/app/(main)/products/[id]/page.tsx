import { prisma } from "@/lib/prisma-client";
import {
  Check,
  RotateCcw,
  Shield,
  Star,
  Truck,
  X,
  List,
  ChevronRight,
  Share2,
  Heart,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/product/AddToCartButton";

// --- VERİ ÇEKME ---
async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: true,
        attributeValues: {
          include: { attribute: true },
        },
      },
    });
    return product;
  } catch (error) {
    return null;
  }
}

// --- METADATA ---
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: "Ürün Bulunamadı" };

  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];
  const imageUrl = mainImage ? mainImage.url : "/placeholder.png";

  return {
    title: `${product.name} | KervanPazar`,
    description: product.description?.substring(0, 160),
    openGraph: {
      images: [imageUrl],
    },
  };
}

// --- ANA SAYFA ---
export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) notFound();

  // Hesaplamalar
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
    { icon: Truck, text: "Hızlı Teslimat", subtext: "1-3 iş günü" },
    { icon: Shield, text: "%100 Güvenli", subtext: "256-bit SSL" },
    { icon: RotateCcw, text: "Kolay İade", subtext: "14 gün içinde" },
  ];

  const cartProductData = {
    id: product.id,
    name: product.name,
    price: displayPrice,
    images: product.images.map((img) => img.url),
    stock: product.stock,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 lg:pb-10">
      {/* 1. Breadcrumb & Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <nav className="flex items-center text-sm text-gray-500 overflow-hidden whitespace-nowrap">
            <Link href="/" className="hover:text-[#667EEA] transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight size={14} className="mx-2 text-gray-300" />
            <Link
              href={`/category/${product.category.slug || product.categoryId}`}
              className="hover:text-[#667EEA] transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight size={14} className="mx-2 text-gray-300" />
            <span className="font-bold text-gray-900 truncate max-w-[150px] md:max-w-xs bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
              {product.name}
            </span>
          </nav>
          <button className="p-2.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-[#667EEA] transition-colors border border-transparent hover:border-gray-100">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* 2. Ana İçerik */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-16">
          {/* --- SOL KOLON (Görseller) --- */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 relative">
              {/* İndirim Rozeti (Gradient) */}
              {hasDiscount && (
                <div className="absolute top-6 left-6 z-10 animate-in fade-in zoom-in duration-500">
                  <span className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-[#667EEA]/30">
                    %{discountRate} İndirim
                  </span>
                </div>
              )}

              {/* Büyük Resim */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-50 group cursor-zoom-in">
                <Image
                  src={mainImageUrl}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Küçük Resimler */}
              {product.images.length > 1 && (
                <div className="mt-6 flex gap-4 overflow-x-auto pb-2 custom-scrollbar px-2">
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                        img.isMain
                          ? "border-[#667EEA] ring-4 ring-[#667EEA]/10 scale-105"
                          : "border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt="thumb"
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ürün Açıklaması (Desktop) */}
            <div className="hidden lg:block bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <List className="text-[#667EEA]" /> Ürün Açıklaması
              </h2>
              <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed">
                {product.description || "Açıklama bulunmuyor."}
              </div>
            </div>
          </div>

          {/* --- SAĞ KOLON (Bilgi & Satın Alma) --- */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-8">
              {/* Ürün Başlık & Rating */}
              <div className="space-y-4">
                <span className="text-[#667EEA] font-bold text-xs uppercase tracking-wider bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 inline-block">
                  {product.brand?.name || "Genel"}
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-gray-700 text-sm font-bold">4.8</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                    <Check size={16} /> 150+ Sipariş
                  </span>
                </div>
              </div>

              {/* Fiyat Kartı (Gradient Style) */}
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                {/* Arka plan efekti */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#667EEA]/10 to-transparent rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="flex items-end gap-3 mb-8 relative z-10">
                  <div className="text-5xl font-black bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent tracking-tighter">
                    {displayPrice.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}
                    <span className="text-2xl text-gray-400 font-medium ml-1 select-none">
                      ₺
                    </span>
                  </div>
                  {oldPrice && (
                    <div className="text-xl text-gray-400 line-through decoration-red-400/50 font-medium mb-2">
                      {oldPrice.toLocaleString("tr-TR")} ₺
                    </div>
                  )}
                </div>

                {/* Stok Durumu */}
                <div className="mb-8">
                  {product.stock > 0 ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200 text-sm font-bold">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                      Stokta Var ({product.stock} adet)
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-bold">
                      <X size={16} /> Tükendi
                    </div>
                  )}
                </div>

                {/* Aksiyon Butonları */}
                <div className="space-y-4">
                  {/* Sepete Ekle Butonu (Component) */}
                  <AddToCartButton product={cartProductData} />

                  <div className="grid grid-cols-6 gap-3">
                    <button className="col-span-5 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-[#667EEA]/30 transition-all hover:-translate-y-1 active:scale-95 duration-300">
                      Hemen Satın Al
                    </button>
                    <button className="col-span-1 flex items-center justify-center border-2 border-gray-100 rounded-xl text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90">
                      <Heart size={24} />
                    </button>
                  </div>
                </div>

                {/* Güven Rozetleri */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
                  {features.map((f, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center text-center gap-2 group cursor-default"
                    >
                      <div className="p-3 bg-gray-50 group-hover:bg-[#667EEA]/10 rounded-2xl text-[#667EEA] transition-colors duration-300">
                        <f.icon size={22} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-800 uppercase tracking-wide transition-colors">
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teknik Özellikler */}
              {product.attributeValues.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <List size={20} className="text-[#667EEA]" />
                    Öne Çıkan Özellikler
                  </h3>
                  <div className="divide-y divide-gray-50">
                    {product.attributeValues.slice(0, 5).map((attr) => (
                      <div
                        key={attr.id}
                        className="flex justify-between py-3 text-sm group hover:bg-gray-50 px-2 rounded-lg transition-colors"
                      >
                        <span className="text-gray-500 font-medium">
                          {attr.attribute.name}
                        </span>
                        <span className="font-bold text-gray-900">
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- MOBİL İÇİN AÇIKLAMA (Alta Gelir) --- */}
          <div className="lg:hidden col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Ürün Açıklaması
              </h2>
              <div className="prose prose-sm text-gray-600">
                {product.description || "Açıklama bulunmuyor."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MOBİL İÇİN STICKY BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4 lg:hidden z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pb-safe">
        <div className="flex gap-4 items-center">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400">
              Toplam
            </span>
            <span className="text-xl font-black bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
              {displayPrice.toLocaleString("tr-TR")} TL
            </span>
          </div>
          <div className="flex-1">
            <AddToCartButton product={cartProductData} />
          </div>
        </div>
      </div>
    </div>
  );
}
