// src/lib/actions/favorite-actions.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(productId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { success: false, message: "Giriş yapmalısınız." };
  }

  const userId = session.user.id;

  try {
    // Önce var mı diye kontrol et
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingFavorite) {
      // Varsa SİL (Favoriden çıkar)
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      revalidatePath("/"); // Sayfayı yenile ki kalp boşalsın
      return { success: true, message: "Favorilerden çıkarıldı.", isFavorited: false };
    } else {
      // Yoksa EKLE
      await prisma.favorite.create({
        data: {
          userId,
          productId,
        },
      });
      revalidatePath("/");
      return { success: true, message: "Favorilere eklendi! ❤️", isFavorited: true };
    }
  } catch (error) {
    console.error("Favori işlemi hatası:", error);
    return { success: false, message: "Bir hata oluştu." };
  }
}