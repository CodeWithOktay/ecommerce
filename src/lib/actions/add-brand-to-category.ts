"use server";

import { prisma } from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";

// Slug oluşturucu (Türkçe karakter destekli)
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function addBrandToCategory(
  categoryId: string,
  brandName: string
) {
  console.log("🚀 İŞLEM BAŞLADI: Marka Ekleme");
  console.log("👉 Gelen Veriler:", { categoryId, brandName });

  try {
    // 1. Marka isminden slug üret
    const generatedSlug = slugify(brandName);
    console.log("slug:", generatedSlug);

    // 2. Marka zaten var mı?
    const existingBrand = await prisma.brand.findFirst({
      where: { name: brandName }, // Veya slug: generatedSlug
    });

    if (existingBrand) {
      console.log("✅ Marka zaten var, ID:", existingBrand.id);
      console.log("🔗 Kategoriye bağlanıyor...");

      await prisma.category.update({
        where: { id: categoryId },
        data: {
          brands: {
            connect: { id: existingBrand.id },
          },
        },
      });
    } else {
      console.log("🆕 Marka yeni oluşturuluyor...");

      await prisma.category.update({
        where: { id: categoryId },
        data: {
          brands: {
            create: [
              {
                // DİKKAT: Array ([]) içinde obje
                name: brandName,
                slug: generatedSlug,
              },
            ],
          },
        },
      });
    }

    console.log("🎉 İşlem Başarılı! Cache temizleniyor...");
    revalidatePath("/admin/categories"); // Yolun doğruluğundan emin ol
    return { success: true };
  } catch (error) {
    // BURASI ÇOK ÖNEMLİ: Hatayı terminale basıyoruz
    console.error("❌ HATA OLUŞTU REİS:", error);
    return {
      success: false,
      error: "Veritabanı hatası oluştu. Terminale bak.",
    };
  }
}
