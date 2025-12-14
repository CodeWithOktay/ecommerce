// src/lib/actions/user-actions.ts
"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import bcrypt from "bcrypt";

// ---------------------------------------------------------
// 1. ADMIN İÇİN: KULLANICI DÜZENLEME (Mevcut Yapı)
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

  revalidatePath("/admin/customers");
  revalidatePath("/admin/administrators");
  revalidatePath(`/admin/customers/${id}`);

  redirect("/admin/customers");
}

// ---------------------------------------------------------
// 2. MÜŞTERİ İÇİN: KENDİ PROFİLİNİ GÜNCELLEME (GÜNCELLENDİ 🚀)
// ---------------------------------------------------------

export async function updateMyProfile(formData: FormData) {
  // 1. Oturum Kontrolü
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor." };
  }

  // 2. Form Verilerini Al
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phoneNumber = formData.get("phoneNumber") as string; // Şemadaki 'phoneNumber'
  const password = formData.get("password") as string;

  // Adres Verilerini Al
  const city = formData.get("city") as string;
  const district = formData.get("district") as string;
  const addressLine = formData.get("addressLine") as string;

  try {
    // --- A. KULLANICI BİLGİLERİNİ GÜNCELLE ---
    const updateData: any = {
      firstName,
      lastName,
      phoneNumber, // User tablosundaki telefon alanı
    };

    // Şifre değişikliği varsa
    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return { success: false, message: "Şifre en az 6 karakter olmalıdır." };
      }
      // Not: bcrypt veya bcryptjs kullanabilirsin, projendeki pakete göre.
      const hashedPassword = await bcrypt.hash(password, 12);
      updateData.passwordHash = hashedPassword;
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // --- B. ADRES İŞLEMLERİ ---
    // Kullanıcı adres alanlarından en az birini doldurduysa işlem yap
    if (city || district || addressLine) {
      // Kullanıcının en son güncellenen adresini bul
      const existingAddress = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
      });

      if (existingAddress) {
        // Varsa GÜNCELLE
        await prisma.address.update({
          where: { id: existingAddress.id },
          data: {
            title: existingAddress.title || "Ev Adresim",
            firstName: firstName, // Adresteki ismi de profil ile senkronize et
            lastName: lastName,
            phone: phoneNumber || "",
            city: city,
            district: district,
            addressLine: addressLine,
          },
        });
      } else {
        // Yoksa OLUŞTUR
        await prisma.address.create({
          data: {
            userId: session.user.id,
            title: "Varsayılan Adres",
            firstName: firstName,
            lastName: lastName,
            phone: phoneNumber || "",
            city: city || "",
            district: district || "",
            addressLine: addressLine || "",
            country: "Türkiye",
          },
        });
      }
    }

    // Profil sayfasını yenile
    revalidatePath("/account/profile");

    return {
      success: true,
      message: "Profil bilgileriniz başarıyla güncellendi. 🎉",
    };
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    return { success: false, message: "Güncelleme sırasında bir hata oluştu." };
  }
}

export async function getUserAddresses() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return [];
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });
    return addresses;
  } catch (error) {
    console.error("Adres çekme hatası:", error);
    return [];
  }
}
