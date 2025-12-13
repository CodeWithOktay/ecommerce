// src/lib/actions/settings-actions.ts
"use server";

import prisma from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";

// 1. Ayarları Getir (Yoksa varsayılanları oluşturur)
export async function getSettings() {
  const settings = await prisma.settings.upsert({
    where: { id: "general_settings" },
    update: {}, // Varsa dokunma
    create: {
      siteTitle: "KervanPazar",
      contactEmail: "destek@kervanpazar.com",
    },
  });
  return settings;
}

// 2. Ayarları Güncelle
export async function updateSettings(formData: FormData) {
  const data = {
    siteTitle: formData.get("siteTitle") as string,
    slogan: formData.get("slogan") as string,
    description: formData.get("description") as string,
    contactEmail: formData.get("contactEmail") as string,
    contactPhone: formData.get("contactPhone") as string,
    address: formData.get("address") as string,
    instagram: formData.get("instagram") as string,
    facebook: formData.get("facebook") as string,
    twitter: formData.get("twitter") as string,
    // Checkbox'lar form'da seçili değilse null gelir, kontrol ediyoruz:
    maintenance: formData.get("maintenance") === "on",
  };

  try {
    await prisma.settings.update({
      where: { id: "general_settings" },
      data: data,
    });

    revalidatePath("/"); // Tüm siteyi yenile ki footer vb. güncellensin
    return { success: true, message: "Ayarlar başarıyla kaydedildi." };
  } catch (error) {
    console.error("Ayarlar güncellenemedi:", error);
    return { success: false, message: "Bir hata oluştu." };
  }
}
