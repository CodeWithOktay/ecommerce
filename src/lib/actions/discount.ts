/**
 * İndirim ve Kampanya Yönetimi
 * 
 * Bu modül, kupon ve toplu kampanya yönetimini sağlar:
 * - Kupon oluşturma ve silme
 * - Belirli kategori veya markalara toplu indirim uygulama
 * - Ham SQL sorguları ile performanslı fiyat güncellemeleri
 */

"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { CouponType } from "@prisma/client";
import { createLog } from "@/lib/logger";

// --- 1. KUPON İŞLEMLERİ ---

/**
 * Yeni İndirim Kuponu Oluşturur
 * 
 * @param data - Kupon detayları (kod, oran/miktar, süre, kısıtlamalar)
 * @returns Başarı/hata durumu
 */
export async function createCoupon(data: {
  code: string;
  type: CouponType;
  value: number;
  minAmount?: number;
  categoryId?: string;
  usageLimit?: number;
  endDate?: Date;
}) {
  try {
    const existing = await prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() },
    });

    if (existing) {
      return { success: false, message: "Bu kupon kodu zaten var!" };
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        minAmount: data.minAmount,
        categoryId:
          data.categoryId === "all" || data.categoryId === ""
            ? null
            : data.categoryId,
        usageLimit: data.usageLimit,
        endDate: data.endDate,
      },
    });

    await createLog({
      action: "CREATE_COUPON",
      details: `Kupon oluşturuldu: ${coupon.code}`,
      success: true,
    });

    revalidatePath("/admin/discounts");
    return { success: true, message: "Kupon hazır reis! 🎟️" };
  } catch {
    return { success: false, message: "Kupon oluşturulamadı." };
  }
}

/**
 * Kuponu Siler
 * 
 * @param id - Silinecek kuponun ID'si
 * @returns Başarı/hata durumu
 */
export async function deleteCoupon(id: string) {
  try {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/discounts");
    return { success: true, message: "Kupon silindi." };
  } catch {
    return { success: false, message: "Silinemedi." };
  }
}

// --- 2. TOPLU İNDİRİM (KAMPANYA) MOTORU  ---

/**
 * Toplu İndirim Uygular (Kampanya Başlatır)
 * 
 * Seçilen kategoriye veya markaya (veya tüm mağazaya) yüzde bazlı indirim uygular.
 * Performans için Prisma '$executeRaw' ile doğrudan SQL UPDATE çalıştırır.
 * Hem ana ürünlerin (Product) hem de varyantların (ProductVariant) fiyatlarını günceller.
 * 
 * @param categoryId - Kategori ID'si veya "all"
 * @param percentage - İndirim yüzdesi (Örn: 20 için %20)
 * @param brandId - Marka ID'si veya "all"
 */
