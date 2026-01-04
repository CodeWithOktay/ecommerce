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
  Copy,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  createCoupon,
  deleteCoupon,
  applyBulkDiscount,
  removeBulkDiscount,
} from "@/lib/actions/discount";
import toast from "react-hot-toast";

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
    usageLimit: number | undefined;
  }>({
    code: "",
    value: 10,
    type: "PERCENTAGE",
    minAmount: 0,
    categoryId: "all",
    usageLimit: undefined, // 🟢 Default Limitsiz
  });

  // --- TOPLU İNDİRİM STATE ---
  const [bulkForm, setBulkForm] = useState({
    categoryId: "all",
    brandId: "all",
    percentage: 15,
  });

  // 🟢 DİNAMİK MARKA LİSTESİ HESAPLAMA
  const availableBrands = useMemo(() => {
    if (bulkForm.categoryId === "all") {
      return allBrands;
    }
    const selectedCat = categories.find((c) => c.id === bulkForm.categoryId);
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
        usageLimit: Number(couponForm.usageLimit) > 0 ? Number(couponForm.usageLimit) : undefined,
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
    if (!confirm("Bu kuponu silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deleteCoupon(id);
      toast.success("Kupon silindi.");
    });
  };

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Kupon kodu kopyalandı!");
  };

  return (
    <div className="space-y-8">
      {/* TABS */}
      <div className="flex p-1 bg-gray-100/80 backdrop-blur-sm rounded-xl max-w-fit border border-gray-200 shadow-inner">
        <button
          onClick={() => setActiveTab("coupons")}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
            activeTab === "coupons"
              ? "bg-white text-indigo-600 shadow-sm scale-105"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Ticket size={16} strokeWidth={2.5} /> Kupon Kodları
        </button>
        <button
          onClick={() => setActiveTab("bulk")}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
            activeTab === "bulk"
              ? "bg-white text-indigo-600 shadow-sm scale-105"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Tags size={16} strokeWidth={2.5} /> Toplu İndirim
        </button>
      </div>

      {/* --- KUPON SEKMESİ --- */}
      {activeTab === "coupons" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* CREATE FORM */}
          <div className="lg:col-span-4 h-fit">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-6 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 -z-10 group-hover:opacity-100 transition-opacity duration-500 opacity-50" />
               
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                   <Plus size={20} />
                </div>
                Yeni Kupon Oluştur
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">
                    Kupon Kodu
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Ticket size={16} />
                     </div>
                    <input
                      value={couponForm.code}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          code: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""),
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl uppercase font-mono text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                      placeholder="ÖRN: YAZ2024"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">
                      İndirim Tipi
                    </label>
                    <div className="relative">
                        <select
                          value={couponForm.type}
                          onChange={(e) =>
                            setCouponForm({ ...couponForm, type: e.target.value as "PERCENTAGE" | "FIXED" })
                          }
                          className="w-full pl-3 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none appearance-none shadow-sm cursor-pointer"
                        >
                          <option value="PERCENTAGE">Yüzde (%)</option>
                          <option value="FIXED">Tutar (₺)</option>
                        </select>
                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                            <Plus size={14} className="rotate-45" />
                         </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">
                      Değer
                    </label>
                    <input
                      type="number"
                      value={couponForm.value}
                      onChange={(e) =>
                        setCouponForm({ ...couponForm, value: Number(e.target.value) })
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">
                     Geçerli Kategori
                  </label>
                   <div className="relative">
                        <select
                          value={couponForm.categoryId}
                          onChange={(e) =>
                            setCouponForm({ ...couponForm, categoryId: e.target.value })
                          }
                          className="w-full pl-3 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none appearance-none shadow-sm cursor-pointer"
                        >
                          <option value="all">🌍 Tüm Mağaza</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                            <Filter size={14} />
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">
                        Min. Sepet (₺)
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
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">
                        Limit (Opsiyonel)
                      </label>
                      <input
                        type="number"
                        value={couponForm.usageLimit}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            usageLimit: Number(e.target.value),
                          })
                        }
                        placeholder="Limitsiz"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm placeholder:text-gray-300"
                      />
                    </div>
                </div>

                <button
                  onClick={handleCreateCoupon}
                  disabled={isPending}
                  className="w-full py-3.5 bg-gray-900 text-white rounded-xl hover:bg-black font-bold tracking-wide transition-all active:scale-[0.98] shadow-lg shadow-gray-900/20 flex justify-center items-center gap-2 group-disabled:opacity-70"
                >
                  {isPending ? <Loader2 className="animate-spin" size={18} /> : 
                     <>
                        <Zap size={18} className="text-yellow-400 fill-yellow-400" /> Kuponu Oluştur
                     </>
                  }
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE COUPONS LIST */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2 pl-1">
               Aktif Kuponlar • {coupons.length}
            </h3>
            
            {coupons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-300 rounded-2xl text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Ticket size={24} className="text-gray-400" />
                </div>
                <h4 className="text-gray-900 font-semibold text-lg">Hediye Zamanı!</h4>
                <p className="text-gray-500 text-sm max-w-xs mt-1">
                   Henüz hiç kupon oluşturmadınız. Sol taraftaki formdan müşterilerinizi sevindirecek ilk kuponu yaratın.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:-translate-y-0.5"
                  >
                    {/* Gradient Bar */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-600" />
                    
                    <div className="p-5 pl-7 flex flex-col justify-between h-full">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${coupon.type === 'PERCENTAGE' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                                    {coupon.type === "PERCENTAGE" ? `%` : `₺`}
                                </span>
                                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                                    {coupon.category ? coupon.category.name : 'Tüm Mağaza'}
                                </span>
                             </div>
                             <div 
                                onClick={() => copyToClipboard(coupon.code)}
                                className="font-mono text-2xl font-black text-gray-900 tracking-tight cursor-pointer hover:text-indigo-600 transition-colors flex items-center gap-2 group/code"
                                title="Kopyalamak için tıkla"
                             >
                                {coupon.code}
                                <Copy size={14} className="opacity-0 group-hover/code:opacity-100 transition-opacity text-indigo-400" />
                             </div>
                          </div>
                          
                          <div className="text-right">
                             <span className="block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                {coupon.type === "PERCENTAGE" ? `%${coupon.value}` : `₺${coupon.value}`}
                             </span>
                             <span className="text-[10px] font-bold text-gray-400 uppercase">İndirim</span>
                          </div>
                       </div>
                       
                       <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                              {coupon.usageLimit && (
                                <div className="flex items-center gap-1 text-orange-500" title="Kullanım Limiti">
                                    <AlertCircle size={12} /> {coupon.usedCount}/{coupon.usageLimit}
                                </div>
                              )}
                              <div className="flex items-center gap-1" title="Minimum Tutar">
                                 <AlertCircle size={12} /> {coupon.minAmount}₺ Alt.
                              </div>
                              <div className="flex items-center gap-1" title="Oluşturulma">
                                 <Calendar size={12} /> {new Date(coupon.createdAt).toLocaleDateString('tr-TR')}
                              </div>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            disabled={isPending}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group/trash"
                            title="Kuponu Sil"
                          >
                            <Trash2 size={16} className="group-hover/trash:scale-110 transition-transform" />
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TOPLU İNDİRİM SEKMESİ --- */}
      {activeTab === "bulk" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* APPLY DISCOUNT CARD */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-[#0F172A] text-white">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
             
             <div className="relative z-10 p-8 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-14 h-14 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 rotate-3">
                      <Zap size={28} className="text-white fill-white" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black tracking-tight">Flaş Kampanya Başlat</h2>
                      <p className="text-indigo-200 text-sm font-medium">Kitlelere özel anlık indirimler tanımlayın.</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                         <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-2 block">Hedef Kategori</label>
                         <select
                            value={bulkForm.categoryId}
                            onChange={(e) => setBulkForm({ ...bulkForm, categoryId: e.target.value, brandId: "all" })}
                            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white focus:bg-white/20 outline-none transition-colors cursor-pointer"
                         >
                            <option className="text-gray-900" value="all">🌍 Tüm Mağaza</option>
                            {categories.map((c) => (
                               <option className="text-gray-900" key={c.id} value={c.id}>{c.name}</option>
                            ))}
                         </select>
                      </div>
                      
                      <div className="col-span-2 md:col-span-1">
                         <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-2 block">Hedef Marka</label>
                         <select
                            value={bulkForm.brandId}
                            onChange={(e) => setBulkForm({ ...bulkForm, brandId: e.target.value })}
                            disabled={availableBrands.length === 0}
                            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white focus:bg-white/20 outline-none transition-colors cursor-pointer disabled:opacity-50"
                         >
                            <option className="text-gray-900" value="all">⭐ Tümü</option>
                            {availableBrands.map((b) => (
                               <option className="text-gray-900" key={b.id} value={b.id}>{b.name}</option>
                            ))}
                         </select>
                      </div>

                      <div className="col-span-2 md:col-span-1">
                         <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-2 block">İndirim Oranı</label>
                         <div className="relative">
                            <input
                               type="number"
                               value={bulkForm.percentage}
                               onChange={(e) => setBulkForm({ ...bulkForm, percentage: Number(e.target.value) })}
                               className="w-full pl-4 pr-10 py-3 bg-white/10 border border-white/10 rounded-xl text-white font-bold text-lg focus:bg-white/20 outline-none transition-colors"
                            />
                            <Percent size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300" />
                         </div>
                      </div>
                   </div>

                   <button
                      onClick={handleApplyBulk}
                      disabled={isPending}
                      className="w-full py-4 bg-white text-indigo-900 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 mt-4"
                   >
                      {isPending ? <Loader2 className="animate-spin" /> : "İndirimi Uygula"}
                   </button>
                </div>
             </div>
          </div>

          {/* REMOVE DISCOUNT CARD */}
          <div className="flex flex-col justify-center items-center p-10 bg-white border border-gray-200 rounded-3xl shadow-sm text-center relative overflow-hidden">
             <div className="space-y-6 relative z-10 max-w-sm">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-2 animate-in zoom-in duration-300">
                   <RotateCcw size={32} className="text-rose-500" />
                </div>
                
                <div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Normale Dön</h3>
                   <p className="text-gray-500 text-sm leading-relaxed">
                      Seçili kategori veya markadaki tüm ürünlerin fiyatlarını orijinal haline getirir. İndirim dönemi bittiğinde kullanın.
                   </p>
                </div>

                <div className="w-full space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <select
                        value={bulkForm.categoryId}
                        onChange={(e) => setBulkForm({ ...bulkForm, categoryId: e.target.value, brandId: "all" })}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                    >
                        <option value="all">Tüm Mağaza</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button
                        onClick={handleRemoveBulk}
                        disabled={isPending}
                        className="w-full py-2.5 bg-rose-500 text-white rounded-lg font-bold text-sm hover:bg-rose-600 transition-colors shadow-md shadow-rose-200"
                    >
                        {isPending ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Seçili İndirimleri Kaldır"}
                    </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
