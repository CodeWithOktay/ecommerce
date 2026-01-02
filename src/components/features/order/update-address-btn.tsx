"use client";

import { updateOrderAddress } from "@/lib/actions/order";
import { MapPin, Loader2, Save, X, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface UpdateAddressButtonProps {
  orderId: string;
  currentAddress: string | null;
  status: string;
}

export default function UpdateAddressButton({
  orderId,
  currentAddress,
  status,
}: UpdateAddressButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(currentAddress || "");

  // Sadece PENDING durumunda göster
  if (status !== "PENDING") return null;

  const handleUpdate = async () => {
    if (!address.trim()) {
      toast.error("Lütfen geçerli bir adres girin.");
      return;
    }

    setLoading(true);
    try {
      const result = await updateOrderAddress(orderId, address);

      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all active:scale-95"
      >
        <Pencil size={16} />
        Adresi Düzenle
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Başlık */}
            <div className="bg-indigo-50 p-6 flex items-start gap-4 border-b border-indigo-100">
              <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                <MapPin size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Teslimat Adresini Güncelle
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Siparişiniz henüz hazırlanmadığı için adresinizi değiştirebilirsiniz.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Yeni Adresiniz
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none text-sm text-gray-700"
                placeholder="Açık adresinizi buraya girin..."
              />
            </div>

            {/* Alt Butonlar */}
            <div className="p-6 pt-2 flex gap-3 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Vazgeç
              </button>

              <button
                onClick={handleUpdate}
                disabled={loading || !address.trim()}
                className="flex-1 py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
