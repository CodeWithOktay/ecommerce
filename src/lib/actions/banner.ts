"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- BANNER EKLE ---
export async function createBanner(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const link = formData.get("link") as string;
    const order = Number(formData.get("order") || 0);
    const isActive = formData.get("isActive") === "on"; // Checkbox kontrolü

    if (!title || !imageUrl) {
      return { success: false, message: "Başlık ve Resim URL zorunludur." };
    }

    await prisma.banner.create({
      data: {
        title,
        description,
        imageUrl,
        link,
        order,
        isActive,
      },
    });

    // Ana sayfayı ve admin panelini yenile ki yeni banner görünsün
    revalidatePath("/");
    revalidatePath("/admin/banners");

    return { success: true, message: "Banner başarıyla oluşturuldu! 🚀" };
  } catch (error) {
    console.error("Banner Create Error:", error);
    return { success: false, message: "Banner oluşturulurken hata çıktı." };
  }
}

// --- BANNER SİL ---
export async function deleteBanner(id: string) {
  try {
    await prisma.banner.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/banners");

    return { success: true, message: "Banner silindi." };
  } catch {
    return { success: false, message: "Silinemedi." };
  }
}

// --- AKTİF/PASİF YAP ---
export async function toggleBannerStatus(id: string, currentStatus: boolean) {
  try {
    await prisma.banner.update({
      where: { id },
      data: { isActive: !currentStatus },
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");

    return { success: true, message: "Durum güncellendi." };
  } catch {
    return { success: false, message: "Güncellenemedi." };
  }
}

export async function updateBanner(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const link = formData.get("link") as string;
    const order = Number(formData.get("order") || 0);
    const isActive = formData.get("isActive") === "on";

    if (!id || !title || !imageUrl) {
      return { success: false, message: "Eksik bilgi." };
    }

    await prisma.banner.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        link,
        order,
        isActive,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");

    return { success: true, message: "Banner güncellendi! ✅" };
  } catch {
    return { success: false, message: "Güncelleme başarısız." };
  }
}
