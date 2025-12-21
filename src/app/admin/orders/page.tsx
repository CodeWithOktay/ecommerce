// app/admin/orders/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Eye, ShoppingBag, Clock, CreditCard } from "lucide-react";
import OrderStatusUpdater from "@/components/features/order/order-status-updater";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      _count: { select: { items: true } },
    },
  });

  // Basit İstatistikler
  const totalRevenue = orders.reduce(
    (acc, order) => acc + Number(order.total),
    0
  );
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50">
      {/* --- HEADER & İSTATİSTİKLER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Sipariş Yönetimi
          </h1>
          <p className="text-gray-500 mt-1">
            Tüm siparişleri buradan takip edip yönetebilirsiniz.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">
                Toplam Ciro
              </p>
              <p className="text-lg font-black text-gray-900">
                {totalRevenue.toLocaleString("tr-TR")} ₺
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">
                Bekleyen
              </p>
              <p className="text-lg font-black text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- TABLO --- */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 uppercase font-bold text-xs tracking-wider">
              {/* 🟢 DÜZELTME: tr içinde sadece th var, yorum satırı veya boşluk yok */}
              <tr>
                <th className="p-5 pl-8">Sipariş No</th>
                <th className="p-5">Müşteri</th>
                <th className="p-5">Tarih</th>
                <th className="p-5 text-center">Adet</th>
                <th className="p-5">Tutar</th>
                <th className="p-5 w-[220px]">Durum</th>
                <th className="p-5 text-right pr-8">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  {/* ID */}
                  <td className="p-5 pl-8">
                    <span className="font-mono font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs">
                      #{order.id.slice(-6).toUpperCase()}
                    </span>
                  </td>

                  {/* MÜŞTERİ */}
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">
                        {order.user
                          ? `${order.user.firstName} ${order.user.lastName}`
                          : order.customerName || "Misafir"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {order.userId ? "Üye Müşteri" : "Misafir"}
                      </span>
                    </div>
                  </td>

                  {/* TARİH */}
                  <td className="p-5 text-gray-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  {/* ADET */}
                  <td className="p-5 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-50 rounded-full text-gray-600 font-bold border border-gray-100">
                      {order._count.items}
                    </div>
                  </td>

                  {/* TUTAR */}
                  <td className="p-5">
                    <span className="font-black text-gray-900 text-base">
                      {Number(order.total).toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      ₺
                    </span>
                  </td>

                  {/* DURUM GÜNCELLEME */}
                  <td className="p-5">
                    <div className="w-[180px]">
                      <OrderStatusUpdater
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </div>
                  </td>

                  {/* İNCELE BUTONU */}
                  <td className="p-5 text-right pr-8">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center justify-center p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-95"
                      title="Detayları Gör"
                    >
                      <Eye size={20} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="opacity-20" />
            </div>
            <p className="font-medium">Henüz hiç sipariş yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
