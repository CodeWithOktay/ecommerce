"use client";

import useCart from "@/hooks/use-cart"; // Sepet durumu için özel hook
import {
  Lock,
  Minus,
  Plus,
  Shield,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  // Sepet context'inden gerekli fonksiyonları ve durumları al
  const {
    items,
    removeItem,
    updateQuantity,
    removeAll,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Sepet boşsa boş sepet görünümünü göster
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center p-8 text-center">
        {/* Boş sepet ikonu */}
        <div className="text-8xl mb-6 text-gray-300">
          <ShoppingCart size={96} strokeWidth={1} />
        </div>
        {/* Başlık */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
          Sepetiniz Boş
        </h1>
        {/* Açıklama metni */}
        <p className="text-gray-600 text-lg mb-8 max-w-md">
          Henüz sepetinize ürün eklemediniz. Hemen alışverişe başlayın ve harika
          ürünleri keşfedin!
        </p>
        {/* Ana sayfaya dönüş butonu */}
        <Link
          href="/"
          className="bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  // Sepet doluysa ana sepet görünümünü göster
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Sayfa Başlığı */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Alışveriş Sepeti
            </h1>
            <p className="text-gray-500 text-lg">
              {totalItems} ürün • Toplam:{" "}
              <span className="font-semibold text-gray-900">
                {totalPrice.toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                ₺
              </span>
            </p>
          </div>
          <button
            onClick={removeAll}
            className="text-red-500 hover:text-red-700 font-medium transition-colors flex items-center gap-2 text-sm"
          >
            <Trash2 size={16} />
            Sepeti Temizle
          </button>
        </div>

        {/* Grid layout: Ürün listesi ve özet paneli */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ürün Listesi - 2/3 genişlik */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:border-gray-200 transition-all"
              >
                <div className="flex gap-4 md:gap-6">
                  {/* Ürün Görseli */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart size={24} />
                      </div>
                    )}
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link
                          href={`/urun/${item.id}`}
                          className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-gray-500 text-sm mt-1">
                          Birim Fiyat: {item.price.toFixed(2)} ₺
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Kaldır"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      {/* Miktar Kontrolü */}
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              removeItem(item.id);
                            } else {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-semibold text-gray-900 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Toplam Fiyat */}
                      <div className="text-right">
                        <span className="text-xl font-bold text-gray-900">
                          {(Number(item.price) * item.quantity).toLocaleString(
                            "tr-TR",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          ₺
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sepet Özet Paneli - 1/3 genişlik */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Sipariş Özeti
              </h2>

              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>
                    {totalPrice.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    ₺
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kargo</span>
                  <span className="text-green-600 font-medium">Ücretsiz</span>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-900">
                      Toplam
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {totalPrice.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      ₺
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    KDV Dahil
                  </p>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Ödemeye Geç</span>
                <Truck
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <div className="mt-6 flex justify-center gap-4 text-gray-400">
                <Shield size={24} aria-label="Güvenli Ödeme" />
                <Lock size={24} aria-label="SSL Korumalı" />
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">
                %100 Güvenli Ödeme Altyapısı
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