export async function applyBulkDiscount(
  categoryId: string | "all",
  percentage: number,
  brandId?: string | "all"
) {
  try {
    if (percentage <= 0 || percentage >= 100) {
      return { success: false, message: "Geçersiz indirim oranı." };
    }

    const multiplier = 1 - percentage / 100;
    let updatedCount = 0;
    const isBrandSpecific = brandId && brandId !== "all";

    if (categoryId === "all") {
      // 🌍 TÜM MAĞAZA İÇİN
      if (isBrandSpecific) {
        // 1. Ana Ürünleri Güncelle (Belirli Marka)
        const resultProduct = await prisma.$executeRaw`
          UPDATE "Product"
          SET "salePrice" = "price" * ${multiplier}
          WHERE "brandId" = ${brandId} AND "isActive" = true
        `;

        // 2. Varyantları Güncelle (Ana ürünü bu markada olanlar)
        // Not: PostgreSQL UPDATE ... FROM syntax'ı kullanıyoruz
        await prisma.$executeRaw`
          UPDATE "ProductVariant" pv
          SET "salePrice" = pv."price" * ${multiplier}
          FROM "Product" p
          WHERE pv."productId" = p."id"
          AND p."brandId" = ${brandId}
          AND p."isActive" = true
          AND pv."price" IS NOT NULL
        `;

        updatedCount = Number(resultProduct);
      } else {
        // 1. Tüm Ana Ürünler
        const resultProduct = await prisma.$executeRaw`
          UPDATE "Product"
          SET "salePrice" = "price" * ${multiplier}
          WHERE "isActive" = true
        `;

        // 2. Tüm Varyantlar
        await prisma.$executeRaw`
          UPDATE "ProductVariant"
          SET "salePrice" = "price" * ${multiplier}
          WHERE "price" IS NOT NULL
        `;

        updatedCount = Number(resultProduct);
      }
    } else {
      // 📂 KATEGORİYE ÖZEL
      const categories = await prisma.category.findMany({
        where: { OR: [{ id: categoryId }, { parentId: categoryId }] },
        select: { id: true },
      });
      const categoryIds = categories.map((c) => c.id);

      if (categoryIds.length === 0)
        return { success: false, message: "Kategori bulunamadı." };

      if (isBrandSpecific) {
        // 1. Ana Ürünler (Kategori + Marka)
        const resultProduct = await prisma.$executeRaw`
          UPDATE "Product"
          SET "salePrice" = "price" * ${multiplier}
          WHERE "categoryId" IN (${Prisma.join(categoryIds)}) 
          AND "brandId" = ${brandId}
          AND "isActive" = true
        `;

        // 2. Varyantlar (Kategori + Marka)
        await prisma.$executeRaw`
          UPDATE "ProductVariant" pv
          SET "salePrice" = pv."price" * ${multiplier}
          FROM "Product" p
          WHERE pv."productId" = p."id"
          AND p."categoryId" IN (${Prisma.join(categoryIds)})
          AND p."brandId" = ${brandId}
          AND p."isActive" = true
          AND pv."price" IS NOT NULL
        `;

        updatedCount = Number(resultProduct);
      } else {
        // 1. Ana Ürünler (Sadece Kategori)
        const resultProduct = await prisma.$executeRaw`
          UPDATE "Product"
          SET "salePrice" = "price" * ${multiplier}
          WHERE "categoryId" IN (${Prisma.join(categoryIds)}) 
          AND "isActive" = true
        `;

        // 2. Varyantlar (Sadece Kategori)
        await prisma.$executeRaw`
          UPDATE "ProductVariant" pv
          SET "salePrice" = pv."price" * ${multiplier}
          FROM "Product" p
          WHERE pv."productId" = p."id"
          AND p."categoryId" IN (${Prisma.join(categoryIds)})
          AND p."isActive" = true
          AND pv."price" IS NOT NULL
        `;

        updatedCount = Number(resultProduct);
      }
    }

    await createLog({
      action: "BULK_DISCOUNT",
      details: `${categoryId === "all" ? "Tüm Mağaza" : "Kategori"} ve ${isBrandSpecific ? "Marka" : "Genel"} bazlı %${percentage} indirim. (${updatedCount} ürün)`,
      success: true,
    });

    revalidatePath("/products");
    revalidatePath("/");
    return {
      success: true,
      message: `${updatedCount} ürün ve varyantlarına indirim uygulandı! 🔥`,
    };
  } catch (error) {
    console.error("Bulk Discount Error:", error);
    return { success: false, message: "İşlem sırasında hata oluştu." };
  }
}

/**
 * Kampanyayı/İndirimleri Kaldırır
 * 
 * Seçilen kapsamdaki ürünlerin indirimli fiyatlarını (salePrice) sıfırlar.
 * Hem ana ürünler hem de varyantlar için geçerlidir.
 * 
 * @param categoryId - Kategori ID'si veya "all"
 * @param brandId - Marka ID'si veya "all"
 */
export async function removeBulkDiscount(
  categoryId: string | "all",
  brandId?: string | "all"
) {
  try {
    let updatedCount = 0;
    const isBrandSpecific = brandId && brandId !== "all";

    // 1. Hedef Ürün ID'lerini bulalım (Hem Product hem Variant güncellemek için)
    const whereClause: Prisma.ProductWhereInput = {
      salePrice: { not: null },
    };

    if (categoryId !== "all") {
      const categories = await prisma.category.findMany({
        where: { OR: [{ id: categoryId }, { parentId: categoryId }] },
        select: { id: true },
      });
      const categoryIds = categories.map((c) => c.id);
      if (categoryIds.length > 0) whereClause.categoryId = { in: categoryIds };
    }

    if (isBrandSpecific) {
      whereClause.brandId = brandId;
    }

    // Etkilenecek ürünleri bul
    const productsToUpdate = await prisma.product.findMany({
      where: whereClause,
      select: { id: true },
    });

    const productIds = productsToUpdate.map((p) => p.id);

    if (productIds.length > 0) {
      // Transaction ile hem ürünleri hem varyantları sıfırla
      await prisma.$transaction([
        // Ana Ürünleri Sıfırla
        prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { salePrice: null },
        }),
        // Varyantları Sıfırla
        prisma.productVariant.updateMany({
          where: { productId: { in: productIds } },
          data: { salePrice: null },
        }),
      ]);

      updatedCount = productIds.length;
    }

    await createLog({
      action: "REMOVE_DISCOUNT",
      details: `İndirimler kaldırıldı. (${updatedCount} ürün)`,
      success: true,
    });

    revalidatePath("/products");
    revalidatePath("/");
    return { success: true, message: "Fiyatlar normale döndü. 🔄" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Hata oluştu." };
  }
}
