// src/components/admin/OrderStatusUpdater.tsx
"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/order";
import { RefreshCcw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

// Durumların Türkçe ve Renk Karşılıkları
const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Bekliyor", color: "bg-yellow-50 text-yellow-700" },
  PROCESSING: { label: "Hazırlanıyor", color: "bg-blue-50 text-blue-700" },
  SHIPPED: { label: "Kargolandı", color: "bg-purple-50 text-purple-700" },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-50 text-green-700" },
  CANCELLED: { label: "İptal Edildi", color: "bg-red-50 text-red-700" },
};

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: OrderStatusUpdaterProps) {
  const [isPending, startTransition] = useTransition();
  // State kullanıyoruz ki anlık değişim UI'da görünsün
  const [status, setStatus] = useState(currentStatus);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus); // UI'ı hemen güncelle

    startTransition(async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateOrderStatus(orderId, newStatus as any);
        toast.success(
          `Durum "${statusMap[newStatus].label}" olarak güncellendi`
        );
      } catch (error) {
        console.error("Sipariş durumu güncellenirken hata:", error);
        toast.error(
          `Güncelleme başarısız: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`
        );
        setStatus(currentStatus); // Hata olursa eski haline döndür
      }
    });
  };

  return (
    <div className="relative">
      <div className="relative w-full">
        <select
          disabled={isPending}
          value={status} // ✅ Controlled Component (State'e bağlı)
          onChange={handleChange}
          className={`
            w-full appearance-none border border-gray-200 text-gray-900 text-sm rounded-xl 
            focus:ring-[#667EEA] focus:border-[#667EEA] block p-3 pr-10 outline-none 
            transition-all cursor-pointer font-bold disabled:opacity-50
            ${statusMap[status]?.color || "bg-gray-50"}
          `}
        >
          {Object.entries(statusMap).map(([key, value]) => (
            <option key={key} value={key} className="bg-white text-gray-900">
              {value.label}
            </option>
          ))}
        </select>

        {/* Sağdaki İkon: Yükleniyor mu yoksa Sabit mi? */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          {isPending ? (
            <Loader2 size={18} className="animate-spin text-[#667EEA]" />
          ) : (
            <RefreshCcw size={16} />
          )}
        </div>
      </div>

      {/* İpucu metni */}
      <p className="text-[10px] text-gray-400 mt-2 text-center">
        Değiştirmek için seçin, otomatik kaydedilir.
      </p>
    </div>
  );
}
