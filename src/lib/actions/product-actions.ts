"use server";

import { prisma } from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

// --- TİP TANIMLAMALARI ---
interface CreateProductFormState {
  name: string;
  categoryId: string;
  brandId?: string;
  description?: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  isActive: boolean;
  isArchived: boolean;

  // Resimler
  images: {
    base64Data: string;
    isMain: boolean;
  }[];

  // Varyantlar
  variants: {
    name: string;
    size?: string;
    color?: string;
    stock: number;
    price?: number;
  }[];

  // Özellik Değerleri
  attributeValues: {
    attributeId: string;
    value: string;
  }[];
}

// 🟢 1. ÜRÜN OLUŞTURMA
export async function createProductWithImages(data: CreateProductFormState) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const savedImageUrls: { url: string; isMain: boolean }[] = [];

    // Resimleri Diske Kaydet
    for (const img of data.images) {
      // Base64 header temizle
      const base64Data = img.base64Data.includes("base64,")
        ? img.base64Data.split("base64,")[1]
        : img.base64Data;

      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `product-${uuidv4()}.jpg`;
      await fs.writeFile(path.join(uploadDir, fileName), buffer);
      savedImageUrls.push({ url: `/uploads/${fileName}`, isMain: img.isMain });
    }

    // Veritabanı İşlemi
    await prisma.$transaction(async (tx) => {
      await tx.product.create({
        data: {
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
          brandId: data.brandId || null,
          price: data.price,
          salePrice: data.salePrice,
          stock: data.stock,
          isActive: data.isActive,
          isArchived: data.isArchived,

          images: {
            create: savedImageUrls.map((img) => ({
              url: img.url,
              isMain: img.isMain,
            })),
          },

          variants: {
            create: data.variants.map((v) => ({
              name: v.name,
              size: v.size || null,
              color: v.color || null,
              stock: v.stock,
              price: v.price || null,
            })),
          },

          attributeValues: {
            create: data.attributeValues.map((attr) => ({
              attributeId: attr.attributeId,
              value: attr.value,
            })),
          },
        },
      });
    });

    revalidatePath("/admin/products");
    return { success: true, message: "Ürün başarıyla oluşturuldu! 🎉" };
  } catch (error) {
    console.error("Kayıt Hatası:", error);
    return {
      success: false,
      message: "Bir hata oluştu: " + (error as Error).message,
    };
  }
}

// 🟢 2. ÜRÜN GÜNCELLEME
export async function updateProductWithImages(
  productId: string,
  data: CreateProductFormState
) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const savedImageUrls: { url: string; isMain: boolean }[] = [];

    // Görselleri İşle (Eskileri koru, yenileri yükle)
    for (const img of data.images) {
      if (
        img.base64Data.startsWith("/uploads") ||
        img.base64Data.startsWith("http")
      ) {
        // Zaten yüklü olan resim (URL geldi)
        savedImageUrls.push({ url: img.base64Data, isMain: img.isMain });
      } else {
        // Yeni yüklenen resim (Base64 geldi)
        try {
          const base64Data = img.base64Data.includes("base64,")
            ? img.base64Data.split("base64,")[1]
            : img.base64Data;

          const buffer = Buffer.from(base64Data, "base64");
          const fileName = `product-${uuidv4()}.jpg`;
          await fs.writeFile(path.join(uploadDir, fileName), buffer);
          savedImageUrls.push({
            url: `/uploads/${fileName}`,
            isMain: img.isMain,
          });
        } catch (e) {
          console.error("Resim yükleme hatası:", e);
        }
      }
    }

    await prisma.$transaction(async (tx) => {
      // 1. Önceki İlişkileri Temizle
      await tx.productVariant.deleteMany({ where: { productId } });
      await tx.productAttributeValue.deleteMany({ where: { productId } });

      // ✅ DOĞRU OLAN: Şemana göre 'productImage' tablosunu siliyoruz
      await tx.productImage.deleteMany({ where: { productId } });

      // 2. Ürünü Güncelle ve Yeni İlişkileri Ekle
      await tx.product.update({
        where: { id: productId },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          salePrice: data.salePrice,
          stock: data.stock,
          isActive: data.isActive,
          isArchived: data.isArchived,
          categoryId: data.categoryId,
          brandId: data.brandId || null,

          // Resimler (Yeniden oluşturuyoruz)
          images: {
            create: savedImageUrls.map((img) => ({
              url: img.url,
              isMain: img.isMain,
            })),
          },

          // Varyantlar (Yeniden oluşturuyoruz)
          variants: {
            create: data.variants.map((v) => ({
              name: v.name,
              size: v.size || null,
              color: v.color || null,
              stock: v.stock,
              price: v.price || null,
            })),
          },

          // Özellikler (Yeniden oluşturuyoruz)
          attributeValues: {
            create: data.attributeValues.map((attr) => ({
              attributeId: attr.attributeId,
              value: attr.value,
            })),
          },
        },
      });
    });

    revalidatePath("/admin/products");
    return { success: true, message: "Ürün başarıyla güncellendi! 🔄" };
  } catch (error) {
    console.error("Güncelleme Hatası:", error);
    return { success: false, message: "Güncelleme sırasında hata oluştu." };
  }
}

// 🟢 3. ÜRÜN SİLME
export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/admin/products");
    return { success: true, message: "Ürün silindi. 🗑️" };
  } catch (error) {
    return {
      success: false,
      message: "Silinemedi. Siparişlerde kullanılıyor olabilir.",
    };
  }
}

// 🟢 4. ARŞİVLEME / YAYINA ALMA
export async function toggleProductArchive(
  productId: string,
  isArchived: boolean
) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { isArchived: !isArchived },
    });
    revalidatePath("/admin/products");
    return {
      success: true,
      message: isArchived ? "Ürün yayına alındı! ✅" : "Ürün arşivlendi! 📦",
    };
  } catch (error) {
    return { success: false, message: "İşlem başarısız." };
  }
}
