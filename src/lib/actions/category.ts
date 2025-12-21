"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- KATEGORİ OLUŞTURMA ---
export async function createCategory(
  name: string,
  parentId?: string,
  attributes: string[] = []
) {
  try {
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

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, message: "Bu isimde bir kategori zaten var." };
    }

    await prisma.category.create({
      data: {
        name,
        slug,
        parentId: parentId || null,
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

// --- KATEGORİ SİLME ---
export async function deleteCategory(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            children: true,
            products: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, message: "Kategori bulunamadı." };
    }

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
      await tx.category.update({
        where: { id },
        data: {
          name,
          parentId: parentId || null,
        },
      });

      await tx.attribute.deleteMany({
        where: {
          categoryId: id,
          name: { notIn: attributes },
        },
      });

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
    const generatedSlug = slugify(brandName);
    console.log("slug:", generatedSlug);

    const existingBrand = await prisma.brand.findFirst({
      where: { name: brandName },
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
                name: brandName,
                slug: generatedSlug,
              },
            ],
          },
        },
      });
    }

    console.log("🎉 İşlem Başarılı! Cache temizleniyor...");
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
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
    const productCount = await prisma.product.count({
      where: {
        categoryId: categoryId,
        brandId: brandId,
      },
    });

    if (productCount > 0) {
      return {
        success: false,
        message: `Bu markaya bağlı ${productCount} adet ürün var! Önce ürünleri silmelisin veya düzenlemelisin.`,
      };
    }

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
