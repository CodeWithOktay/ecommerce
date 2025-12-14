"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

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
  if (!session || !session.user?.id) return null;

  try {
    return await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Siparişler çekilemedi:", error);
    return null;
  }
}

interface CartItemInput {
  productId: string;
  quantity: number;
  price: number;
}

export async function createOrder(
  cartItems: CartItemInput[],
  totalAmount: number,
  address: string
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return {
      success: false,
      message: "Sipariş vermek için giriş yapmalısınız.",
    };
  }

  //GÜVENLİK DUVARI: ADMIN KONTROLÜ
  if (session.user.role === "ADMIN") {
    return {
      success: false,
      message:
        "Yönetici (Admin) hesaplarıyla alışveriş yapılamaz. Lütfen müşteri hesabına geçin.",
    };
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: totalAmount,
        status: "PENDING",
        customerName: session.user.name || "Kullanıcı",
        customerEmail: session.user.email || "",
        address,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    revalidatePath("/admin/orders");

    return {
      success: true,
      message: "Siparişiniz başarıyla alındı! 🎉",
      orderId: order.id,
    };
  } catch (error) {
    console.error("Sipariş oluşturma hatası:", error);
    return {
      success: false,
      message: "Sipariş oluşturulurken bir hata meydana geldi.",
    };
  }
}

export async function cancelOrder(orderId: string, reason: string) {
  // 👈 reason eklendi
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor." };
  }

  if (!reason) {
    return { success: false, message: "Lütfen bir iptal nedeni belirtin." };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: false, message: "Sipariş bulunamadı." };
    }

    if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
      return { success: false, message: "Bu işlem için yetkiniz yok." };
    }

    if (order.status !== "PENDING") {
      return {
        success: false,
        message: "Sipariş işleme alındığı için iptal edilemiyor.",
      };
    }

    // Güncelleme işlemi
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        cancelReason: reason, // 👈 Nedeni buraya kaydediyoruz
      },
    });

    revalidatePath("/account/orders");
    revalidatePath("/admin/orders");

    return {
      success: true,
      message: "Sipariş iptal edildi. Geri bildiriminiz için teşekkürler.",
    };
  } catch (error) {
    console.error("İptal hatası:", error);
    return { success: false, message: "İşlem sırasında hata oluştu." };
  }
}
