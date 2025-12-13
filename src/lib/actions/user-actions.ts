// src/lib/actions/user-actions.ts
"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// --- YENİ EKLENEN IMPORTLAR (Profil işlemleri için) ---
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import bcrypt from "bcrypt";

// ---------------------------------------------------------
// 1. ADMIN İÇİN: KULLANICI DÜZENLEME (Senin Kodun)
// ---------------------------------------------------------

const adminUserSchema = z.object({
  id: z.string(),
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçersiz e-posta"),
});

export async function updateUser(formData: FormData) {
  const rawData = {
    id: formData.get("id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
  };

  const validation = adminUserSchema.safeParse(rawData);

  if (!validation.success) {
    console.error("Validasyon hatası:", validation.error.flatten());
    return;
  }

  const { id, firstName, lastName, email } = validation.data;

  try {
    await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
      },
    });

    console.log(`Kullanıcı güncellendi: ${id}`);
  } catch (error) {
    console.error("Veritabanı hatası:", error);
    throw new Error("Kullanıcı güncellenemedi");
  }

  // Admin sayfalarını yenile
  revalidatePath("/admin/customers");
  revalidatePath("/admin/administrators"); // Admin listesi de varsa orayı da yenile
  revalidatePath(`/admin/customers/${id}`);

  // Burada redirect yapmak yerine sayfada kalmak istersen redirect'i kaldırabilirsin
  // Ama şimdilik senin yapına uygun kalsın:
  redirect("/admin/customers");
}

// ---------------------------------------------------------
// 2. MÜŞTERİ İÇİN: KENDİ PROFİLİNİ GÜNCELLEME (Yeni Eklenen)
// ---------------------------------------------------------

export async function updateMyProfile(formData: FormData) {
  // 1. Oturumu kontrol et (Güvenlik)
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor." };
  }

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const password = formData.get("password") as string;

  // Güncellenecek veriyi hazırla
  const updateData: any  = {
    firstName,
    lastName,
  };

  // Eğer şifre alanı doluysa şifreyi de güncelle
  if (password && password.trim() !== "") {
    if (password.length < 6) {
      return { success: false, message: "Şifre en az 6 karakter olmalıdır." };
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    updateData.passwordHash = hashedPassword;
  }

  try {
    // 2. Sadece oturum açan kişinin (session.user.id) verisini güncelle
    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // Profil sayfasını yenile ki yeni isim görünsün
    revalidatePath("/user/profile");

    return { success: true, message: "Profil başarıyla güncellendi." };
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    return { success: false, message: "Bir hata oluştu." };
  }
}
