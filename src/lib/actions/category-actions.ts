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
