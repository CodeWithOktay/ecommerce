"use client";

import { useState, useTransition, useMemo } from "react";
import { Category, Brand, CouponType } from "@prisma/client";
import {
  Ticket,
  Tags,
  Loader2,
  Trash2,
  Plus,
  Percent,
  RotateCcw,
  Zap,
  Filter,
} from "lucide-react";
import {
  createCoupon,
  deleteCoupon,
  applyBulkDiscount,
  removeBulkDiscount,
} from "@/lib/actions/discount";
import toast from "react-hot-toast";

// Kategori tipi artık markaları da içeriyor (Type Safety için önemli)
type CategoryWithBrands = Category & { brands: Brand[] };

interface Props {
  categories: CategoryWithBrands[];
  coupons: {
    id: string;
    code: string;
    type: CouponType;
    value: number;
    minAmount: number | null;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
    usageLimit: number | null;
    usedCount: number;
    category: Category | null;
    createdAt: string;
    updatedAt: string;
  }[];
  allBrands: Brand[];
}

export default function DiscountsClient({
  categories,
  coupons,
  allBrands,
}: Props) {
  const [activeTab, setActiveTab] = useState<"coupons" | "bulk">("coupons");
  const [isPending, startTransition] = useTransition();

  // --- KUPON STATE ---
  const [couponForm, setCouponForm] = useState<{
    code: string;
    value: number;
    type: "PERCENTAGE" | "FIXED";
    minAmount: number;
    categoryId: string;
  }>({
    code: "",
    value: 10,
    type: "PERCENTAGE",
    minAmount: 0,
    categoryId: "all",
  });

  // --- TOPLU İNDİRİM STATE ---
  const [bulkForm, setBulkForm] = useState({
    categoryId: "all",
    brandId: "all", // 🟢 Yeni Marka State'i
    percentage: 15,
  });

  // 🟢 DİNAMİK MARKA LİSTESİ HESAPLAMA
  const availableBrands = useMemo(() => {
    if (bulkForm.categoryId === "all") {
      return allBrands; // Tüm mağaza seçiliyse tüm markalar
    }
    // Seçili kategoriyi bul
    const selectedCat = categories.find((c) => c.id === bulkForm.categoryId);
    // Onun markalarını döndür, yoksa boş dizi
    return selectedCat?.brands || [];
  }, [bulkForm.categoryId, categories, allBrands]);

  // --- AKSİYONLAR ---
  const handleCreateCoupon = () => {
    if (!couponForm.code) return toast.error("Kupon kodu girin!");
    startTransition(async () => {
      const res = await createCoupon({
        code: couponForm.code,
        type: couponForm.type,
        value: Number(couponForm.value),
        minAmount: Number(couponForm.minAmount),
        categoryId: couponForm.categoryId,
      });
      if (res.success) {
        toast.success(res.message);
        setCouponForm({ ...couponForm, code: "" });
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleDeleteCoupon = (id: string) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    startTransition(async () => {
      await deleteCoupon(id);
      // No return needed - startTransition expects void or Promise<void>
    });
  };

  // 🟢 GÜNCELLENMİŞ TOPLU İNDİRİM AKSİYONU
  const handleApplyBulk = () => {
    if (bulkForm.percentage <= 0) return toast.error("Oran 0'dan büyük olmalı");

    const targetText =
      bulkForm.categoryId === "all" ? "Tüm Mağaza" : "Seçili Kategori";
    const brandText =
      bulkForm.brandId === "all" ? "Tüm Markalar" : "Seçili Marka";

    if (
      !confirm(
        `⚠️ ${targetText} > ${brandText} için fiyatlar %${bulkForm.percentage} düşürülecek. Onaylıyor musun?`
      )
    )
      return;

    startTransition(async () => {
      const res = await applyBulkDiscount(
        bulkForm.categoryId,
        bulkForm.percentage,
        bulkForm.brandId
      );
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    });
  };

  const handleRemoveBulk = () => {
    if (!confirm("İndirimleri kaldırıp eski fiyatlara dönülsün mü?")) return;
    startTransition(async () => {
      const res = await removeBulkDiscount(
        bulkForm.categoryId,
        bulkForm.brandId
      );
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    });
  };

  return (
    <div>
      {/* TABS */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("coupons")}
          className={`pb-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === "coupons" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500"}`}
        >
          <Ticket size={18} /> Kupon Kodları
        </button>
        <button
          onClick={() => setActiveTab("bulk")}
          className={`pb-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === "bulk" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500"}`}
        >
          <Tags size={18} /> Toplu İndirim
        </button>
      </div>

      {/* KUPON SEKMESİ */}
      {activeTab === "coupons" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Plus size={18} className="text-indigo-600" /> Yeni Kupon Ekle
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Kupon Kodu
                </label>
                <input
                  value={couponForm.code}
                  onChange={(e) =>
                    setCouponForm({
                      ...couponForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg uppercase tracking-wider font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="YAZ20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Tip
                  </label>
                  <select
                    value={couponForm.type}
                    onChange={(e) => {
                      const value = e.target.value as "PERCENTAGE" | "FIXED";
                      setCouponForm({
                        ...couponForm,
                        type: value,
                      });
                    }}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    <option value="PERCENTAGE">Yüzde (%)</option>
                    <option value="FIXED">Tutar (₺)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Değer
                  </label>
                  <input
                    type="number"
                    value={couponForm.value}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        value: Number(e.target.value),
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Hangi Kategoride Geçerli?
                </label>
                <select
                  value={couponForm.categoryId}
                  onChange={(e) =>
                    setCouponForm({ ...couponForm, categoryId: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  <option value="all">🌍 Tüm Mağaza</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Min. Sepet Tutarı
                </label>
                <input
                  type="number"
                  value={couponForm.minAmount}
                  onChange={(e) =>
                    setCouponForm({
                      ...couponForm,
                      minAmount: Number(e.target.value),
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>
              <button
                onClick={handleCreateCoupon}
                disabled={isPending}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition-all active:scale-95 flex justify-center items-center gap-2"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Oluştur"
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4 text-gray-700">
              Aktif Kuponlar ({coupons.length})
            </h3>
            {coupons.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed text-gray-400">
                <Ticket size={32} className="mx-auto mb-2 opacity-20" />
                Henüz oluşturulmuş bir kupon yok.
              </div>
            ) : (
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-200 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Ticket size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 tracking-wide font-mono text-lg">
                          {coupon.code}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            {coupon.type === "PERCENTAGE"
                              ? `%${coupon.value}`
                              : `₺${coupon.value}`}{" "}
                            İndirim
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-[200px]">
                            {coupon.category
                              ? `${coupon.category.name} Kategorisi`
                              : "Tüm Mağaza"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      disabled={isPending}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- 2. TOPLU İNDİRİM SEKMESİ (GÜNCELLENDİ) --- */}
      {activeTab === "bulk" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2">
          {/* İNDİRİM UYGULA */}
          <div className="bg-gradient-to-br gradient-to-r from-[#667EEA] to-[#764BA2] p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm border border-white/10">
                <Zap size={24} className="text-yellow-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Flaş Kampanya</h2>
                <p className="text-indigo-100 text-sm opacity-90">
                  Kategori ve Marka bazlı fiyat güncelle.
                </p>
              </div>
            </div>

            <div className="space-y-5 relative z-10">
              {/* KATEGORİ SEÇİMİ */}
              <div>
                <label className="text-xs font-bold text-indigo-200 uppercase tracking-wide">
                  1. Hedef Kategori
                </label>
                <select
                  value={bulkForm.categoryId}
                  onChange={(e) =>
                    setBulkForm({
                      ...bulkForm,
                      categoryId: e.target.value,
                      brandId: "all",
                    })
                  } // Kategori değişince markayı sıfırla
                  className="w-full mt-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:bg-white/20 outline-none transition-colors"
                >
                  <option className="text-gray-900" value="all">
                    🌍 Tüm Mağaza
                  </option>
                  {categories.map((c) => (
                    <option className="text-gray-900" key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🟢 MARKA SEÇİMİ (DİNAMİK) */}
              <div>
                <label className="text-xs font-bold text-indigo-200 uppercase tracking-wide flex items-center gap-2">
                  2. Hedef Marka <Filter size={12} />
                </label>
                <select
                  value={bulkForm.brandId}
                  onChange={(e) =>
                    setBulkForm({ ...bulkForm, brandId: e.target.value })
                  }
                  className="w-full mt-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:bg-white/20 outline-none transition-colors"
                  disabled={availableBrands.length === 0}
                >
                  <option className="text-gray-900" value="all">
                    {availableBrands.length === 0
                      ? "Bu kategoride marka yok"
                      : "⭐ Tüm Markalar"}
                  </option>
                  {availableBrands.map((b) => (
                    <option className="text-gray-900" key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* YÜZDE */}
              <div>
                <label className="text-xs font-bold text-indigo-200 uppercase tracking-wide">
                  3. İndirim Oranı (%)
                </label>
                <div className="relative mt-2">
                  <Percent
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300"
                    size={20}
                  />
                  <input
                    type="number"
                    value={bulkForm.percentage}
                    onChange={(e) =>
                      setBulkForm({
                        ...bulkForm,
                        percentage: Number(e.target.value),
                      })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-bold text-lg focus:bg-white/20 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handleApplyBulk}
                disabled={isPending}
                className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-bold rounded-xl shadow-lg hover:shadow-yellow-400/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "İndirimi Başlat 🚀"
                )}
              </button>
            </div>
          </div>

          {/* İNDİRİM KALDIR (Sıfırla) */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center h-fit">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <RotateCcw size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Kampanyayı Bitir
            </h3>
            <p className="text-gray-500 mb-6 text-xs max-w-[250px]">
              Seçimlerinle eşleşen ürünlerin fiyatını normale döndürür.
            </p>

            <div className="w-full max-w-xs space-y-3">
              <select
                value={bulkForm.categoryId}
                onChange={(e) =>
                  setBulkForm({
                    ...bulkForm,
                    categoryId: e.target.value,
                    brandId: "all",
                  })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
              >
                <option value="all">Tüm Mağaza</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={bulkForm.brandId}
                onChange={(e) =>
                  setBulkForm({ ...bulkForm, brandId: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
              >
                <option value="all">Tüm Markalar</option>
                {availableBrands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleRemoveBulk}
                disabled={isPending}
                className="w-full py-2.5 bg-white border-2 border-red-100 text-red-600 font-bold rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "İndirimleri Kaldır"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
