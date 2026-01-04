/**
 * Ürün Arama Servisi
 * 
 * Veritabanında ürün isminde veya açıklamasında arama yapar.
 */

"use server";

import { prisma } from "@/lib/db";

/**
 * Veritabanında Ürün Arar
 * 
 * @param query - Arama metni
 * @returns Eşleşen ürünlerin listesi (Serileştirilmiş formatta)
 */
export async function searchProductsInDb(query: string) {
  try {
    if (!query) return [];

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
        isActive: true,
      },
      include: {
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Return plain objects with numbers instead of Decimals to avoid serialization issues
    // and importing Decimal on the client
    return products.map((p) => ({
      ...p,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      stock: p.stock ?? 0, // Ensure stock is never null
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Arama hatası:", error);
    return [];
  }
}
