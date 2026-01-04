"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/lib/actions/order";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Printer,
  Truck,
  User,
  CheckCircle2,
  Undo2,
  Ban,
  Loader2,
  Mail,
  Phone,
  AlertTriangle,
} from "lucide-react";

interface OrderDetailClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  order: any; // Type this properly if possible, or use the inferred type from page
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Bekliyor",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargolandı",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
  REFUNDED: "İade Edildi",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
  REFUNDED: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function OrderDetailClient({ order }: OrderDetailClientProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const getNextStatus = (status: OrderStatus): OrderStatus | null => {
    if (status === "PENDING") return "PROCESSING";
    if (status === "PROCESSING") return "SHIPPED";
    if (status === "SHIPPED") return "DELIVERED";
    return null;
  };

  const getPrevStatus = (status: OrderStatus): OrderStatus | null => {
    if (status === "DELIVERED") return "PROCESSING"; // Or SHIPPED ? Usually Delivered -> Return or mistake fix
    if (status === "SHIPPED") return "PROCESSING";
    if (status === "PROCESSING") return "PENDING";
    return null;
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      router.refresh();
    } catch {
      alert("Hata oluştu.");
    } finally {
      setIsUpdating(false);
    }
  };

  const nextStatus = getNextStatus(order.status);
  const prevStatus = getPrevStatus(order.status);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Sipariş #{order.id.slice(-6).toUpperCase()}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  STATUS_COLORS[order.status] || "bg-gray-100"
                }`}
              >
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <Calendar size={14} />
              {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-end">
            {/* Actions for active orders */}
          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
             <>
                 {prevStatus && (
                     <button
                        onClick={() => handleStatusUpdate(prevStatus)}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                     >
                         <Undo2 size={16} /> Geri Al
                     </button>
                 )}
                 {nextStatus && (
                    <button
                        onClick={() => handleStatusUpdate(nextStatus)}
                        disabled={isUpdating}
                        className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2 text-sm"
                    >
                        {isUpdating ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                        {STATUS_LABELS[nextStatus]}a Geç
                    </button>
                 )}
                 <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-2 text-sm"
                 >
                    <Ban size={16} /> İptal
                 </button>
             </>
          )}

          {/* PRINT BUTTON */}
          <button className="p-2 bg-white border border-gray-200 text-gray-500 hover:text-gray-900 rounded-xl transition-colors">
            <Printer size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN - ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Package className="text-indigo-500" size={20} />
                Sipariş İçeriği
              </h3>
              <span className="text-sm font-medium text-gray-500">
                {order.items.length} Ürün
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {order.items.map((item: any) => (
                <div key={item.id} className="p-6 flex gap-6">
                  <div className="relative w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                     {item.product.images[0] && (
                        <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                        />
                     )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2">
                        {/* Variant info could go here if available */}
                       Ürün Kodu: {item.product.id.slice(-6).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-bold text-gray-700">
                            x{item.quantity}
                        </span>
                        <span className="font-bold text-indigo-600">
                            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(item.price)}
                        </span>
                    </div>
                  </div>
                  <div className="text-right font-black text-gray-900 text-lg">
                    {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-6 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Ara Toplam</span>
                    <span className="font-medium">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(order.total)}</span>
                </div>
                 <div className="flex justify-between text-sm text-gray-600">
                    <span>Kargo</span>
                    <span className="font-medium">Ücretsiz</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between items-end">
                    <span className="font-bold text-gray-900">Toplam Tutar</span>
                    <span className="text-2xl font-black text-indigo-600">
                         {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(order.total)}
                    </span>
                </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - INFO */}
        <div className="space-y-6">
            {/* CUSTOMER */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
                <User className="text-indigo-500" size={20} />
                Müşteri Bilgileri
            </h3>
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                        {order.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.userId ? "Kayıtlı Müşteri" : "Misafir"}</p>
                    </div>
                </div>
                <div className="space-y-3 pt-2">
                     <a href={`mailto:${order.customerEmail}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-indigo-600 transition-colors p-2 hover:bg-gray-50 rounded-lg">
                        <Mail size={16} />
                        {order.customerEmail}
                     </a>
                     <a href={`tel:${order.customerPhone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-indigo-600 transition-colors p-2 hover:bg-gray-50 rounded-lg">
                        <Phone size={16} />
                        {order.customerPhone || "Telefon Yok"}
                     </a>
                </div>
            </div>
          </div>

          {/* SHIPPING & BILLING */}
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
                <Truck className="text-indigo-500" size={20} />
                Teslimat Bilgileri
            </h3>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <MapPin className="text-gray-400 mt-1 shrink-0" size={18} />
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {order.address}
                </p>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
                <CreditCard className="text-indigo-500" size={20} />
                Ödeme Detayı
            </h3>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                    <CreditCard size={20} />
                </div>
                <div>
                     <p className="text-xs font-bold text-emerald-800 uppercase">Kredi Kartı / Iyzico</p>
                     <p className="text-xs text-emerald-600">Ödeme başarıyla alındı</p>
                </div>
            </div>
          </div>
        </div>
      </div>

       {/* CANCEL MODAL */}
       {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Siparişi İptal Et?</h3>
            <p className="text-gray-500 mb-6 text-sm">
                Bu siparişi kalıcı olarak iptal etmek istediğinize emin misiniz?
            </p>
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => setShowCancelModal(false)}
                    className="py-3 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                    Vazgeç
                </button>
                <button
                     onClick={() => {
                        handleStatusUpdate("CANCELLED");
                        setShowCancelModal(false);
                     }}
                    className="py-3 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                >
                    İptal Et
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
