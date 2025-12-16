"use client";

import useCart from "@/hooks/use-cart";
import { createOrder } from "@/lib/actions/order-actions";
// 👇 Yeni action'ı import et
import { getUserAddresses } from "@/lib/actions/user-actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Lock,
  ShieldCheck,
  Wallet,
  Loader2,
  Wifi,
  Plus,
  Home,
} from "lucide-react";

type CheckoutStep = "ADDRESS" | "PAYMENT";

// Adres Tipi (Veritabanı şemana uygun)
interface Address {
  id: string;
  title: string;
  city: string;
  district: string;
  addressLine: string;
}

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("ADDRESS");
  const [mounted, setMounted] = useState(false);

  // 🟢 YENİ STATE'LER
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "NEW">(
    "NEW"
  );
  const [isFlipped, setIsFlipped] = useState(false);

  // Form State'leri
  const [addressData, setAddressData] = useState({
    title: "",
    city: "",
    district: "",
    fullAddress: "",
  });

  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  // 🟢 SAYFA YÜKLENİRKEN ADRESLERİ ÇEK
  useEffect(() => {
    setMounted(true);
    async function fetchAddresses() {
      if (session?.user) {
        const addresses = await getUserAddresses();
        setSavedAddresses(addresses);

        // Eğer kayıtlı adres varsa ilkini seçili yap
        if (addresses.length > 0) {
          selectAddress(addresses[0]);
        }
      }
    }
    fetchAddresses();
  }, [session]);

  // Adres Seçme Yardımcısı
  const selectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setAddressData({
      title: addr.title,
      city: addr.city,
      district: addr.district,
      fullAddress: addr.addressLine,
    });
  };

  const total = cart.items.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  // Kart Numarası Render (Değişmedi)
  const renderCardNumber = (isGhost = false) => {
    const rawValue = paymentData.cardNumber.replace(/\D/g, "");
    const groups = [0, 1, 2, 3];
    return (
      <div
        className={`flex items-center justify-center gap-3 sm:gap-4 w-full font-mono font-bold mt-4 ${isGhost ? "text-gray-400 opacity-30 text-sm sm:text-base" : "text-gray-800 text-lg sm:text-xl"}`}
      >
        {groups.map((groupIndex) => (
          <div key={groupIndex} className="flex gap-[1px] sm:gap-[2px]">
            {[0, 1, 2, 3].map((bitIndex) => (
              <span
                key={groupIndex * 4 + bitIndex}
                className="w-[10px] sm:w-[12px] text-center flex justify-center"
              >
                {rawValue[groupIndex * 4 + bitIndex] || (
                  <span
                    className={`${isGhost ? "" : "text-gray-300"} text-sm align-middle`}
                  >
                    •
                  </span>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressData.city || !addressData.fullAddress) {
      toast.error("Lütfen adres bilgilerini eksiksiz doldurun.");
      return;
    }
    setStep("PAYMENT");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedAddress = `
      ${addressData.title ? `(${addressData.title}) ` : ""}
      ${addressData.fullAddress}
      ${addressData.district} / ${addressData.city}
    `.trim();

    const cartPayload = cart.items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: Number(item.price),
    }));

    try {
      const result = await createOrder(cartPayload, total, formattedAddress);
      if (result.success) {
        cart.removeAll();
        toast.success("Siparişiniz alındı! Yönlendiriliyorsunuz... 🎉");
        if (result.orderId) router.push(`/orders/success/${result.orderId}`);
        else router.push("/profile/orders");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Helper Inputs
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    setPaymentData({
      ...paymentData,
      cardNumber: value.replace(/(\d{4})(?=\d)/g, "$1 "),
    });
  };
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2);
    setPaymentData({ ...paymentData, expiry: value });
  };

  if (!mounted) return null;
  if (cart.items.length === 0)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        Sepetiniz boş.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-[#F8F9FA] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Güvenli Ödeme
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <ShieldCheck size={16} className="text-green-600" />
          <span>256-Bit SSL ile korunmaktadır</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
        {/* SOL KOLON */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. ADRES ADIMI */}
          <div
            className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all duration-300 ${step === "ADDRESS" ? "border-[#667EEA] ring-1 ring-[#667EEA]/30" : "border-gray-100 opacity-60"}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step === "ADDRESS" ? "bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white shadow-lg shadow-[#667EEA]/30" : "bg-green-100 text-green-700"}`}
                >
                  {step === "PAYMENT" ? <CheckCircle2 size={24} /> : "1"}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Teslimat Adresi
                </h2>
              </div>
              {step === "PAYMENT" && (
                <button
                  onClick={() => setStep("ADDRESS")}
                  className="text-sm font-semibold text-[#667EEA] hover:underline"
                >
                  Düzenle
                </button>
              )}
            </div>

            {step === "ADDRESS" ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                {/* 🟢 KAYITLI ADRESLER LİSTESİ */}
                {savedAddresses.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => selectAddress(addr)}
                        className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 relative group
                          ${
                            selectedAddressId === addr.id
                              ? "border-[#667EEA] bg-indigo-50/30"
                              : "border-gray-100 hover:border-gray-300 bg-white"
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full ${selectedAddressId === addr.id ? "bg-[#667EEA] text-white" : "bg-gray-100 text-gray-400"}`}
                          >
                            <Home size={18} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-bold text-gray-900">
                                {addr.title}
                              </h4>
                              {selectedAddressId === addr.id && (
                                <CheckCircle2
                                  size={18}
                                  className="text-[#667EEA]"
                                />
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {addr.addressLine}
                            </p>
                            <p className="text-xs font-bold text-gray-400 mt-1 uppercase">
                              {addr.district} / {addr.city}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Yeni Adres Ekleme Butonu */}
                    <div
                      onClick={() => {
                        setSelectedAddressId("NEW");
                        setAddressData({
                          title: "",
                          city: "",
                          district: "",
                          fullAddress: "",
                        });
                      }}
                      className={`cursor-pointer p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all min-h-[120px]
                        ${
                          selectedAddressId === "NEW"
                            ? "border-[#667EEA] bg-indigo-50/30 text-[#667EEA]"
                            : "border-gray-200 hover:border-[#667EEA] hover:text-[#667EEA] text-gray-400 bg-gray-50/50"
                        }`}
                    >
                      <Plus size={24} />
                      <span className="font-bold text-sm">Yeni Adres Ekle</span>
                    </div>
                  </div>
                )}

                {/* ADRES FORMU (Yeni Eklenecekse veya Düzenlenecekse) */}
                <form onSubmit={handleAddressSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1">
                        ADRES BAŞLIĞI
                      </label>
                      <div className="relative">
                        <MapPin
                          className="absolute left-3 top-3.5 text-gray-400"
                          size={18}
                        />
                        <input
                          required
                          placeholder="Örn: Evim, İşyeri"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#667EEA] focus:border-transparent outline-none transition-all"
                          value={addressData.title}
                          onChange={(e) =>
                            setAddressData({
                              ...addressData,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1">
                        ŞEHİR
                      </label>
                      <input
                        required
                        placeholder="Örn: İstanbul"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#667EEA] focus:border-transparent outline-none transition-all"
                        value={addressData.city}
                        onChange={(e) =>
                          setAddressData({
                            ...addressData,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">
                      İLÇE / SEMT
                    </label>
                    <input
                      required
                      placeholder="Örn: Kadıköy"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#667EEA] focus:border-transparent outline-none transition-all"
                      value={addressData.district}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          district: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">
                      AÇIK ADRES
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Mahalle, Sokak, Bina No, Daire..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#667EEA] focus:border-transparent outline-none resize-none transition-all"
                      value={addressData.fullAddress}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          fullAddress: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-[#667EEA]/30 transition-all flex items-center gap-2 hover:translate-x-1"
                    >
                      Kaydet ve Devam Et <ChevronRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600 flex items-center gap-3">
                <div className="p-2 bg-white rounded-full border border-gray-200">
                  <MapPin size={18} className="text-[#667EEA]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-0.5">
                    {addressData.title}
                  </p>
                  <p>
                    {addressData.fullAddress} - {addressData.district}/
                    {addressData.city}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 2. ÖDEME ADIMI */}
          <div
            className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all duration-300 ${step === "PAYMENT" ? "border-[#667EEA] ring-1 ring-[#667EEA]/30 opacity-100" : "border-gray-100"}`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step === "PAYMENT" ? "bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white shadow-lg shadow-[#667EEA]/30" : "bg-gray-100 text-gray-400"}`}
              >
                2
              </div>
              <h2
                className={`text-xl font-bold ${step === "PAYMENT" ? "text-gray-900" : "text-gray-400"}`}
              >
                Ödeme Yöntemi
              </h2>
            </div>

            {step === "PAYMENT" && (
              <form
                onSubmit={handleFinalSubmit}
                className="animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="flex flex-col-reverse md:flex-row gap-8">
                  {/* --- SOL: INPUTLAR --- */}
                  <div className="flex-1 space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1">
                        KART ÜZERİNDEKİ İSİM
                      </label>
                      <input
                        required
                        placeholder="AD SOYAD"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#667EEA] outline-none uppercase"
                        value={paymentData.cardName}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            cardName: e.target.value.toUpperCase(),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1">
                        KART NUMARASI
                      </label>
                      <div className="relative">
                        <CreditCard
                          className="absolute left-3 top-3.5 text-gray-400"
                          size={18}
                        />
                        <input
                          required
                          placeholder="0000 0000 0000 0000"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#667EEA] outline-none font-mono"
                          value={paymentData.cardNumber}
                          onChange={handleCardNumberChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-1">
                          SKT (AA/YY)
                        </label>
                        <input
                          required
                          placeholder="AA/YY"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#667EEA] outline-none text-center"
                          value={paymentData.expiry}
                          onChange={handleExpiryChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-1">
                          CVC
                        </label>
                        <div className="relative">
                          <input
                            required
                            maxLength={3}
                            type="password"
                            placeholder="123"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#667EEA] outline-none text-center"
                            value={paymentData.cvc}
                            onChange={(e) =>
                              setPaymentData({
                                ...paymentData,
                                cvc: e.target.value.replace(/\D/g, ""),
                              })
                            }
                            onFocus={() => setIsFlipped(true)}
                            onBlur={() => setIsFlipped(false)}
                          />
                          <Lock
                            className="absolute right-3 top-3.5 text-gray-400"
                            size={16}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --- SAĞ: DÖNEN KART GÖRSELİ --- */}
                  <div className="md:w-80 flex-shrink-0 [perspective:1000px]">
                    <div
                      className={`relative w-full aspect-[1.58/1] transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
                    >
                      {/* ÖN YÜZ */}
                      <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl p-6 shadow-2xl overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-200 border border-gray-100 flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gray-300/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="flex justify-between items-start relative z-10">
                          <div className="w-12 h-9 bg-yellow-500/20 border border-yellow-600/30 rounded-md flex items-center justify-center">
                            <div className="w-8 h-5 border border-yellow-600/40 rounded-sm grid grid-cols-2"></div>
                          </div>
                          <Wifi size={24} className="text-gray-400 rotate-90" />
                        </div>
                        <div className="relative z-10">
                          {renderCardNumber(false)}
                        </div>
                        <div className="flex justify-between items-end relative z-10">
                          <div className="flex-1 mr-4">
                            <div className="text-[9px] text-gray-400 font-bold mb-0.5 tracking-wider">
                              CARD HOLDER
                            </div>
                            <div className="text-sm font-bold tracking-wide uppercase truncate text-gray-800">
                              {paymentData.cardName || "AD SOYAD"}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[9px] text-gray-400 font-bold mb-0.5 tracking-wider">
                              EXPIRES
                            </div>
                            <div className="text-sm font-bold tracking-wide text-gray-800">
                              {paymentData.expiry || "AA/YY"}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* ARKA YÜZ */}
                      <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-200 border border-gray-100">
                        <div className="absolute inset-0 p-6 flex flex-col justify-between [transform:scaleX(-1)] pointer-events-none opacity-20">
                          <div className="mt-14">{renderCardNumber(true)}</div>
                          <div className="flex justify-between items-end">
                            <div className="flex-1 mr-4">
                              <div className="text-sm font-bold tracking-wide uppercase truncate text-gray-400">
                                {paymentData.cardName || "AD SOYAD"}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold tracking-wide text-gray-400">
                                {paymentData.expiry || "AA/YY"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full h-12 bg-gray-800 mt-6 relative z-10"></div>
                        <div className="px-6 mt-6 relative z-10">
                          <div className="text-[10px] font-bold text-gray-400 mb-1 text-right mr-2">
                            CVC
                          </div>
                          <div className="flex items-center">
                            <div className="flex-1 h-10 bg-white/50 border border-gray-200 pattern-grid-lg rounded-l-md"></div>
                            <div className="bg-white text-gray-900 font-mono font-bold text-lg h-10 px-3 flex items-center justify-center rounded-r-md border border-l-0 border-gray-200 min-w-[50px]">
                              {paymentData.cvc || "***"}
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-6 right-6 z-10">
                          <ShieldCheck
                            size={32}
                            className="text-gray-300 opacity-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Uyarı & Buton */}
                <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                  <div className="p-1 bg-blue-100 rounded-full text-blue-600 mt-0.5">
                    <Lock size={14} />
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Bu bir demo ödeme sayfasıdır. Kart bilgileriniz sunucuya
                    kaydedilmez.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#667EEA]/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" /> Ödeme Alınıyor...
                    </>
                  ) : (
                    <>
                      <span>Siparişi Tamamla</span>
                      <ShieldCheck size={20} className="opacity-80" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* SAĞ KOLON: Özet */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Sipariş Özeti
            </h3>
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-2">
                  <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      x{item.quantity}
                    </p>
                  </div>
                  <div className="font-bold text-sm text-gray-900">
                    {(Number(item.price) * item.quantity).toLocaleString(
                      "tr-TR",
                      { minimumFractionDigits: 2 }
                    )}{" "}
                    ₺
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-bold text-lg text-gray-900">Toplam</span>
              <span className="font-black text-2xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
                {total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
              </span>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock size={12} />
              <span>Güvenli ödeme altyapısı</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
