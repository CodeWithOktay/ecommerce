"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

// 🟢 ZOD ŞEMASI (Yapı bozulmadı, sadece formdaki diğer alanlar eklendi)
const userSchema = z.object({
  id: z.string(),
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçersiz e-posta"),
  phoneNumber: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const purePhone = val.replace(/\s/g, "");
        return /^\d{11}$/.test(purePhone);
      },
      { message: "Telefon 11 haneli olmalıdır (05...)" }
    ),
  // 👇 Formdan gelen ama şemada olmayan alanları ekliyoruz
  currentPassword: z.string().optional().nullable(),
  newPassword: z.string().optional().nullable(),
  confirmPassword: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  addressLine: z.string().optional().nullable(),
  role: z.string().optional(),
  isActive: z.string().optional().nullable(),
});

export async function updateUserProfile(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validated = userSchema.safeParse(rawData);

    if (!validated.success) {
      // Hangi alanın hata verdiğini logla (debug için)
      console.log("❌ Zod Hatası:", validated.error.format());
      return { success: false, message: validated.error.issues[0].message };
    }

    const {
      id,
      firstName,
      lastName,
      email,
      phoneNumber,
      currentPassword,
      newPassword,
      city,
      district,
      addressLine,
      role,
      isActive,
    } = validated.data;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return { success: false, message: "Kullanıcı bulunamadı." };

    // 1. Profil Verileri Hazırla
    const updateData: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
      role?: Role; // 👈 BURAYI string YERİNE Role YAPTIK
      isActive?: boolean;
      passwordHash?: string;
    } = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      phoneNumber: phoneNumber?.replace(/\s/g, ""),
    };

    if (role) {
      // Artık güvenle cast edebilirsin, updateData.role artık string değil Role tipinde
      updateData.role = role as Role;
    }
    if (isActive !== undefined)
      updateData.isActive = isActive === "on" || isActive === "true";

    // 2. 🔐 ŞİFRE DEĞİŞTİRME MANTIĞI
    if (newPassword && newPassword.trim().length > 0) {
      if (!currentPassword) {
        return { success: false, message: "Mevcut şifrenizi girmelisiniz." };
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        user.passwordHash || ""
      );
      if (!isMatch) {
        return { success: false, message: "Mevcut şifreniz hatalı!" };
      }

      if (newPassword.length < 6) {
        return {
          success: false,
          message: "Yeni şifre en az 6 karakter olmalı.",
        };
      }

      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // 3. 🏠 ADRES GÜNCELLEME (UPSERT)
    if (city || district || addressLine) {
      const userAddress = await prisma.address.findFirst({
        where: { userId: id },
      });

      if (userAddress) {
        await prisma.address.update({
          where: { id: userAddress.id },
          data: {
            city: city || "",
            district: district || "",
            addressLine: addressLine || "",
          },
        });
      } else {
        await prisma.address.create({
          data: {
            userId: id,
            city: city || "",
            district: district || "",
            addressLine: addressLine || "",
            title: "Ev Adresi",
            firstName,
            lastName,
            phone: phoneNumber?.replace(/\s/g, "") || "",
          },
        });
      }
    }
    // 4. Veritabanı Güncelle
    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/account/profile");
    revalidatePath(`/admin/customers/${id}`);

    return {
      success: true,
      message: "Profilin mermi gibi güncellendi kral! 🎉",
    };
  } catch (error) {
    console.error("🔥 Update Error:", error);
    return { success: false, message: "Bir hata oluştu, tekrar dene." };
  }
}

export async function getUserAddresses() {
  try {
    // Session'ı burada kontrol etmemiz lazım çünkü bu bir Server Action
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth/options"); // Kendi yoluna göre düzelt

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return [];
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: "desc" }, // Önce varsayılan adresi getir
    });

    // 🟢 KRİTİK: Next.js 15 Decimal hatası vermemesi için serialize ediyoruz
    return JSON.parse(JSON.stringify(addresses));
  } catch (error) {
    console.error("Adres çekme hatası:", error);
    return [];
  }
}
