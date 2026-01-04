import { prisma } from "@/lib/db";
import ReportsClient from "./report-client";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: { include: { product: true } };
    user: {
      select: {
        phoneNumber: true;
        firstName: true;
        lastName: true;
        email: true;
      };
    };
  };
}>;

/**
 * Raporlar Sayfası (Server Component)
 * 
 * Detaylı satış raporlarını ve sipariş listesini hazırlar.
 * - Müşteri adı veya e-postasına göre filtreleme yapabilir (searchParams).
 * - Toplam ciro (revenue) ve sipariş sayısını hesaplar.
 * - Raporlama için gerekli olan düzleştirilmiş veri setini (flat dataset) oluşturur.
 */
export default async function ReportsPage(props: {
  searchParams: Promise<{ customer?: string; start?: string; end?: string }>;
}) {
  const searchParams = await props.searchParams;
  const whereCriteria: Prisma.OrderWhereInput = {};

  if (searchParams.customer) {
    whereCriteria.OR = [
      {
        customerName: { contains: searchParams.customer, mode: "insensitive" },
      },
      {
        customerEmail: { contains: searchParams.customer, mode: "insensitive" },
      },
    ];
  }

  const [salesStats, allOrders] = await Promise.all([
    prisma.order.aggregate({
      where: whereCriteria,
      _sum: { total: true },
      _count: { id: true },
    }),
    prisma.order.findMany({
      where: whereCriteria,
      include: {
        items: { include: { product: true } },
        user: {
          select: {
            phoneNumber: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const reportDataset = {
    revenue: Number(salesStats._sum.total) || 0,
    recentOrders: (allOrders as OrderWithRelations[]).map((order) => ({
      id: order.id, // Tam ID
      shortId: order.id.slice(-6).toUpperCase(), // Görsel için kısa ID
      customer:
        order.customerName ||
        (order.user
          ? `${order.user.firstName} ${order.user.lastName}`
          : "Bilinmeyen"),
      email: order.customerEmail || order.user?.email || "N/A",
      phone: order.user?.phoneNumber || "-",
      amount: Number(order.total),
      status: order.status, // Sipariş Durumu
      date: new Date(order.createdAt).toLocaleDateString("tr-TR"),
      details: order.items?.map((oi) => oi.product?.name).join(", ") || "-",
    })),
  };

  return <ReportsClient data={reportDataset} />;
}
