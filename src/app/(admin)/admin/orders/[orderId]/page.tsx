// app/admin/orders/[orderId]/page.tsx
import { prisma } from "@/lib/prisma-client";
import Link from "next/link";
import Image from "next/image";
import OrderStatusUpdater from "@/components/order/OrderStatusUpdater";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Mail,
  Package,
  RefreshCcw,
  User,
  MapPin,
} from "lucide-react";

// Durumların Türkçe Karşılıkları ve Renkleri
const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-700" },
  PROCESSING: { label: "Hazırlanıyor", color: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "Kargolandı", color: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "İptal Edildi", color: "bg-red-100 text-red-700" },
};

export default async function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  // Next.js 15+ için params await edilmeli
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: {
        include: {
          // 🟢 KRİTİK DÜZELTME: Resimlerin gelmesi için burayı ekledik
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
        <Package size={48} className="mb-4 opacity-20" />
        <p>Sipariş bulunamadı.</p>
        <Link
          href="/admin/orders"
          className="text-blue-600 mt-2 hover:underline"
        >
          Listeye Dön
        </Link>
      </div>
    );
  }

  const currentStatus = statusMap[order.status] || {
    label: order.status,
    color: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft size={16} /> Siparişlere Dön
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              #{order.id.slice(-8).toUpperCase()}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${currentStatus.color}`}
            >
              {currentStatus.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
          <Calendar size={16} className="text-gray-400" />
          <span>{new Date(order.createdAt).toLocaleString("tr-TR")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- SOL KOLON: ÜRÜNLER --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Package size={18} className="text-[#667EEA]" />
                Sipariş İçeriği
              </h2>
              <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                {order.items.length} Ürün
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {order.items.map((item) => {
                // Resim kontrolü: Array var mı, varsa ilk elemanın url'i var mı?
                const imageUrl =
                  item.product?.images?.[0]?.url || "/placeholder.png";

                return (
                  <div
                    key={item.id}
                    className="p-6 flex gap-6 items-center hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.product?.name || "Ürün silinmiş"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">
                        {item.product?.name || (
                          <span className="text-red-500">Silinmiş Ürün</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Birim Fiyat:{" "}
                        {Number(item.price).toLocaleString("tr-TR")} ₺
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm text-gray-500 mb-1">
                        x{item.quantity}
                      </span>
                      <span className="block font-bold text-lg text-gray-900">
                        {(Number(item.price) * item.quantity).toLocaleString(
                          "tr-TR"
                        )}{" "}
                        ₺
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <div className="text-right space-y-1">
                <p className="text-sm text-gray-500">Genel Toplam</p>
                <p className="text-3xl font-black text-gray-900 bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
                  {Number(order.total).toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  ₺
                </p>
              </div>
            </div>
          </div>

          {/* Adres Bilgisi (Veritabanında Adres string olarak tutuluyorsa) */}
          {/* Eğer ayrı bir modelse oradan çekmek gerekir, şimdilik address string varsayımı: */}
          {order.address && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-[#667EEA]" />
                Teslimat Adresi
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {order.address}
              </p>
            </div>
          )}
        </div>

        {/* --- SAĞ KOLON: MÜŞTERİ & YÖNETİM --- */}
        <div className="space-y-6">
          {/* Durum Güncelleme */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <RefreshCcw size={18} className="text-[#667EEA]" />
              Sipariş Durumu
            </h3>
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
          </div>

          {/* Müşteri Kartı */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-[#667EEA]" />
              Müşteri Bilgileri
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100">
                {(
                  order.user?.firstName?.[0] ||
                  order.customerName?.[0] ||
                  "M"
                ).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {order.user
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : order.customerName || "Misafir"}
                </p>
                <p className="text-xs text-gray-500">
                  {order.userId ? "Kayıtlı Müşteri" : "Misafir Alışverişi"}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                  <Mail size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">E-posta</span>
                  <span
                    className="font-medium text-gray-900 truncate max-w-[200px]"
                    title={order.user?.email || order.customerEmail || ""}
                  >
                    {order.user?.email || order.customerEmail}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                  <CreditCard size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Ödeme Yöntemi</span>
                  <span className="font-medium text-gray-900">
                    Kredi Kartı / Banka Kartı
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
