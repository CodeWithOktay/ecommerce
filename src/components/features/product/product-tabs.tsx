"use client";

import { useState } from "react";
import { Star, CheckCircle2, RotateCcw, Truck } from "lucide-react";
import ProductDescription from "./product-description";

interface Attribute {
  id: string;
  attribute: {
    id: string;
    name: string;
    categoryId: string;
  };
  value: string;
}

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  isApproved: boolean;
  user: {
    firstName: string | null;
    lastName: string | null;
    image: string | null;
  };
}

interface Props {
  description: string | null;
  attributes: Attribute[];
  reviews?: Review[];
  isUserBought?: boolean;
}

export default function ProductTabs({
  description,
  attributes,
  reviews = [],
  isUserBought = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    "desc" | "specs" | "reviews" | "returns"
  >("desc");

  const reviewCount = reviews.length;
  const hasReviews = reviewCount > 0;
  const avgRating = hasReviews
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
    : "0.0";

  const tabs = [
    { id: "desc", label: "Ürün Açıklaması" },
    { id: "specs", label: "Özellikler" },
    { id: "reviews", label: `Değerlendirmeler (${reviewCount})` },
    { id: "returns", label: "İade & Teslimat" },
  ];

  return (
    <div className="flex flex-col justify-center mt-12 bg-white border-t border-gray-100">
      {/* --- Minimal Tab Nav --- */}
      <div className="container mx-auto">
        <div className="flex justify-center border-b border-gray-100 overflow-x-auto scrollbar-hide">
          <div className="flex justify-center gap-8 md:gap-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as "desc" | "specs" | "reviews" | "returns"
                  )
                }
                className={`py-6 text-sm font-medium transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-indigo-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 animate-in slide-in-from-left-full duration-300" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="container mx-auto max-w-6xl py-12 px-4">
        <div className="animate-in fade-in duration-500">
          {/* 1. AÇIKLAMA */}
          {activeTab === "desc" && (
            <div className="prose prose-indigo max-w-none">
              <ProductDescription text={description} />
            </div>
          )}

          {/* 2. ÖZELLİKLER (Sade Liste) */}
          {activeTab === "specs" && (
            <div className="max-w-3xl mx-auto">
              <div className="divide-y divide-gray-100">
                {attributes.length > 0 ? (
                  attributes.map((attr, i) => (
                    <div
                      key={i}
                      className="py-4 flex justify-between items-center gap-8"
                    >
                      <span className="text-gray-500 text-sm">
                        {attr.attribute.name}
                      </span>
                      <span className="text-gray-900 text-sm font-semibold text-right">
                        {attr.value}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-8">
                    Teknik detay belirtilmemiş.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 3. DEĞERLENDİRMELER */}
          {activeTab === "reviews" && (
            <div className="space-y-12">
              {/* Summary Score */}
              <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-gray-50 rounded-2xl gap-8">
                <div className="text-center md:text-left">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900">
                      {avgRating}
                    </span>
                    <span className="text-gray-400 font-medium">/ 5.0</span>
                  </div>
                  <div className="flex text-yellow-400 my-2 justify-center md:justify-start">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={20}
                        fill={
                          s <= Math.round(Number(avgRating))
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          s <= Math.round(Number(avgRating))
                            ? ""
                            : "text-gray-200"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    {reviewCount} doğrulanmış kullanıcı yorumu
                  </p>
                </div>
                <button
                  disabled={!isUserBought}
                  className="px-8 py-3 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 disabled:bg-gray-200 transition-all active:scale-95"
                >
                  Yorum Yaz
                </button>
              </div>
              {!isUserBought && (
                <div className="text-center">
                  <span className="text-xs text-gray-500">
                    Yorum yapabilmek için ürünü satın almanız gerekmektedir.
                  </span>
                </div>
              )}
              {/* Review List */}
              <div className="space-y-10">
                {hasReviews ? (
                  reviews.map((review) => (
                    <div key={review.id} className="group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 uppercase">
                            {review.user.firstName?.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">
                                {review.user.firstName}{" "}
                                {review.user.lastName?.charAt(0)}.
                              </span>
                              <CheckCircle2
                                size={14}
                                className="text-green-500"
                              />
                            </div>
                            <div className="flex text-yellow-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={12}
                                  fill={
                                    s <= review.rating ? "currentColor" : "none"
                                  }
                                  className={
                                    s <= review.rating ? "" : "text-gray-200"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString(
                            "tr-TR"
                          )}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed pl-13">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-400 italic">
                      Bu ürün için henüz değerlendirme yapılmamış.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. İADE & TESLİMAT */}
          {activeTab === "returns" && (
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-indigo-600">
                  <Truck size={24} />
                  <h4 className="font-bold">Teslimat Bilgileri</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Saat 16:00&apos;a kadar verilen siparişler aynı gün kargoya
                  teslim edilir. Hafta sonu verilen siparişler Pazartesi günü
                  işleme alınır.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-indigo-600">
                  <RotateCcw size={24} />
                  <h4 className="font-bold">İade & Değişim</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Memnun kalmadığınız ürünleri 14 gün içerisinde orijinal
                  kutusuyla ücretsiz iade edebilirsiniz. Hijyen bandı açılmış
                  ürünlerde iade kabul edilmemektedir.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
