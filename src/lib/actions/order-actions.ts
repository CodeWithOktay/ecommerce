"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma-client"; // Named import standartlaştı
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { createLog } from "@/lib/logger"; // 👈 Log sistemini ekledik

// 🟢 1. SİPARİŞ DURUM GÜNCELLEME (ADMIN)
export async function updateOrderStatus(orderId: string, formData: FormData) {
  try {
    const rawStatus = formData.get("status");

    if (!rawStatus || typeof rawStatus !== "string") {
      return;
    }

    // Enum kontrolü (Type Safety)
    const newStatus = rawStatus as OrderStatus;
    if (!Object.values(OrderStatus).includes(newStatus)) {
      throw new Error("Geçersiz sipariş durumu.");
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    // ✅ LOG KAYDI
    await createLog({
      action: "UPDATE_ORDER_STATUS",
      details: `Sipariş #${orderId.slice(-6).toUpperCase()} durumu güncellendi: ${newStatus}`,
      success: true,
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
  } catch (error) {
    console.error("Durum güncelleme hatası:", error);
    // ❌ HATA LOGU
    await createLog({
      action: "UPDATE_ORDER_STATUS_ERROR",
      details: `Sipariş durumu güncellenemedi (ID: ${orderId})`,
      success: false,
    });
  }
}

// 🟢 2. KULLANICI SİPARİŞLERİNİ GETİRME
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

// 🟢 3. SİPARİŞ OLUŞTURMA
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

  // GÜVENLİK DUVARI: ADMIN KONTROLÜ
  if (session.user.role === "ADMIN") {
    // 🚨 LOG: Admin sipariş vermeye çalıştı
    await createLog({
      action: "ADMIN_ORDER_ATTEMPT",
      details: `Admin hesabı (${session.user.email}) sipariş vermeye çalıştı, engellendi.`,
      success: false,
    });

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

    // ✅ LOG KAYDI
    await createLog({
      action: "CREATE_ORDER",
      details: `Yeni sipariş alındı: #${order.id.slice(-6).toUpperCase()} - Tutar: ${totalAmount}₺ - Müşteri: ${session.user.email}`,
      success: true,
    });

    revalidatePath("/admin/orders");

    return {
      success: true,
      message: "Siparişiniz başarıyla alındı! 🎉",
      orderId: order.id,
    };
  } catch (error) {
    console.error("Sipariş oluşturma hatası:", error);

    // ❌ HATA LOGU
    await createLog({
      action: "CREATE_ORDER_ERROR",
      details: `Sipariş oluşturulamadı: ${(error as Error).message}`,
      success: false,
    });

    return {
      success: false,
      message: "Sipariş oluşturulurken bir hata meydana geldi.",
    };
  }
}

// 🟢 4. SİPARİŞ İPTALİ
export async function cancelOrder(orderId: string, reason: string) {
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
      // 🚨 LOG: Yetkisiz iptal denemesi
      await createLog({
        action: "UNAUTHORIZED_CANCEL",
        details: `Yetkisiz sipariş iptal denemesi. Sipariş: ${orderId}, Kullanıcı: ${session.user.email}`,
        success: false,
      });
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
        cancelReason: reason,
      },
    });

    // ✅ LOG KAYDI
    await createLog({
      action: "CANCEL_ORDER",
      details: `Sipariş iptal edildi #${order.id.slice(-6).toUpperCase()}. Sebep: ${reason}`,
      success: true,
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
