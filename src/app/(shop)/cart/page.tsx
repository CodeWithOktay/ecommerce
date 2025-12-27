"use client";

import useCart from "@/hooks/use-cart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Lock,
  Minus,
  Plus,
  Shield,
  ShoppingCart,
  Trash2,
  Truck,
  Loader2,
  Ban,
  ArrowRight,
  GitFork,
  TicketPercent,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/lib/utils/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, removeAll, getTotalItems } =
    useCart();

  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // --- KUPON STATE ---
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  const totalItems = getTotalItems();
  const isAdmin = session?.user?.role === "ADMIN";

  // --- KRİTİK HESAPLAMALAR ---
  const calculations = items.reduce(
    (acc, item) => {
      // 1. Ürünün Satış Fiyatı (İndirim varsa o, yoksa normal fiyat)
      const effectivePrice = item.salePrice
        ? Number(item.salePrice)
        : Number(item.price);

      // 2. Ürünün Liste Fiyatı (İndirimsiz orijinal fiyat)
      const listPrice = Number(item.price);

      acc.totalListPrice += listPrice * item.quantity; // Hiç indirim olmasaydı ödenecek tutar
      acc.totalPrice += effectivePrice * item.quantity; // Şu anki (kampanyalı) tutar

      return acc;
    },
    { totalListPrice: 0, totalPrice: 0 }
  );

  // Genel ürün indirimlerinden doğan kazanç (Liste Fiyatı - Satış Fiyatı)
  const productSavings = calculations.totalListPrice - calculations.totalPrice;

  // Kupondan doğan kazanç
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;

  // Son ödenecek tutar: (Şu anki Ürün Toplamı) - (Kupon İndirimi)
  const finalTotal = Math.max(0, calculations.totalPrice - couponDiscount);

  // Toplam cepte kalan para (Ürün İndirimi + Kupon İndirimi)
  const totalSavings = productSavings + couponDiscount;

  // --- KUPON İŞLEMLERİ (SİMÜLASYON) ---
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsCouponLoading(true);

    // Backend simülasyonu
    setTimeout(() => {
      if (couponCode.toLowerCase() === "kervan100") {
        setAppliedCoupon({ code: "KERVAN100", discount: 100 });
        toast.success("Kupon başarıyla uygulandı! 🎉");
      } else {
        toast.error("Geçersiz veya süresi dolmuş kupon kodu.");
        setAppliedCoupon(null);
      }
      setIsCouponLoading(false);
    }, 1000);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Kupon kaldırıldı.");
  };

  // --- ÖDEME İŞLEMİ ---
  const handleCheckout = () => {
    if (!session) {
      toast.error("Ödeme adımına geçmek için giriş yapmalısınız.");
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    if (isAdmin) {
      toast.error("Yöneticiler alışveriş yapamaz!");
      return;
    }

    setIsLoading(true);
    router.push("/checkout");
  };

  // --- BOŞ SEPET GÖRÜNÜMÜ ---
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-xl mb-8 animate-pulse-slow">
          <div className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
            <ShoppingCart
              size={80}
              strokeWidth={1.5}
              className="text-[#764BA2]"
            />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Sepetiniz Henüz Boş
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          İhtiyacınız olan ürünleri keşfetmek için mağazamıza göz atın.
        </p>

        <Link
          href="/"
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-[#667EEA] to-[#764BA2] rounded-2xl hover:shadow-lg hover:shadow-[#667EEA]/40 hover:-translate-y-1"
        >
          <span>Alışverişe Başla</span>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  // --- DOLU SEPET GÖRÜNÜMÜ ---
  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
              Alışveriş Sepeti
            </h1>
            <p className="text-gray-500 font-medium">
              <span className="text-[#764BA2] font-bold">
                {totalItems} ürün
              </span>{" "}
              sepetinizde bekliyor.
            </p>
          </div>
          <button
            onClick={removeAll}
            className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            Sepeti Temizle
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 xl:gap-12">
          {/* --- SOL TARA: ÜRÜN LİSTESİ --- */}
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => {
              // Ürün bazlı indirim kontrolü
              const hasDiscount =
                item.salePrice && Number(item.salePrice) < Number(item.price);
              const effectivePrice = hasDiscount
                ? Number(item.salePrice)
                : Number(item.price);

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:border-[#667EEA]/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex gap-6">
                    {/* Görsel */}
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ShoppingCart size={32} />
                        </div>
                      )}

                      {/* 🔥 İNDİRİM ROZETİ (Gradient Tema) */}
                      {hasDiscount && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          FIRSAT
                        </div>
                      )}
                    </div>

                    {/* İçerik */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <Link
                            href={`/products/${slugify(item.id)}`}
                            className="text-lg font-bold text-gray-900 hover:text-[#667EEA] transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>

                          {/* Varyant Bilgisi (Renk/Beden) */}
                          {(item.color || item.size) && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item.color && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-100">
                                  <div
                                    className="w-2 h-2 rounded-full border border-gray-200"
                                    style={{
                                      backgroundColor:
                                        item.color.toLowerCase() === "beyaz"
                                          ? "#fff"
                                          : item.color,
                                    }}
                                  />
                                  {item.color}
                                </span>
                              )}
                              {item.size && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-100">
                                  <GitFork
                                    size={10}
                                    className="text-gray-400"
                                  />
                                  {item.size}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      {/* Alt Bar: Miktar ve Fiyat */}
                      <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                        {/* Miktar */}
                        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
                          <button
                            onClick={() => {
                              if (item.quantity === 1) removeItem(item.id);
                              else updateQuantity(item.id, item.quantity - 1);
                            }}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-[#764BA2] transition-colors"
                          >
                            <Minus size={14} strokeWidth={3} />
                          </button>
                          <span className="w-10 text-center font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-[#667EEA] transition-colors"
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>

                        {/* Fiyat Alanı */}
                        <div className="text-right">
                          <div className="text-sm text-gray-400 font-medium mb-0.5">
                            Toplam
                          </div>
                          <div className="flex flex-col items-end">
                            {/* İndirim varsa eski fiyatı çiz */}
                            {hasDiscount && (
                              <span className="text-sm text-gray-400 line-through font-medium">
                                {(
                                  Number(item.price) * item.quantity
                                ).toLocaleString("tr-TR", {
                                  minimumFractionDigits: 2,
                                })}{" "}
                                ₺
                              </span>
                            )}

                            {/* Geçerli Fiyat - HER ZAMAN GRADIENT */}
                            <span className="text-xl font-black bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
                              {(effectivePrice * item.quantity).toLocaleString(
                                "tr-TR",
                                { minimumFractionDigits: 2 }
                              )}{" "}
                              ₺
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- SAĞ TARA: SİPARİŞ ÖZETİ --- */}
          <div className="lg:col-span-4">
            <div className="space-y-6 sticky top-24">
              {/* ✅ Kupon Alanı (Gradient Tema) */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TicketPercent size={18} className="text-[#667EEA]" />
                  İndirim Kuponu
                </h3>

                {appliedCoupon ? (
                  // Uygulanmış Kupon
                  <div className="bg-[#667EEA]/10 border border-[#667EEA]/20 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#667EEA]" />
                      <span className="text-sm font-bold text-[#764BA2]">
                        {appliedCoupon.code}
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-500 font-medium hover:underline"
                    >
                      Kaldır
                    </button>
                  </div>
                ) : (
                  // Kupon Giriş Formu
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Kupon kodu"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#667EEA]/50 uppercase font-medium placeholder-gray-400"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isCouponLoading || !couponCode}
                      className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-md hover:shadow-[#667EEA]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCouponLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        "Uygula"
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* ✅ Hesap Özeti */}
              <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-extrabold text-gray-900 mb-6">
                  Sipariş Özeti
                </h2>

                <div className="space-y-3 mb-8">
                  {/* Liste Fiyatı Toplamı */}
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Ürünler Liste Fiyatı</span>
                    <span className="font-medium ">
                      {calculations.totalListPrice.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      ₺
                    </span>
                  </div>

                  {/* Kargo */}
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Kargo</span>
                    <span className="text-green-600 font-bold">Ücretsiz</span>
                  </div>

                  {/* Kampanya İndirimleri (Gradient Text) */}
                  {productSavings > 0 && (
                    <div className="flex justify-between text-sm font-bold">
                      <span className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
                        Kampanya İndirimi
                      </span>
                      <span className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
                        -
                        {productSavings.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        ₺
                      </span>
                    </div>
                  )}

                  {/* Kupon İndirimi (Gradient Text) */}
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm font-bold">
                      <span className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
                        Kupon İndirimi ({appliedCoupon.code})
                      </span>
                      <span className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
                        -
                        {appliedCoupon.discount.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        ₺
                      </span>
                    </div>
                  )}

                  <div className="h-px bg-gray-100 my-4" />

                  {/* Toplam Kazanç Kutusu (Gradient BG) */}
                  {totalSavings > 0 && (
                    <div className="bg-[#667EEA]/10 rounded-xl p-3 text-center mb-4 border border-[#667EEA]/20 shadow-sm">
                      <span className="text-[#764BA2] text-sm font-extrabold flex items-center justify-center gap-2">
                        <TicketPercent size={18} />
                        Toplam Kazancınız:{" "}
                        {totalSavings.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        ₺
                      </span>
                    </div>
                  )}

                  {/* Genel Toplam */}
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-gray-900">
                      Genel Toplam
                    </span>
                    <div className="text-right">
                      <span className="block text-3xl font-black bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
                        {finalTotal.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        ₺
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        KDV Dahil
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ödeme Butonu */}
                {isAdmin ? (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center space-y-2">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm mx-auto">
                      <Ban size={20} strokeWidth={3} />
                    </div>
                    <h3 className="text-red-900 font-bold text-sm">
                      İşlem Kısıtlandı
                    </h3>
                    <p className="text-red-600 text-xs leading-relaxed">
                      Yönetici hesapları sipariş oluşturamaz.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg shadow-[#667EEA]/30 hover:shadow-[#667EEA]/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" />
                        Yönlendiriliyor...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Ödemeye Geç
                        <Truck className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                  </button>
                )}

                {/* Güvenlik İkonları */}
                <div className="mt-8 flex flex-col items-center gap-3">
                  <div className="flex gap-4 text-gray-300">
                    <Shield size={24} />
                    <Lock size={24} />
                  </div>
                  <p className="text-xs text-gray-400 font-medium text-center">
                    256-Bit SSL Sertifikası ile
                    <br />
                    %100 Güvenli Ödeme
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
