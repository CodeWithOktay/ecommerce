import { getUserOrders } from "@/lib/actions/order-actions";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Calendar,
  ChevronRight,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

// Sipariş durumu çevirileri ve renkleri
const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  PENDING: {
    label: "Hazırlanıyor",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  SHIPPED: {
    label: "Kargolandı",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "Teslim Edildi",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "İptal Edildi",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
  // Varsayılan
  DEFAULT: {
    label: "İşlemde",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: Package,
  },
};

export default async function UserOrdersPage() {
  const orders = await getUserOrders();

  // Oturum yoksa login'e at (Aslında middleware veya layout korur ama garanti olsun)
  if (orders === null) {
    redirect("/login");
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
          <ShoppingBag size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Siparişlerim</h1>
          <p className="text-gray-500">
            Geçmiş siparişlerinizi buradan takip edebilirsiniz.
          </p>
        </div>
      </div>

      {/* Sipariş Yoksa Empty State */}
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Package className="text-gray-300 w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Henüz Siparişiniz Yok
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Hemen alışverişe başlayın, ihtiyacınız olan ürünleri kapınıza
            getirelim.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl"
          >
            Alışverişe Başla <ChevronRight size={18} />
          </Link>
        </div>
      ) : (
        /* Sipariş Listesi */
        <div className="space-y-6">
          {orders.map((order) => {
            // Config'den durumu al, yoksa default kullan
            const statusInfo =
              statusConfig[order.status] || statusConfig.DEFAULT;
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Kart Başlığı */}
                <div className="bg-gray-50/50 p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1 flex items-center gap-1">
                        <Calendar size={14} /> Sipariş Tarihi
                      </p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Toplam Tutar</p>
                      <p className="font-bold text-gray-900">
                        {Number(order.total).toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        ₺
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-gray-500 mb-1">Sipariş No</p>
                      <p className="font-mono text-gray-900">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${statusInfo.color}`}
                  >
                    <StatusIcon size={16} />
                    {statusInfo.label}
                  </div>
                </div>

                {/* Ürünler */}
                <div className="p-4 md:p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        {/* Resim */}
                        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                          {item.product && item.product.images[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package size={20} />
                            </div>
                          )}
                        </div>

                        {/* Detay */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 line-clamp-1">
                            {item.product ? item.product.name : "Silinmiş Ürün"}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {Number(item.price).toLocaleString("tr-TR")} ₺ x{" "}
                            {item.quantity} adet
                          </p>
                        </div>

                        {/* Ürün Linki (Varsa) */}
                        {item.product && (
                          <Link
                            href={`/urun/${item.product.id}`}
                            className="hidden sm:flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                          >
                            Ürüne Git
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alt Aksiyon (Detay Butonu eklenebilir) */}
                {/* <div className="p-4 border-t border-gray-100 bg-gray-50/30 text-right">
                   <button className="text-sm font-bold text-gray-900 hover:underline">Sipariş Detaylarını Gör</button>
                </div> */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
