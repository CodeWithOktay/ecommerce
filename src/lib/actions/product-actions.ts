"use server";

import { prisma } from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { createLog } from "@/lib/logger";

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

  images: {
    base64Data: string;
    isMain: boolean;
  }[];

  variants: {
    name: string;
    size?: string;
    color?: string;
    stock: number;
    price?: number;
  }[];

  attributeValues: {
    attributeId: string;
    value: string;
  }[];
}

export async function searchProductsInDb(query: string) {
  try {
    if (!query) return [];

    const products = await prisma.product.findMany({
      where: {
        OR: [
          // İsminde VEYA açıklamasında geçenleri ara
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
        isActive: true, // Sadece aktif ürünler
      },
      include: {
        images: true, // Resimleri de getir
      },
      orderBy: {
        createdAt: "desc", // En yeniler önce
      },
    });

    // Decimal fiyatları Number'a çevir (Prisma dönüşümü)
    return products.map((p) => ({
      ...p,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
    }));
  } catch (error) {
    console.error("Arama hatası:", error);
    return [];
  }
}

export async function createProductWithImages(data: CreateProductFormState) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const savedImageUrls: { url: string; isMain: boolean }[] = [];

    for (const img of data.images) {
      const base64Data = img.base64Data.includes("base64,")
        ? img.base64Data.split("base64,")[1]
        : img.base64Data;

      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `product-${uuidv4()}.jpg`;
      await fs.writeFile(path.join(uploadDir, fileName), buffer);
      savedImageUrls.push({ url: `/uploads/${fileName}`, isMain: img.isMain });
    }

    const newProduct = await prisma.$transaction(async (tx) => {
      return await tx.product.create({
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

    await createLog({
      action: "CREATE_PRODUCT",
      details: `Ürün oluşturuldu: ${newProduct.name} (ID: ${newProduct.id}) - Fiyat: ${newProduct.price}`,
      success: true,
    });

    revalidatePath("/admin/products");
    return { success: true, message: "Ürün başarıyla oluşturuldu! 🎉" };
  } catch (error) {
    console.error("Kayıt Hatası:", error);

    await createLog({
      action: "CREATE_PRODUCT_ERROR",
      details: `Ürün oluşturulamadı. Hata: ${(error as Error).message}`,
      success: false,
    });

    return {
      success: false,
      message: "Bir hata oluştu: " + (error as Error).message,
    };
  }
}

export async function updateProductWithImages(
  productId: string,
  data: CreateProductFormState
) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const savedImageUrls: { url: string; isMain: boolean }[] = [];

    for (const img of data.images) {
      if (
        img.base64Data.startsWith("/uploads") ||
        img.base64Data.startsWith("http")
      ) {
        savedImageUrls.push({ url: img.base64Data, isMain: img.isMain });
      } else {
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

    const updatedProduct = await prisma.$transaction(async (tx) => {
      await tx.productVariant.deleteMany({ where: { productId } });
      await tx.productAttributeValue.deleteMany({ where: { productId } });
      await tx.productImage.deleteMany({ where: { productId } });

      return await tx.product.update({
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

    await createLog({
      action: "UPDATE_PRODUCT",
      details: `Ürün güncellendi: ${updatedProduct.name} (ID: ${productId})`,
      success: true,
    });

    revalidatePath("/admin/products");
    return { success: true, message: "Ürün başarıyla güncellendi! 🔄" };
  } catch (error) {
    console.error("Güncelleme Hatası:", error);

    await createLog({
      action: "UPDATE_PRODUCT_ERROR",
      details: `Ürün güncelleme hatası (ID: ${productId}): ${(error as Error).message}`,
      success: false,
    });

    return { success: false, message: "Güncelleme sırasında hata oluştu." };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });

    await createLog({
      action: "DELETE_PRODUCT",
      details: `Ürün silindi: ${deletedProduct.name} (ID: ${productId})`,
      success: true,
    });

    revalidatePath("/admin/products");
    return { success: true, message: "Ürün silindi. 🗑️" };
  } catch (error) {
    await createLog({
      action: "DELETE_PRODUCT_ERROR",
      details: `Ürün silinemedi (ID: ${productId}). Muhtemelen siparişlerde kullanılıyor.`,
      success: false,
    });

    return {
      success: false,
      message: "Silinemedi. Siparişlerde kullanılıyor olabilir.",
    };
  }
}

export async function toggleProductArchive(
  productId: string,
  isArchived: boolean
) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isArchived: !isArchived },
    });

    const actionText = !isArchived ? "arşivlendi" : "yayına alındı";

    await createLog({
      action: !isArchived ? "ARCHIVE_PRODUCT" : "UNARCHIVE_PRODUCT",
      details: `Ürün ${actionText}: ${updatedProduct.name} (ID: ${productId})`,
      success: true,
    });

    revalidatePath("/admin/products");
    return {
      success: true,
      message: isArchived ? "Ürün yayına alındı! ✅" : "Ürün arşivlendi! 📦",
    };
  } catch (error) {
    await createLog({
      action: "ARCHIVE_ERROR",
      details: `Ürün durum değiştirme hatası (ID: ${productId})`,
      success: false,
    });

    return { success: false, message: "İşlem başarısız." };
  }
}
