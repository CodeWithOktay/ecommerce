"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options"; // Auth options yolun neredeyse oradan çek
import { Role } from "@prisma/client";

// 👮‍♂️ YARDIMCI FONKSİYON: Yetki Kontrolü
async function checkSuperAdmin() {
  const session = await getServerSession(authOptions);

  // Kullanıcı giriş yapmamışsa veya rolü SUPER_ADMIN değilse hata fırlat
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return false;
  }
  return true;
}

// 🟢 Yeni Admin Ekleme (Sadece Süper Admin Yapabilir)
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

// 🔴 Admin Silme (Sadece Süper Admin Yapabilir)
export async function deleteAdmin(userId: string) {
  const isSuperAdmin = await checkSuperAdmin();
  if (!isSuperAdmin) {
    return { success: false, message: "Yetkisiz işlem." };
  }

  // Kendini silmeye çalışırsa engelle
  const session = await getServerSession(authOptions);
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

// 🟡 Aktif/Pasif (Sadece Süper Admin)
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
  } catch (error) {
    return { success: false, message: "Güncellenemedi." };
  }
}

// 🔵 Admin Güncelleme (Sadece Süper Admin)
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
  const dataToUpdate: any = {
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
  } catch (error: any) {
    // Unique constraint hatası kontrolü (P2002)
    if (error.code === "P2002") {
      return { success: false, message: "Bu e-posta adresi kullanımda." };
    }
    return { success: false, message: "Güncelleme hatası oluştu." };
  }
}
