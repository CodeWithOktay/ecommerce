import { getUserOrders } from "@/lib/actions/order-actions";
import {
  Package,
  Calendar,
  ChevronRight,
  ShoppingBag,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CancelOrderButton from "@/components/order/CancelOrderButton";

export default async function OrdersPage() {
  const orders = await getUserOrders();

  // --- BOŞ SİPARİŞ DURUMU ---
  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
          <div className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
            <ShoppingBag size={40} />
          </div>
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Henüz siparişiniz yok
        </h2>
        <p className="text-gray-500 mt-2 mb-8 text-lg">
          Alışverişe başlayıp ilk siparişinizi oluşturun.
        </p>
        <Link
          href="/"
          className="px-8 py-4 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-[#667EEA]/30 hover:-translate-y-1 transition-all duration-300"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  // --- DURUM ROZETLERİ ---
  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; className: string; icon: any }
    > = {
      PENDING: {
        label: "Sipariş Alındı",
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Clock,
      },
      PROCESSING: {
        label: "Hazırlanıyor",
        className: "bg-purple-50 text-purple-700 border-purple-200", // Temaya uygun mor
        icon: Package,
      },
      SHIPPED: {
        label: "Kargoya Verildi",
        className: "bg-indigo-50 text-indigo-700 border-indigo-200", // Temaya uygun indigo
        icon: Truck,
      },
      DELIVERED: {
        label: "Teslim Edildi",
        className: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle2,
      },
      CANCELLED: {
        label: "İptal Edildi",
        className: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
      },
    };

    const info = statusMap[status] || {
      label: status,
      className: "bg-gray-50 text-gray-700 border-gray-200",
      icon: Package,
    };

    const Icon = info.icon;

    return (
      <span
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${info.className}`}
      >
        <Icon size={14} />
        {info.label}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Siparişlerim
        </h1>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Top. {orders.length} Sipariş
        </span>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50 hover:border-[#667EEA]/30 transition-all duration-300"
          >
            {/* Üst Bilgi Barı */}
            <div className="bg-gray-50/50 p-5 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                  <Calendar size={16} className="text-[#667EEA]" />
                  <span className="font-medium text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Durum Rozeti */}
                {getStatusBadge(order.status)}

                {/* Toplam Tutar (Gradient) */}
                <span className="text-lg font-black bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
                  {Number(order.total).toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  ₺
                </span>
              </div>
            </div>

            {/* İçerik ve Butonlar */}
            <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Ürün Görselleri */}
              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <div className="flex -space-x-4 pl-2">
                  {order.items.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="relative w-14 h-14 rounded-full border-[3px] border-white shadow-md bg-white overflow-hidden hover:scale-110 hover:z-10 transition-transform duration-300"
                    >
                      {item.product.images?.[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt="product"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-xs text-gray-400">
                          <ShoppingBag size={16} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {order.items.length > 4 && (
                  <span className="text-xs font-bold text-gray-400 ml-2">
                    +{order.items.length - 4} ürün daha
                  </span>
                )}
              </div>

              {/* Aksiyon Alanı */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* 🔴 İPTAL BUTONU */}
                <div className="flex-1 md:flex-none">
                  <CancelOrderButton orderId={order.id} status={order.status} />
                </div>

                {/* Detay Butonu (Gradient) */}
                <Link
                  href={`/orders/success/${order.id}`}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-[#667EEA]/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 group"
                >
                  Detaylar
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
