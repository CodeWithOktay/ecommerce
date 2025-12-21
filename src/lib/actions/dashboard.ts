"use server";

import prisma from "@/lib/db";

/**
 * Helper function to calculate percentage change
 * İki değer arasındaki yüzdelik değişimi hesaplar.
 * Örn: Geçen ay 100, Bu ay 120 -> %20 artış.
 */
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

export async function getDashboardData() {
  const now = new Date();

  // Define date ranges for Current Month and Previous Month
  // Bu ayın başlangıç (1'i) ve bitiş (30/31'i) tarihleri
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Geçen ayın başlangıç ve bitiş tarihleri
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // --- 1. REVENUE METRICS (GELİR) ---
  const revenueQueries = await Promise.all([
    // Total Revenue (Lifetime)
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
    // Current Month Revenue
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: { not: "CANCELLED" },
        createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
      },
    }),
    // Previous Month Revenue
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: { not: "CANCELLED" },
        createdAt: { gte: prevMonthStart, lte: prevMonthEnd },
      },
    }),
  ]);

  const totalRevenue = Number(revenueQueries[0]._sum.total) || 0;
  const currentMonthRevenue = Number(revenueQueries[1]._sum.total) || 0;
  const prevMonthRevenue = Number(revenueQueries[2]._sum.total) || 0;

  // --- 2. ORDERS METRICS (SİPARİŞLER) ---
  const orderQueries = await Promise.all([
    // Total Orders
    prisma.order.count(),
    // Current Month Orders
    prisma.order.count({
      where: { createdAt: { gte: currentMonthStart, lte: currentMonthEnd } },
    }),
    // Previous Month Orders
    prisma.order.count({
      where: { createdAt: { gte: prevMonthStart, lte: prevMonthEnd } },
    }),
  ]);

  const totalOrders = orderQueries[0];
  const currentMonthOrders = orderQueries[1];
  const prevMonthOrders = orderQueries[2];

  // --- 3. USER METRICS (KULLANICILAR) ---
  const userQueries = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { createdAt: { gte: currentMonthStart, lte: currentMonthEnd } },
    }),
    prisma.user.count({
      where: { createdAt: { gte: prevMonthStart, lte: prevMonthEnd } },
    }),
  ]);

  const totalUsers = userQueries[0];
  const currentMonthUsers = userQueries[1];
  const prevMonthUsers = userQueries[2];

  // --- 4. PRODUCT METRICS (ÜRÜNLER) ---
  // Note: We sum 'quantity' from OrderItem, excluding cancelled orders
  // İptal edilmemiş siparişlerin ürün adetlerini topluyoruz
  const productQueries = await Promise.all([
    // Total Products Sold
    prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: { order: { status: { not: "CANCELLED" } } },
    }),
    // Current Month Products Sold
    prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: {
        order: {
          status: { not: "CANCELLED" },
          createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
        },
      },
    }),
    // Previous Month Products Sold
    prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: {
        order: {
          status: { not: "CANCELLED" },
          createdAt: { gte: prevMonthStart, lte: prevMonthEnd },
        },
      },
    }),
  ]);

  const totalProductsSold = Number(productQueries[0]._sum.quantity) || 0;
  const currentProductsSold = Number(productQueries[1]._sum.quantity) || 0;
  const prevProductsSold = Number(productQueries[2]._sum.quantity) || 0;

  // --- 5. CHARTS & LISTS DATA ---

  // Recent Orders (Son 5 Sipariş)
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  // Category Distribution
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
  });

  // Sales Chart Data (Last 6 Months)
  const last6MonthsStart = new Date();
  last6MonthsStart.setMonth(last6MonthsStart.getMonth() - 6);

  const last6MonthsOrders = await prisma.order.findMany({
    where: {
      status: { not: "CANCELLED" },
      createdAt: { gte: last6MonthsStart },
    },
    select: { createdAt: true, total: true },
  });

  // Group orders by month
  const monthlyData: Record<string, { income: number; count: number }> = {};

  last6MonthsOrders.forEach((order) => {
    const monthName = order.createdAt.toLocaleString("tr-TR", {
      month: "long",
    });
    if (!monthlyData[monthName]) {
      monthlyData[monthName] = { income: 0, count: 0 };
    }
    monthlyData[monthName].income += Number(order.total);
    monthlyData[monthName].count += 1;
  });

  const salesData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    income: data.income,
    order: data.count,
  }));

  return {
    revenue: totalRevenue,
    revenueChange: calculatePercentageChange(
      currentMonthRevenue,
      prevMonthRevenue
    ),

    ordersCount: totalOrders,
    ordersChange: calculatePercentageChange(
      currentMonthOrders,
      prevMonthOrders
    ),

    usersCount: totalUsers,
    usersChange: calculatePercentageChange(currentMonthUsers, prevMonthUsers),

    productsSoldCount: totalProductsSold,
    productsSoldChange: calculatePercentageChange(
      currentProductsSold,
      prevProductsSold
    ),

    // Charts & Tables Data
    salesData:
      salesData.length > 0
        ? salesData
        : [{ month: "Veri Yok", income: 0, order: 0 }],
    categoryData: categories.map((cat) => ({
      id: cat.id,
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
