// src/lib/actions/address-actions.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";

function capitalizeText(text: string) {
  if (!text) return "";
  return text.toLocaleUpperCase("tr-TR");
}

export async function createAddress(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: "Oturum açın." };

  const title = formData.get("title") as string;
  const firstName = capitalizeText(formData.get("firstName") as string);
  const lastName = capitalizeText(formData.get("lastName") as string);
  const city = capitalizeText(formData.get("city") as string);
  const district = capitalizeText(formData.get("district") as string);
  const addressLine = formData.get("addressLine") as string;

  const rawPhone = formData.get("phone") as string;
  const phone = rawPhone.replace(/\D/g, "");

  try {
    const existingAddressesCount = await prisma.address.count({
      where: { userId: session.user.id },
    });

    await prisma.address.create({
      data: {
        userId: session.user.id,
        title,
        firstName,
        lastName,
        phone,
        city,
        district,
        addressLine,
        isDefault: existingAddressesCount === 0,
      },
    });

    revalidatePath("/account/addresses");
    return { success: true, message: "Adres eklendi." };
  } catch (error) {
    return { success: false, message: "Hata oluştu." };
  }
}

export async function deleteAddress(addressId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: "Yetkisiz işlem." };

  try {
    const addressToDelete = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!addressToDelete || addressToDelete.userId !== session.user.id) {
      return { success: false, message: "Bu adresi silemezsiniz." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.delete({
        where: { id: addressId },
      });

      if (addressToDelete.isDefault) {
        const newDefaultCandidate = await tx.address.findFirst({
          where: { userId: session.user.id },
          orderBy: { createdAt: "desc" },
        });

        if (newDefaultCandidate) {
          await tx.address.update({
            where: { id: newDefaultCandidate.id },
            data: { isDefault: true },
          });
        }
      }
    });

    revalidatePath("/account/addresses");
    return { success: true, message: "Adres başarıyla silindi." };
  } catch (error) {
    console.error("Adres silme hatası:", error);
    return { success: false, message: "Silme işlemi sırasında hata oluştu." };
  }
}

export async function setDefaultAddress(addressId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: "Oturum açın." };

  try {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: addressId, userId: session.user.id },
        data: { isDefault: true },
      }),
    ]);

    revalidatePath("/account/addresses");
    return { success: true, message: "Varsayılan adres güncellendi. ✅" };
  } catch (error) {
    return { success: false, message: "İşlem başarısız." };
  }
}
