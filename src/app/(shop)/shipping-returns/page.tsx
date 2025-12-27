"use client";

import {
  CheckCircle,
  Clock,
  FileText,
  Package,
  Shield,
  Truck,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

// --- TİP TANIMLAMALARI (Dış dosyaya gerek kalmadan çalışsın diye buraya aldım) ---
type ShippingMethod = {
  id: string;
  name: string;
  description: string;
  deliveryTime: string;
  freeShippingThreshold?: number;
};

type ReturnPolicy = {
  id: string;
  title: string;
  description: string;
  duration: number;
  conditions: string[];
};

// --- DATA (Veriler) ---
const shippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standart Kargo",
    description: "Türkiye'nin her yerine güvenli teslimat",
    deliveryTime: "1-3 iş günü",
    freeShippingThreshold: 500,
  },
  {
    id: "express",
    name: "Hızlı Teslimat (Aynı Gün)",
    description: "İstanbul içi saat 12:00'ye kadar verilen siparişlerde",
    deliveryTime: "Aynı Gün",
  },
];

const returnPolicies: ReturnPolicy[] = [
  {
    id: "guarantee",
    title: "14 Gün Koşulsuz İade",
    description: "Memnun kalmadığınız ürünü 14 gün içinde iade edebilirsiniz.",
    duration: 14,
    conditions: [
      "Ürün orijinal ambalajında ve hasarsız olmalı",
      "Etiketleri koparılmamış olmalı",
      "Kullanılmamış ve yıkanmamış olmalı",
      "Faturası ile birlikte gönderilmeli",
    ],
  },
  {
    id: "defective",
    title: "Ayıplı/Kusurlu Ürün Değişimi",
    description: "Kargoda hasar gören veya üretim hatası olan ürünler.",
    duration: 30,
    conditions: [
      "Kargo tutanağı tutulmuş olmalı (Hasarlı kargolar için)",
      "Üretim hatası tespit edilmeli",
      "Stok durumuna göre birebir değişim yapılır",
    ],
  },
];

export default function KargoVeIadePage() {
  const [activeTab, setActiveTab] = useState<"kargo" | "iade">("kargo");

  return (
    // ✨ ANA ARKA PLAN: Modern Gradient
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* ✅ Başlık Bölümü */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-2">
            7/24 Destek & Güvenli Lojistik
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-2">
            Kargo & İade Merkezi
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Siparişleriniz bize emanet. Şeffaf kargo süreçlerimiz ve kolay iade
            politikamızla alışverişin keyfini çıkarın.
          </p>
        </div>

        {/* ✅ Sekme Navigasyonu (Modern Pill Design) */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-gray-100 inline-flex gap-2">
            <button
              onClick={() => setActiveTab("kargo")}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "kargo"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105"
                  : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <Truck size={18} />
              Kargo & Teslimat
            </button>
            <button
              onClick={() => setActiveTab("iade")}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "iade"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md scale-105"
                  : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <Package size={18} />
              İade & Değişim
            </button>
          </div>
        </div>

        <div className="transition-all duration-500 ease-in-out">
          {/* ================= KARGO SEKME İÇERİĞİ ================= */}
          {activeTab === "kargo" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* İkonlu Kartlar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Truck,
                    color: "text-indigo-600",
                    bg: "bg-indigo-50",
                    title: "Ücretsiz Kargo",
                    desc: "500 TL üzeri alışverişlerde kargo bizden.",
                  },
                  {
                    icon: Clock,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                    title: "Hızlı Teslimat",
                    desc: "Siparişleriniz 24 saat içinde kargoda.",
                  },
                  {
                    icon: Shield,
                    color: "text-pink-600",
                    bg: "bg-pink-50",
                    title: "Sigortalı Gönderim",
                    desc: "Tüm paketler sigorta güvencesindedir.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div
                      className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Kargo Yöntemleri */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Package className="text-indigo-600" />
                    Gönderim Seçenekleri
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className="p-6 md:p-8 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-gray-900">
                              {method.name}
                            </h3>
                            {method.freeShippingThreshold && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                FIRSAT
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600">{method.description}</p>
                          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Clock size={16} /> {method.deliveryTime}
                            </span>
                            {method.freeShippingThreshold && (
                              <span className="text-indigo-600">
                                ⭐ {method.freeShippingThreshold} TL üzeri
                                ÜCRETSİZ
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            ÜCRETSİZ
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bilgi Kutusu */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <AlertCircle className="text-blue-200" /> Dikkat Edilmesi
                      Gerekenler
                    </h3>
                    <ul className="space-y-2 text-blue-100 text-sm">
                      <li className="flex items-center gap-2">
                        • Kargonuzu teslim alırken paketi kontrol ediniz.
                      </li>
                      <li className="flex items-center gap-2">
                        • Hasarlı paketler için tutanak tutturunuz.
                      </li>
                      <li className="flex items-center gap-2">
                        • Resmi tatillerde teslimat süresi değişebilir.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= İADE SEKME İÇERİĞİ ================= */}
          {activeTab === "iade" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Adım Adım Süreç */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
                  İade Süreci Nasıl İşler?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                  {/* Bağlantı Çizgisi (Desktop) */}
                  <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>

                  {[
                    {
                      step: "1",
                      title: "Talep Oluştur",
                      desc: "Aşağıdaki formu doldurun",
                    },
                    {
                      step: "2",
                      title: "Kod Al",
                      desc: "SMS ile iade kodunu alın",
                    },
                    {
                      step: "3",
                      title: "Kargola",
                      desc: "Ücretsiz kargoya verin",
                    },
                    {
                      step: "4",
                      title: "Para İadesi",
                      desc: "2-4 gün içinde iade",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="relative z-10 bg-white flex flex-col items-center text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md shadow-purple-200">
                        {item.step}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* İade Kartları */}
              <div className="grid md:grid-cols-2 gap-6">
                {returnPolicies.map((policy) => (
                  <div
                    key={policy.id}
                    className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <FileText size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {policy.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {policy.description}
                    </p>
                    <div className="space-y-3">
                      {policy.conditions.map((cond, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 text-sm text-gray-600"
                        >
                          <CheckCircle
                            size={16}
                            className="text-green-500 mt-0.5 flex-shrink-0"
                          />
                          <span>{cond}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
