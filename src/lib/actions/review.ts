"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

export async function createOrUpdateReviewAction(formData: FormData) {
  const session = await getServerSession();

  if (!session?.user) {
    return { error: "Yorum yapmak için giriş yapmalısın dostum!" };
  }

  const productId = formData.get("productId") as string;
  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment") as string;
  const userId = session.user.id;

  try {
    // 🛡️ KRİTİK KONTROL: Kullanıcı bu ürünü satın almış mı?
    const hasBought = await prisma.order.findFirst({
      where: {
        userId: userId,
        status: "DELIVERED", // Sadece teslim edilen ürünlere yorum yapılsın
        items: {
          some: {
            productId: productId,
          },
        },
      },
    });

    if (!hasBought) {
      return {
        error:
          "Sadece bu ürünü satın alan ve teslim alan kahramanlar yorum yapabilir! 🛡️",
      };
    }

    // 🟢 Upsert (Varsa güncelle, yoksa yeni oluştur)
    await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
      update: {
        rating,
        comment,
        isApproved: false, // Düzenlendiği için tekrar onaya düşer
      },
      create: {
        userId,
        productId,
        rating,
        comment,
        isApproved: false,
      },
    });

    revalidatePath(`/product/${productId}`);
    return { success: "Yorumun alındı kral! Admin onayından sonra yayında." };
  } catch (error) {
    console.error("Review Error:", error);
    return { error: "Bir hata oluştu, veritabanına ulaşamadık." };
  }
}
