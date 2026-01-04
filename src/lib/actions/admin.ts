/**
 * Admin Yönetimi Server Actions
 * 
 * Bu modül, yönetici hesaplarının yönetimini sağlar:
 * - Admin oluşturma/silme/güncelleme
 * - Aktif/Pasif durumu değiştirme
 * - Süper Admin yetki kontrolleri
 */

"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/lib/auth/session";

/**
 * Süper Admin Yetki Kontrolü
 * 
 * İşlemi yapan kullanıcının "SUPER_ADMIN" rolüne sahip olup olmadığını kontrol eder.
 * @returns {Promise<boolean>} Yetkili ise true, değilse false
 */
async function checkSuperAdmin() {
  const session = await getAdminSession();

  // Kullanıcı giriş yapmamışsa veya rolü SUPER_ADMIN değilse hata fırlat
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return false;
  }
  return true;
}

/**
 * Yeni Admin Oluşturur (Sadece Süper Admin)
 * 
 * Yeni bir yönetici hesabı oluşturur. Varsayılan olarak "ADMIN" rolü atanır.
 * 
 * @param formData - Form verileri (firstName, lastName, email, password)
 * @returns Başarı/hata durumu ve mesajı
 */
export async function createAdmin(formData: FormData) {
  // 1. Yetki Kontrolü
  const isSuperAdmin = await checkSuperAdmin();
  if (!isSuperAdmin) {
    return {
      success: false,
      message: "Buna yetkiniz yok! Sadece Ana Yönetici admin ekleyebilir.",
    };
  }

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!firstName || !email || !password) {
    return { success: false, message: "Eksik bilgi girdiniz." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        role: "ADMIN", // Yeni eklenenler "Alt Admin" (ADMIN) olarak başlar
        isActive: true,
      },
    });
    revalidatePath("/admin/administrators");
    return { success: true, message: "Alt Admin başarıyla oluşturuldu." };
  } catch {
    return { success: false, message: "Bu e-posta kullanımda." };
  }
}

/**
 * Admin Siler (Sadece Süper Admin)
 * 
 * Belirtilen yönetici hesabını siler.
 * Kişi kendini silemez.
 * 
 * @param userId - Silinecek admin ID'si
 * @returns Başarı/hata durumu
 */
export async function deleteAdmin(userId: string) {
  const isSuperAdmin = await checkSuperAdmin();
  if (!isSuperAdmin) {
    return { success: false, message: "Yetkisiz işlem." };
  }

  // Kendini silmeye çalışırsa engelle
  const session = await getAdminSession();
  if (session?.user.id === userId) {
    return { success: false, message: "Kendinizi silemezsiniz." };
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/admin/administrators");
    return { success: true };
  } catch {
    return { success: false, message: "Silinemedi." };
  }
}

/**
 * Admin Durumunu Değiştirir (Sadece Süper Admin)
 * 
 * Admin hesabını aktif veya pasif yapar.
 * Süper Admin hesabı pasife alınamaz.
 * 
 * @param userId - Admin ID'si
 * @param currentStatus - Mevcut durum
 * @returns Başarı/hata durumu
 */
export async function toggleAdminStatus(
  userId: string,
  currentStatus: boolean
) {
  const isSuperAdmin = await checkSuperAdmin();
  if (!isSuperAdmin) {
    return { success: false, message: "Yetkisiz işlem." };
  }

  // Ana yöneticiyi pasife çekmeyi engelle (Güvenlik önlemi)
  const targetUser = await prisma.user.findUnique({ where: { id: userId } });
  if (targetUser?.role === "SUPER_ADMIN") {
    return { success: false, message: "Ana Yönetici pasife alınamaz." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !currentStatus },
    });
    revalidatePath("/admin/administrators");
    return { success: true };
  } catch {
    return { success: false, message: "Güncellenemedi." };
  }
}

/**
 * Admin Bilgilerini Günceller (Sadece Süper Admin)
 * 
 * Adminin ad, soyad, e-posta ve şifresini günceller.
 * 
 * @param userId - Admin ID'si
 * @param formData - Yeni bilgiler
 * @returns Başarı/hata durumu
 */
export async function updateAdmin(userId: string, formData: FormData) {
  const isSuperAdmin = await checkSuperAdmin();
  if (!isSuperAdmin) {
    return {
      success: false,
      message: "Admin bilgilerini sadece Ana Yönetici düzenleyebilir.",
    };
  }

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email) {
    return { success: false, message: "Zorunlu alanları doldurun." };
  }

  // Typescript için veri yapısı
  const dataToUpdate: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash?: string;
  } = {
    firstName,
    lastName,
    email: email.toLowerCase(),
  };

  if (password && password.trim() !== "") {
    dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    revalidatePath("/admin/administrators");
    return { success: true, message: "Yönetici bilgileri güncellendi." };
  } catch (error) {
    // Unique constraint hatası kontrolü (P2002)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === "P2002") {
      return { success: false, message: "Bu e-posta adresi kullanımda." };
    }
    return { success: false, message: "Güncelleme hatası oluştu." };
  }
}
