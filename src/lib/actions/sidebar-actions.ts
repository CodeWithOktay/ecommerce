"use server";

import { prisma } from "@/lib/prisma-client";

export async function getSidebarStats() {
  // Tüm sorguları aynı anda (paralel) çalıştırıyoruz, performans artışı için
  const [
    pendingOrders,
    lowStockProducts,
    totalUsers,
    totalAdmins, // 🟢 EKLENDİ
    totalCategories, // 🟢 EKLENDİ
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

    // 5. Toplam Kategori (Eksikti)
    prisma.category.count(),
  ]);

  // Döndürülen obje artık AdminSidebar'ın beklediği tipte
  return {
    pendingOrders,
    lowStockProducts,
    totalUsers,
    totalAdmins, // ✅ Artık gönderiliyor
    totalCategories, // ✅ Artık gönderiliyor
  };
}
