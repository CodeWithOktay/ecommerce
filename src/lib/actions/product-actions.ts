"use server";

import { prisma } from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

// Frontend'den gelen veri yapısı (GÜNCELLENDİ)
interface CreateProductFormState {
  name: string;
  categoryId: string;
  brandId?: string;
  description?: string;
  price: number;
  salePrice?: number | null; // 🟢 YENİ: İndirimli Fiyat
  stock: number;
  isActive: boolean; // 🟢 YENİ: Durum
  isArchived: boolean; // 🟢 YENİ: Arşiv

  // Resimler
  images: {
    base64Data: string;
    isMain: boolean;
  }[];

  // 🟢 YENİ: Varyantlar
  variants: {
    name: string;
    size?: string;
    color?: string;
    stock: number;
    price?: number;
  }[];

  // 🟢 YENİ: Özellik Değerleri
  attributeValues: {
    attributeId: string;
    value: string;
  }[];
}

export async function createProductWithImages(data: CreateProductFormState) {
  try {
    // 1. Resim Klasörünü Hazırla
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const savedImageUrls: { url: string; isMain: boolean }[] = [];

    // 2. Resimleri İşle
    for (const img of data.images) {
      // Eğer resim zaten bir URL ise (Edit modunda eskiler gelirse) dokunma
      if (
        img.base64Data.startsWith("http") ||
        img.base64Data.startsWith("/uploads")
      ) {
        savedImageUrls.push({ url: img.base64Data, isMain: img.isMain });
        continue;
      }

      // Base64 ise dosyaya yaz
      const base64Data = img.base64Data.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `product-${uuidv4()}.jpg`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);
      savedImageUrls.push({ url: `/uploads/${fileName}`, isMain: img.isMain });
    }

    // 3. Veritabanına Kaydet (Transaction ile Hepsi Bir Arada)
    await prisma.$transaction(async (tx) => {
      await tx.product.create({
        data: {
          // Temel Bilgiler
          name: data.name,
          description: data.description,
          price: data.price,
          salePrice: data.salePrice, // İndirimli fiyat
          stock: data.stock,
          isActive: data.isActive,
          isArchived: data.isArchived,

          // İlişkiler
          categoryId: data.categoryId,
          brandId: data.brandId || null,

          // 🖼️ Resimler
          images: {
            create: savedImageUrls.map((img) => ({
              url: img.url,
              isMain: img.isMain,
            })),
          },

          // 🧬 Varyantlar (Renk/Beden)
          variants: {
            create: data.variants.map((v) => ({
              name: v.name,
              size: v.size || null,
              color: v.color || null,
              stock: v.stock,
              price: v.price || null, // Fiyat farkı
            })),
          },

          // 📋 Özellikler (Attributes)
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
    return {
      success: true,
      message: "Ürün, varyantlar ve özellikler başarıyla kaydedildi! 🚀",
    };
  } catch (error) {
    console.error("Kayıt Hatası:", error);
    return {
      success: false,
      message: "Bir hata oluştu: " + (error as Error).message,
    };
  }
}
