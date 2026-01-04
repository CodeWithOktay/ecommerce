/**
 * Favori İşlemleri Server Actions
 * 
 * Kullanıcıların ürünleri favorilerine ekleyip çıkarmasını sağlar.
 * Toggle mantığı ile çalışır (Ekliyse çıkarır, değilse ekler).
 */

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/actions/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Favori Durumunu Değiştir (Ekle/Çıkar)
 * 
 * @param productId - Ürün ID'si
 * @returns Yeni durum (isFavorited: true/false) ve mesaj
 */
export async function toggleFavorite(productId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { success: false, message: "Giriş yapmalısınız." };
  }

  const userId = session.user.id;

  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      revalidatePath("/");
      return {
        success: true,
        message: "Favorilerden çıkarıldı.",
        isFavorited: false,
      };
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          productId,
        },
      });
      revalidatePath("/");
      return {
        success: true,
        message: "Favorilere eklendi!",
        isFavorited: true,
      };
    }
  } catch (error) {
    console.error("Favori işlemi hatası:", error);
    return { success: false, message: "Bir hata oluştu." };
  }
}
