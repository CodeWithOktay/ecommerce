/**
 * Admin Dashboard Veri Servisi
 * 
 * Bu modül, admin paneli için gerekli tüm istatistiklerin hesaplanmasını sağlar:
 * - Toplam gelir, sipariş ve kullanıcı sayıları
 * - Aylık değişim oranları (Büyüme metrikleri)
 * - Son siparişler ve kategori dağılımı
 * - Satış grafiği verileri
 */

"use server";

import { prisma } from "@/lib/db";

/**
 * Yüzdelik Değişim Hesaplayıcı
 * 
 * İki periyot arasındaki değişimi yüzde olarak hesaplar.
 * @param current - Şimdiki değer
 * @param previous - Önceki değer
 * @returns Yüzdelik değişim oranı
 */
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

/**
 * Dashboard Verilerini Getirir
 * 
 * Tek bir sunucu isteğiyle tüm panel verilerini toplayıp döner.
 * Performans için Promise.all ile paralel sorgular çalıştırır.
 */
export async function getDashboardData() {
  const now = new Date();

  // --- TARİH ARALIKLARI ---
  // Bu ayın başlangıç ve bitişi
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Geçen ayın başlangıç ve bitişi
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // --- 1. GELİR METRİKLERİ (REVENUE) ---
  const revenueQueries = await Promise.all([
    // Toplam Gelir (İptal edilmemiş tüm siparişler)
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
    // Bu Ayın Geliri
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: { not: "CANCELLED" },
        createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
      },
    }),
    // Geçen Ayın Geliri
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

  // --- 2. SİPARİŞ METRİKLERİ (ORDERS) ---
  const orderQueries = await Promise.all([
    // Toplam Sipariş
    prisma.order.count(),
    // Bu Ayın Siparişleri
    prisma.order.count({
      where: { createdAt: { gte: currentMonthStart, lte: currentMonthEnd } },
    }),
    // Geçen Ayın Siparişleri
    prisma.order.count({
      where: { createdAt: { gte: prevMonthStart, lte: prevMonthEnd } },
    }),
  ]);

  const totalOrders = orderQueries[0];
  const currentMonthOrders = orderQueries[1];
  const prevMonthOrders = orderQueries[2];

  // --- 3. KULLANICI METRİKLERİ (USERS) ---
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

  // --- 4. ÜRÜN METRİKLERİ (PRODUCTS SOLD) ---
  // İptal edilmemiş siparişlerde satılan toplam ürün adedi
  const productQueries = await Promise.all([
    // Toplam Satılan Ürün
    prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: { order: { status: { not: "CANCELLED" } } },
    }),
    // Bu Ay Satılan
    prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: {
        order: {
          status: { not: "CANCELLED" },
          createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
        },
      },
    }),
    // Geçen Ay Satılan
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

  // --- 5. SİPARİŞ DURUM DAĞILIMI ---
  const orderStatusCounts = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const pendingCount =
    orderStatusCounts.find((c) => c.status === "PENDING")?._count?._all || 0;
  const deliveredCount =
    orderStatusCounts.find((c) => c.status === "DELIVERED")?._count?._all || 0;
  const cancelledCount =
    orderStatusCounts.find((c) => c.status === "CANCELLED")?._count?._all || 0;

  // --- 6. FİLTRELEME İÇİN YILLAR ---
  // Sipariş verilerinden mevcut yılları çeker
  const orderYears = await prisma.$queryRaw<{ year: number }[]>`
    SELECT DISTINCT EXTRACT(YEAR FROM "createdAt") as year 
    FROM "Order"
    ORDER BY year DESC
  `;

  const availableYears = orderYears.map((item) => Number(item.year));
  if (availableYears.length === 0) {
    availableYears.push(new Date().getFullYear());
  }

  // --- 7. CHARTS & LISTS DATA ---
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

    // Status counts
    pendingCount,
    deliveredCount,
    cancelledCount,

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

    // Available years for filtering
    availableYears,
  };
}
