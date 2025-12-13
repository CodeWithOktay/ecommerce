"use server";

import { prisma } from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";

export async function deleteBrandFromCategory(
  categoryId: string,
  brandId: string
) {
  try {
    // 1. DEDEKTİF: Bu kategori ve markayı kullanan ürün var mı?
    // Not: Schema'nda Product modelinde categoryId ve brandId olduğunu varsayıyorum.
    const productCount = await prisma.product.count({
      where: {
        categoryId: categoryId,
        brandId: brandId,
      },
    });

    if (productCount > 0) {
      // 2. ENGEL: Ürün varsa dur!
      return {
        success: false,
        message: `Bu markaya bağlı ${productCount} adet ürün var! Önce ürünleri silmelisin veya düzenlemelisin.`,
      };
    }

    // 3. TEMİZLİK: Ürün yoksa bağı kopar (Markayı tamamen silmez, sadece bu kategoriden çıkarır)
    await prisma.category.update({
      where: { id: categoryId },
      data: {
        brands: {
          disconnect: { id: brandId },
        },
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, message: "Marka bu kategoriden kaldırıldı." };
  } catch (error) { 
    console.log("Marka silme hatası:", error);
    return { success: false, message: "Bir hata oluştu." };
  }
}
