"use client";

import useCart from "@/hooks/use-cart";
import { createOrder } from "@/lib/actions/checkout-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  MapPin,
  CreditCard,
  CheckCircle,
  ChevronRight,
  Lock,
} from "lucide-react";

// Adım Tanımları
type CheckoutStep = "ADDRESS" | "PAYMENT";

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("ADDRESS");

  // Form State'leri
  const [addressData, setAddressData] = useState({
    title: "Ev Adresim",
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

  // Sepet Toplamı
  const total = cart.items.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  // Adres Formu Submit
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("PAYMENT"); // Ödeme adımına geç
  };

  // Son Sipariş Submit
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Adresi düzgün bir formatta birleştiriyoruz
    const formattedAddress = `
      ${addressData.title}
      ${addressData.fullAddress}
      ${addressData.district} / ${addressData.city}
    `.trim();

    // Backend'e gönderilecek veri
    const orderData = cart.items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    // Server Action Çağır
    const result = await createOrder(orderData, formattedAddress);

    if (result.success) {
      cart.removeAll();
      router.push(`/orders/success/${result.orderId}`);
    } else {
      alert(result.message);
      setLoading(false);
    }
  };

  // Kart Numarası Formatlama (Görsel)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    }
    return value;
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
        Sepetiniz boş.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Güvenli Ödeme</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SOL KOLON: İşlem Adımları */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. ADIM: ADRES BİLGİLERİ */}
          <div
            className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${step === "ADDRESS" ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === "ADDRESS" ? "bg-black text-white" : "bg-green-100 text-green-700"}`}
              >
                {step === "PAYMENT" ? <CheckCircle size={20} /> : "1"}
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Teslimat Adresi
              </h2>
            </div>

            {/* Adres Formu (Sadece Adres adımındaysak göster) */}
            {step === "ADDRESS" ? (
              <form
                onSubmit={handleAddressSubmit}
                className="space-y-4 animate-in fade-in"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      ADRES BAŞLIĞI
                    </label>
                    <input
                      required
                      placeholder="Örn: Evim, İşyeri"
                      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                      value={addressData.title}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      ŞEHİR
                    </label>
                    <input
                      required
                      placeholder="İstanbul"
                      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                      value={addressData.city}
                      onChange={(e) =>
                        setAddressData({ ...addressData, city: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    İLÇE / SEMT
                  </label>
                  <input
                    required
                    placeholder="Kadıköy"
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                    value={addressData.district}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        district: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    AÇIK ADRES
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Mahalle, Sokak, Bina No, Daire..."
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none resize-none"
                    value={addressData.fullAddress}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        fullAddress: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center gap-2"
                  >
                    Ödemeye Geç <ChevronRight size={18} />
                  </button>
                </div>
              </form>
            ) : (
              // Adres Tamamlandıysa Özeti Göster
              <div className="text-gray-600 bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-black">{addressData.title}</p>
                  <p className="text-sm">
                    {addressData.fullAddress} - {addressData.district}/
                    {addressData.city}
                  </p>
                </div>
                <button
                  onClick={() => setStep("ADDRESS")}
                  className="text-sm text-blue-600 font-bold underline"
                >
                  Düzenle
                </button>
              </div>
            )}
          </div>

          {/* 2. ADIM: ÖDEME BİLGİLERİ */}
          <div
            className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${step === "PAYMENT" ? "border-blue-500 ring-1 ring-blue-500 opacity-100" : "border-gray-200 opacity-60"}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === "PAYMENT" ? "bg-black text-white" : "bg-gray-200 text-gray-500"}`}
              >
                2
              </div>
              <h2 className="text-xl font-bold text-gray-800">Ödeme Yöntemi</h2>
            </div>

            {step === "PAYMENT" && (
              <form
                onSubmit={handleFinalSubmit}
                className="space-y-5 animate-in fade-in"
              >
                {/* Kredi Kartı Görseli (Basit CSS ile) */}
                <div className="bg-gradient-to-r from-gray-800 to-black text-white p-6 rounded-xl shadow-lg mb-6 max-w-sm mx-auto">
                  <div className="flex justify-between items-center mb-8">
                    <div className="text-xs opacity-70">BANK CARD</div>
                    <CreditCard />
                  </div>
                  <div className="text-xl font-mono tracking-widest mb-4">
                    {paymentData.cardNumber || "**** **** **** ****"}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-70 mb-1">CARD HOLDER</div>
                      <div className="text-sm font-bold uppercase">
                        {paymentData.cardName || "AD SOYAD"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs opacity-70 mb-1">EXPIRES</div>
                      <div className="text-sm font-bold">
                        {paymentData.expiry || "MM/YY"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kart Bilgileri Inputları */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    KART ÜZERİNDEKİ İSİM
                  </label>
                  <input
                    required
                    placeholder="AD SOYAD"
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                    value={paymentData.cardName}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        cardName: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    KART NUMARASI
                  </label>
                  <input
                    required
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none font-mono"
                    value={paymentData.cardNumber}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        cardNumber: formatCardNumber(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      SON KULLANMA (AA/YY)
                    </label>
                    <input
                      required
                      maxLength={5}
                      placeholder="MM/YY"
                      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                      value={paymentData.expiry}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          expiry: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      CVC / CVV
                    </label>
                    <div className="relative">
                      <input
                        required
                        maxLength={3}
                        type="password"
                        placeholder="123"
                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                        value={paymentData.cvc}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            cvc: e.target.value,
                          })
                        }
                      />
                      <Lock className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-xs text-yellow-800 flex items-start gap-2">
                  <Lock size={14} className="mt-0.5" />
                  Bu bir simülasyondur. Gerçek para çekilmeyecektir. Test
                  verileriyle devam edebilirsiniz.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  {loading
                    ? "Sipariş Oluşturuluyor..."
                    : `Siparişi Tamamla (${total.toFixed(2)} ₺)`}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* SAĞ KOLON: Sipariş Özeti */}
        <div className="h-fit space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
            <h3 className="text-lg font-bold mb-4">Sipariş Özeti</h3>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-14 h-14 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-gray-500">x{item.quantity}</p>
                  </div>
                  <div className="font-semibold text-sm">
                    {(Number(item.price) * item.quantity).toFixed(2)} ₺
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam</span>
                <span>{total.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Kargo</span>
                <span className="text-green-600 font-bold">Ücretsiz</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Toplam</span>
                <span className="font-bold text-xl text-black">
                  {total.toFixed(2)} ₺
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
