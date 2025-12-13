// actions/dashboard-actions.ts
"use server";

import prisma from "@/lib/prisma-client";

export async function getDashboardData() {
  // 1. Toplam Gelir (Sadece tamamlanan siparişler)
  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: "SHIPPED" }, // Veya 'DELIVERED', 'PAID'
  });

  // 2. Sipariş Sayısı
  const totalOrders = await prisma.order.count();

  // 3. Üye Sayısı
  const totalUsers = await prisma.user.count();

  // 4. Satılan Ürün Adeti
  const totalProductsSold = await prisma.orderItem.aggregate({
    _sum: { quantity: true },
  });

  // 5. Son 5 Sipariş
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  // 6. Kategori Dağılımı (Ürün sayısına göre)
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  // 7. Aylık Satış Grafiği için Veri Hazırlama (Basitleştirilmiş)
  // Gerçek projede SQL ile GROUP BY yapmak daha performanslıdır ama Prisma ile JS tarafında şöyle yapabiliriz:
  const last6MonthsOrders = await prisma.order.findMany({
    where: {
      status: { not: "CANCELLED" }, // İptaller hariç
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      },
    },
    select: { createdAt: true, total: true },
  });

  // Aylara göre gruplama (JS tarafında)
  const monthlyData: Record<string, { gelir: number; siparis: number }> = {};

  last6MonthsOrders.forEach((order) => {
    const month = order.createdAt.toLocaleString("tr-TR", { month: "long" });
    if (!monthlyData[month]) {
      monthlyData[month] = { gelir: 0, siparis: 0 };
    }
    monthlyData[month].gelir += Number(order.total);
    monthlyData[month].siparis += 1;
  });

  const salesData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    gelir: data.gelir,
    siparis: data.siparis,
  }));

  // Veriyi Client Component'e uygun formata sokup döndürüyoruz
  return {
    revenue: Number(totalRevenue._sum.total) || 0,
    ordersCount: totalOrders,
    usersCount: totalUsers,
    productsSoldCount: totalProductsSold._sum.quantity || 0,
    salesData:
      salesData.length > 0
        ? salesData
        : [{ month: "Veri Yok", gelir: 0, siparis: 0 }],
    categoryData: categories.map((cat) => ({
      name: cat.name,
      value: cat._count.products,
    })),
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      customer: order.user
        ? `${order.user.firstName} ${order.user.lastName}`
        : order.customerName || "Misafir",
      amount: Number(order.total),
      status: order.status,
      date: order.createdAt.toLocaleDateString("tr-TR"),
    })),
  };
}
