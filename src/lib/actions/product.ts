"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { createLog } from "@/lib/logger";

// 🟢 TİP TANIMLARI
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
  defaultColor?: string;
  defaultSize?: string;

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
    salePrice?: number | null; // Varyant özel indirimli fiyatı
  }[];

  attributeValues: {
    attributeId: string;
    value: string;
  }[];
}


// 🟢 YENİ ÜRÜN OLUŞTURMA
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
          defaultColor: data.defaultColor || null,
          defaultSize: data.defaultSize || null,

          images: {
            create: savedImageUrls.map((img) => ({
              url: img.url,
              isMain: img.isMain,
            })),
          },

          variants: {
            create: data.variants.map((v) => ({
              name: v.name,
              color: v.color || null,
              size: v.size || null,
              stock: v.stock,
              price: v.price || null,
              salePrice: v.salePrice || null, // Varyant bazlı indirimli fiyat
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
      details: `Ürün ve Varyantlar oluşturuldu: ${newProduct.name} (ID: ${newProduct.id})`,
      success: true,
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    return {
      success: true,
      message: "Ürün ve varyantlar başarıyla oluşturuldu! 🎉",
    };
  } catch (error) {
    console.error("Kayıt Hatası:", error);
    await createLog({
      action: "CREATE_PRODUCT_ERROR",
      details: `Hata: ${(error as Error).message}`,
      success: false,
    });
    return { success: false, message: "Hata: " + (error as Error).message };
  }
}

// 🟢 ÜRÜN GÜNCELLEME
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
      }
    }

    const updatedProduct = await prisma.$transaction(async (tx) => {
      // İlişkili eski verileri temizle (Senkronize Update Stratejisi)
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
          defaultColor: data.defaultColor || null,
          defaultSize: data.defaultSize || null,

          images: {
            create: savedImageUrls.map((img) => ({
              url: img.url,
              isMain: img.isMain,
            })),
          },

          variants: {
            create: data.variants.map((v) => ({
              name: v.name,
              color: v.color || null,
              size: v.size || null,
              stock: v.stock,
              price: v.price || null,
              salePrice: v.salePrice || null,
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
      details: `Ürün güncellendi: ${updatedProduct.name}`,
      success: true,
    });

    revalidatePath("/admin/products");
    revalidatePath(`/products/${productId}`);
    return {
      success: true,
      message: "Ürün ve varyantlar başarıyla güncellendi! 🔄",
    };
  } catch (error) {
    console.error("Güncelleme Hatası:", error);
    return { success: false, message: "Güncelleme sırasında hata oluştu." };
  }
}

// 🟢 ÜRÜN SİLME
export async function deleteProduct(productId: string) {
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });

    await createLog({
      action: "DELETE_PRODUCT",
      details: `Ürün silindi: ${deletedProduct.name}`,
      success: true,
    });

    revalidatePath("/admin/products");
    return { success: true, message: "Ürün başarıyla silindi. 🗑️" };
  } catch {
    return {
      success: false,
      message: "Ürün silinemedi. Siparişlerde kullanılıyor olabilir.",
    };
  }
}

// 🟢 ARŞİVLEME / YAYINA ALMA
export async function toggleProductArchive(
  productId: string,
  isArchived: boolean
) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isArchived: !isArchived },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");

    return {
      success: true,
      message: isArchived ? "Ürün yayına alındı! ✅" : "Ürün arşivlendi! 📦",
    };
  } catch {
    return { success: false, message: "İşlem başarısız." };
  }
}
