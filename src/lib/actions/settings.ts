/**
 * Genel Ayarlar Yönetimi
 * 
 * Sitenin başlık, slogan, iletişim bilgileri ve sosyal medya linklerini yönetir.
 * Tek bir kayıt (general_settings) üzerinden çalışır.
 */

"use server";

import {prisma} from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Ayarları Getir
 * 
 * Veritabanından ayarları çeker. Eğer yoksa varsayılan değerlerle oluşturur.
 */
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

/**
 * Ayarları Güncelle
 * 
 * Admin panelinden gelen form verileriyle site ayarlarını günceller.
 * 
 * @param formData - Ayar verileri
 * @returns Başarı/hata durumu
 */
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
