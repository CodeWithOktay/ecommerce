// app/admin/orders/[orderId]/page.tsx
import prisma from "@/lib/prisma-client";
import { updateOrderStatus } from "@/lib/actions/order-actions";
import Link from "next/link";
import Image from "next/image";
import { OrderStatus } from "@prisma/client";

export default async function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      user: true,
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) return <div className="p-10">Sipariş bulunamadı.</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/orders" className="text-gray-500 hover:text-black">
          ← Listeye Dön
        </Link>
        <h1 className="text-2xl font-bold">
          Sipariş #{order.id.slice(-6).toUpperCase()}
        </h1>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {order.createdAt.toLocaleString("tr-TR")}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SOL TARAF: Sipariş Kalemleri */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b font-semibold text-gray-700">
              Sipariş İçeriği ({order.items.length} Ürün)
            </div>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex gap-4 items-center">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {/* Ürün silinmiş olsa bile resim linki array'de duruyor olabilir, yoksa placeholder */}
                    <Image
                      src={
                        item.product?.images?.[0] ||
                        "https://placehold.co/100x100"
                      }
                      alt={item.product?.name || "Ürün"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.product?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Adet Fiyatı: {Number(item.price).toFixed(2)} ₺
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">x{item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {(Number(item.price) * item.quantity).toFixed(2)} ₺
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <span className="font-semibold text-gray-600">Toplam Tutar</span>
              <span className="text-xl font-bold text-gray-900">
                {Number(order.total).toFixed(2)} ₺
              </span>
            </div>
          </div>
        </div>

        {/* SAĞ TARAF: Müşteri ve Yönetim */}
        <div className="space-y-6">
          {/* Durum Yönetimi */}
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Sipariş Durumu</h3>
            <form
              action={updateOrderStatus.bind(null, order.id)}
              className="space-y-4"
            >
              <select
                name="status"
                defaultValue={order.status}
                className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black outline-none"
              >
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Durumu Güncelle
              </button>
            </form>
          </div>

          {/* Müşteri Bilgileri */}
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Müşteri Bilgileri</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-gray-500">Ad Soyad</span>
                <span className="font-medium text-gray-900">
                  {order.user
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : order.customerName}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Email</span>
                <span className="font-medium text-gray-900">
                  {order.user?.email || order.customerEmail}
                </span>
              </div>
              <div>
                <span className="block text-gray-500">Üyelik Durumu</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs ${order.userId ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {order.userId ? "Kayıtlı Üye" : "Misafir Alışverişi"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
