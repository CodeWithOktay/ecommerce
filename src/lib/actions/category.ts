"use server";

import { prisma } from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";

// --- KATEGORİ OLUŞTURMA ---
export async function createCategory(
  name: string,
  parentId?: string,
  attributes: string[] = []
) {
  try {
    // Slug oluştur (Türkçe karakter uyumlu)
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/ /g, "-")
      .replace(
        /[ıİğĞüÜşŞöÖçÇ]/g,
        (c) =>
          ({
            ı: "i",
            İ: "i",
            ğ: "g",
            Ğ: "g",
            ü: "u",
            Ü: "u",
            ş: "s",
            Ş: "s",
            ö: "o",
            Ö: "o",
            ç: "c",
            Ç: "c",
          })[c] || c
      );

    // Aynı slug var mı kontrol et (Çakışmayı önle)
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, message: "Bu isimde bir kategori zaten var." };
    }

    await prisma.category.create({
      data: {
        name,
        slug,
        parentId: parentId || null,
        // Özellikleri oluştur
        attributes: {
          create: attributes.map((attrName) => ({
            name: attrName,
          })),
        },
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, message: "Kategori ve özellikler oluşturuldu! 🎉" };
  } catch (error) {
    console.error("Create Error:", error);
    return { success: false, message: "Kategori oluşturulurken hata çıktı." };
  }
}

// --- KATEGORİ SİLME (GÜVENLİ MOD) ---
export async function deleteCategory(id: string) {
  try {
    // 1. Önce içeride "Çocuk" veya "Ürün" var mı diye bakıyoruz
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            children: true, // Alt kategoriler
            products: true, // Ürünler
          },
        },
      },
    });

    if (!category) {
      return { success: false, message: "Kategori bulunamadı." };
    }

    // 2. Güvenlik Kontrolleri
    if (category._count.children > 0) {
      return {
        success: false,
        message: `Silinemez! Bu kategorinin altında ${category._count.children} adet alt kategori var.`,
      };
    }

    if (category._count.products > 0) {
      return {
        success: false,
        message: `Silinemez! Bu kategoriye bağlı ${category._count.products} adet ürün var.`,
      };
    }

    // 3. Engel yoksa sil
    await prisma.category.delete({ where: { id } });

    revalidatePath("/admin/categories");
    return { success: true, message: "Kategori başarıyla silindi. 🗑️" };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Veritabanı hatası oluştu." };
  }
}

// --- KATEGORİ GÜNCELLEME ---
export async function updateCategory(
  id: string,
  name: string,
  parentId?: string,
  attributes: string[] = []
) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. İsim ve Parent Güncelle
      await tx.category.update({
        where: { id },
        data: {
          name,
          parentId: parentId || null,
        },
      });

      // 2. Özellikleri Senkronize Et (Smart Sync)

      // A) Listede olmayanları sil
      await tx.attribute.deleteMany({
        where: {
          categoryId: id,
          name: { notIn: attributes },
        },
      });

      // B) Listede olup veritabanında olmayanları ekle
      for (const attrName of attributes) {
        const existing = await tx.attribute.findFirst({
          where: { categoryId: id, name: attrName },
        });

        if (!existing) {
          await tx.attribute.create({
            data: { name: attrName, categoryId: id },
          });
        }
      }
    });

    revalidatePath("/admin/categories");
    return { success: true, message: "Kategori ve özellikler güncellendi! 👌" };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, message: "Güncelleme sırasında hata oluştu." };
  }
}

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
