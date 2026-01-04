/**
 * Admin Sidebar İstatistikleri
 * 
 * Admin panelinin kenar çubuğunda gösterilen özet sayıları getirir.
 * (Bekleyen sipariş, Kritik stok vb.)
 */

"use server";

import { prisma } from "@/lib/db";

/**
 * Kenar Çubuğu İstatistiklerini Getir
 * 
 * @returns {Promise<Object>} İstatistik sayıları
 */
export async function getSidebarStats() {
  // Tüm sorguları aynı anda (paralel) çalıştırıyoruz, performans artışı için
  const [
    pendingOrders,
    lowStockProducts,
    totalUsers,
    totalAdmins,
    totalCategories,
  ] = await prisma.$transaction([
    // 1. Bekleyen Siparişler
    prisma.order.count({
      where: { status: "PENDING" },
    }),

    // 2. Kritik Stok
    prisma.product.count({
      where: { stock: { lt: 10 } },
    }),

    // 3. Toplam Üye
    prisma.user.count(),

    // 4. Toplam Yönetici (Eksikti)
    prisma.user.count({
      where: { role: "ADMIN" },
    }),

    // 5. Toplam Kategori
    prisma.category.count(),
  ]);

  return {
    pendingOrders,
    lowStockProducts,
    totalUsers,
    totalAdmins,
    totalCategories,
    // These are currently 0 as the models don't exist yet
    totalDiscounts: 0,
    totalLogs: 0,
  };
}
