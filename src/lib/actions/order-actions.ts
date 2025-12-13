// actions/order-actions.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client"; // Import OrderStatus from @prisma/client

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const newStatus = formData.get("status") as OrderStatus;

  if (!newStatus) return;

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}
export async function getUserOrders() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return null;
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id, // Sadece bu kullanıcının siparişleri
      },
      orderBy: {
        createdAt: "desc", // En yeniden en eskiye
      },
      include: {
        items: {
          include: {
            product: true, // Ürün detaylarını (resim, isim) al
          },
        },
      },
    });

    return orders;
  } catch (error) {
    console.error("Siparişler çekilemedi:", error);
    return null;
  }
}
