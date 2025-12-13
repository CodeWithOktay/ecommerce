// app/admin/orders/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma-client";
import { Eye } from "lucide-react";

// Durum renkleri için yardımcı fonksiyon
const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "PAID":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "SHIPPED":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "DELIVERED":
      return "bg-green-100 text-green-800 border-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      _count: { select: { items: true } }, // Kaç parça ürün var?
    },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Siparişler</h1>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-gray-600 uppercase font-semibold">
            <tr>
              <th className="p-4">Sipariş No</th>
              <th className="p-4">Müşteri</th>
              <th className="p-4">Tarih</th>
              <th className="p-4">Ürün Sayısı</th>
              <th className="p-4">Tutar</th>
              <th className="p-4">Durum</th>
              <th className="p-4 text-right">İncele</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-mono text-gray-500">
                  #{order.id.slice(-6).toUpperCase()}
                </td>
                <td className="p-4 font-medium text-gray-900">
                  {order.user
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : order.customerName}
                </td>
                <td className="p-4 text-gray-600">
                  {order.createdAt.toLocaleDateString("tr-TR")}
                </td>
                <td className="p-4 text-center w-24">{order._count.items}</td>
                <td className="p-4 font-bold text-gray-900">
                  {Number(order.total).toFixed(2)} ₺
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition"
                  >
                    <Eye size={20} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            Henüz hiç sipariş yok.
          </div>
        )}
      </div>
    </div>
  );
}
