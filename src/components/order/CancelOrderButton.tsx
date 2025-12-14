"use client";

import { cancelOrder } from "@/lib/actions/order-actions";
import { XCircle, Loader2, AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface CancelOrderButtonProps {
  orderId: string;
  status: string;
}

// 6 Adet Hazır İptal Nedeni
const REASONS = [
  "Yanlış ürün sipariş ettim",
  "Satın almaktan vazgeçtim",
  "Siparişimde değişiklik yapacağım",
  "Teslimat süresi çok uzun",
  "Daha uygun fiyatlısını buldum",
  "Ödeme yöntemini değiştirmek istiyorum",
  "Kargo adresini değiştirmek istiyorum",
];

export default function CancelOrderButton({
  orderId,
  status,
}: CancelOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false); // Modal açık mı?
  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  if (status !== "PENDING") return null;

  const handleConfirmCancel = async () => {
    if (!selectedReason) {
      toast.error("Lütfen bir iptal nedeni seçin.");
      return;
    }

    setLoading(true);
    try {
      // Server action'a nedeni de gönderiyoruz
      const result = await cancelOrder(orderId, selectedReason);

      if (result.success) {
        toast.success(result.message);
        setIsOpen(false); // Modalı kapat
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. TETİKLEYİCİ BUTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all active:scale-95"
      >
        <XCircle size={16} />
        İptal Et
      </button>

      {/* 2. MODAL (POP-UP) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Modal Kutusu */}
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Başlık */}
            <div className="bg-red-50 p-6 flex items-start gap-4 border-b border-red-100">
              <div className="p-3 bg-red-100 rounded-full text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Siparişi İptal Et
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Bu işlem geri alınamaz. Siparişi iptal etme nedeninizi
                  öğrenebilir miyiz?
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Seçenekler */}
            <div className="p-6 space-y-3">
              {REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                    ${
                      selectedReason === reason
                        ? "border-red-500 bg-red-50 text-red-700 font-medium ring-1 ring-red-500"
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
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
                onClick={handleConfirmCancel}
                disabled={loading || !selectedReason}
                className="flex-1 py-3 px-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    İptal Ediliyor...
                  </>
                ) : (
                  "Siparişi İptal Et"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
