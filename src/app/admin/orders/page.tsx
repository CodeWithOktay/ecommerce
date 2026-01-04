import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import OrderToolbar from "@/components/features/order/order-toolbar";
import OrdersClient from "./order-client";
import { Wallet, Clock, CheckCircle2, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminOrdersPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    exactDate?: string;
    year?: string;
    month?: string;
  }>;
}

/**
 * Sipariş Yönetimi Sayfası (Server Component)
 * 
 * Tüm siparişleri listeler ve temel istatistikleri (Ciro, Bekleyen Sayısı vb.) hesaplar.
 * - URL parametreleri ile gelişmiş filtreleme (Zaman aralığı, Durum, Arama) yapar.
 * - Aylık ciro ve sipariş sayılarını veritabanından 'aggregate' ile hesaplar.
 * - Veriyi client bileşeni (`OrdersClient`) için optimize edilmiş formata dönüştürür.
 */
export default async function AdminOrdersPage(props: AdminOrdersPageProps) {
  const searchParams = await props.searchParams;

  const statusTab = (searchParams.status as OrderStatus) || "PENDING";
  const query = searchParams.q || "";

  // --- 🔥 İSTATİSTİK HESAPLAMALARI (BU AY İÇİN) ---
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // 1. Bu Ayın Cirosu (İptal edilmeyenler)
  const monthlyRevenueData = await prisma.order.aggregate({
    where: {
      createdAt: { gte: startOfMonth, lt: nextMonth },
      status: { not: "CANCELLED" },
    },
    _sum: { total: true },
  });
  const monthlyRevenue = Number(monthlyRevenueData._sum.total || 0);

  // 2. Bu Ay Bekleyen Siparişler
  const monthlyPendingCount = await prisma.order.count({
    where: {
      createdAt: { gte: startOfMonth, lt: nextMonth },
      status: "PENDING",
    },
  });

  // 3. Bu Ay Teslim Edilenler
  const monthlyDeliveredCount = await prisma.order.count({
    where: {
      createdAt: { gte: startOfMonth, lt: nextMonth },
      status: "DELIVERED",
    },
  });

  // --- QUERY OLUŞTURMA ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    AND: [
      { status: statusTab },
      query
        ? {
            OR: [
              { id: { contains: query, mode: "insensitive" } },
              { customerName: { contains: query, mode: "insensitive" } },
              { user: { firstName: { contains: query, mode: "insensitive" } } },
              { user: { lastName: { contains: query, mode: "insensitive" } } },
              {
                items: {
                  some: {
                    product: { name: { contains: query, mode: "insensitive" } },
                  },
                },
              },
            ],
          }
        : {},
    ],
  };

  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: {
        include: {
          product: { include: { images: true } },
        },
      },
    },
  });

  const statusCounts = await prisma.order.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const counts = statusCounts.reduce(
    (acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    },
    {} as Record<string, number>
  );

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    userId: order.userId,
    customerName: order.user
      ? `${order.user.firstName} ${order.user.lastName}`
      : order.customerName || "Misafir Müşteri",
    customerEmail: order.user?.email || order.customerEmail || "Belirtilmemiş",
    customerPhone: order.user?.phoneNumber || "Belirtilmemiş",
    address: order.address || "Adres bilgisi girilmemiş.",
    total: Number(order.total),
    status: order.status,
    createdAt: new Date(order.createdAt).toLocaleDateString("tr-TR"),
    totalQuantity: order.items.reduce((acc, item) => acc + item.quantity, 0),
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: Number(item.price),
      product: {
        name: item.product?.name || "Silinmiş Ürün",
        images: item.product?.images || [],
      },
    })),
  }));

  const allOrdersDate = await prisma.order.findMany({
    select: { createdAt: true },
  });
  const uniqueYears = new Set<number>();
  uniqueYears.add(new Date().getFullYear());
  allOrdersDate.forEach((o) =>
    uniqueYears.add(new Date(o.createdAt).getFullYear())
  );
  const availableYears = Array.from(uniqueYears).sort((a, b) => b - a);

  return (
    <div className="p-6 md:p-10 bg-[#F9FAFB] min-h-screen space-y-10 font-sans">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Sipariş Yönetimi
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Sipariş operasyonlarını ve finansal özetleri buradan yönetebilirsin.
          </p>
        </div>

        {/* 🔥 İSTATİSTİK KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. KART: CİRO */}
          <div className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Wallet size={24} />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <TrendingUp size={12} className="mr-1" /> Bu Ay
                </span>
              </div>
              <div>
                {/* İSİM GÜNCELLENDİ: AYLIK CİRO */}
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  Aylık Ciro
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1 tracking-tight">
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                    maximumFractionDigits: 0,
                  }).format(monthlyRevenue)}
                </h3>
              </div>
            </div>
          </div>

          {/* 2. KART: BEKLEYEN */}
          <div className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <Clock size={24} />
                </div>
                {/* ROZET EKLENDİ: BU AY */}
                <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                  Bu Ay
                </span>
              </div>
              <div>
                {/* İSİM GÜNCELLENDİ: BU AY BEKLEYEN */}
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  Bu Ay Bekleyen
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1 tracking-tight">
                  {monthlyPendingCount}{" "}
                  <span className="text-lg font-medium text-gray-400">
                    Adet
                  </span>
                </h3>
              </div>
            </div>
          </div>

          {/* 3. KART: TESLİMAT */}
          <div className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <CheckCircle2 size={24} />
                </div>
                {/* ROZET EKLENDİ: BU AY */}
                <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  Bu Ay
                </span>
              </div>
              <div>
                {/* İSİM GÜNCELLENDİ: BU AY TESLİMAT */}
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  Bu Ay Teslimat
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1 tracking-tight">
                  {monthlyDeliveredCount}{" "}
                  <span className="text-lg font-medium text-gray-400">
                    Adet
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        <OrderToolbar availableYears={availableYears} />
      </div>

      <OrdersClient
        orders={formattedOrders}
        counts={counts}
        searchQuery={query}
      />
    </div>
  );
}
