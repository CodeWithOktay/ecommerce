"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { OrderStatus, Role } from "@prisma/client";
import { createLog } from "@/lib/logger";

interface CartItemInput {
  productId: string;
  quantity: number;
  price: number;
}

// 🟢 1. SİPARİŞ OLUŞTURMA (P2003 Fixli)
export async function createOrder(
  cartItems: CartItemInput[],
  totalAmount: number,
  address: string
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { success: false, message: "Sipariş vermek için giriş yapmalısınız." };
  }

  // 🛡️ GÜVENLİK DUVARI: ADMIN KONTROLÜ
  // Adminler genelde test yaparken sepeti bozabiliyor, onları engelliyoruz.
  if (session.user.role === Role.ADMIN || session.user.role === Role.SUPER_ADMIN) {
    await createLog({
      action: "ADMIN_ORDER_ATTEMPT",
      details: `Admin hesabı (${session.user.email}) sipariş vermeye çalıştı, engellendi.`,
      success: false,
    });
    return {
      success: false,
      message: "Yönetici hesaplarıyla sipariş verilemez. Lütfen müşteri hesabıyla deneyin.",
    };
  }

  try {
    // 🔍 KRİTİK KONTROL: ID Doğrulama (P2003 Hatasını Önler)
    const productIds = cartItems.map((item) => item.productId);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });

    if (existingProducts.length !== productIds.length) {
      const existingIds = existingProducts.map((p) => p.id);
      const missingIds = productIds.filter((id) => !existingIds.includes(id));
      console.error("❌ Veritabanında bulunamayan ürünler var:", missingIds);
      
      return {
        success: false,
        message: "Sepetinizdeki bazı ürünler güncelliğini yitirmiş. Lütfen sepeti yenileyin.",
      };
    }

    // 🚀 SİPARİŞİ OLUŞTUR
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: totalAmount,
        status: OrderStatus.PENDING,
        customerName: session.user.name || "İsimsiz Kullanıcı",
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

    // ✅ BAŞARILI LOGU
    await createLog({
      action: "CREATE_ORDER",
      details: `Yeni sipariş alındı: #${order.id.slice(-6).toUpperCase()} - Tutar: ${totalAmount}₺`,
      success: true,
    });

    revalidatePath("/admin/orders");
    revalidatePath("/account/orders");

    return {
      success: true,
      message: "Siparişiniz başarıyla alındı! 🎉",
      orderId: order.id,
    };
  } catch (error) {
    console.error("🔥 Sipariş oluşturma hatası:", error);
    
    await createLog({
      action: "CREATE_ORDER_ERROR",
      details: `Sipariş hatası: ${(error as Error).message}`,
      success: false,
    });

    return {
      success: false,
      message: "Sipariş işlenirken bir sorun oluştu. Lütfen tekrar deneyin.",
    };
  }
}

// 🟢 2. SİPARİŞ DURUM GÜNCELLEME (ADMIN)
export async function updateOrderStatus(
  orderIds: string | string[],
  status: OrderStatus
) {
  try {
    const ids = Array.isArray(orderIds) ? orderIds : [orderIds];

    const updates = await prisma.$transaction(
      ids.map((id) =>
        prisma.order.update({
          where: { id },
          data: { status },
        })
      )
    );

    await Promise.all(
      updates.map((order) =>
        createLog({
          action: "UPDATE_ORDER_STATUS",
          details: `Sipariş #${order.id.slice(-6).toUpperCase()} yeni durum: ${status}`,
          success: true,
        })
      )
    );

    revalidatePath("/admin/orders");
    ids.forEach((id) => revalidatePath(`/admin/orders/${id}`));

    return { success: true };
  } catch (error) {
    console.error("Durum güncelleme hatası:", error);
    return { success: false, error: "Durum güncellenemedi." };
  }
}

// 🟢 3. KULLANICI SİPARİŞLERİNİ GETİRME
export async function getUserOrders() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  try {
    return await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
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

// 🟢 4. SİPARİŞ İPTALİ
export async function cancelOrder(orderId: string, reason: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: "Oturum açın." };

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order || (order.userId !== session.user.id && session.user.role !== Role.ADMIN)) {
      return { success: false, message: "Yetkisiz işlem." };
    }

    if (order.status !== OrderStatus.PENDING) {
      return { success: false, message: "Bu aşamada iptal edilemez." };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        cancelReason: reason,
      },
    });

    revalidatePath("/account/orders");
    return { success: true, message: "Sipariş iptal edildi." };
  } catch (error) {
    return { success: false, message: "Hata oluştu." };
  }
}

// 🟢 5. ADRES GÜNCELLEME (PENDING only)
export async function updateOrderAddress(orderId: string, address: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: "Oturum açın." };

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order || (order.userId !== session.user.id && session.user.role !== Role.ADMIN)) {
      return { success: false, message: "Yetkisiz işlem." };
    }

    if (order.status !== OrderStatus.PENDING) {
      return { success: false, message: "Sadece beklemedeki siparişlerin adresi güncellenebilir." };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { address },
    });

    await createLog({
      action: "UPDATE_ORDER_ADDRESS",
      details: `Sipariş #${order.id.slice(-6).toUpperCase()} adres güncellendi. Yeni Adres: ${address.slice(0, 50)}...`,
      success: true,
    });

    revalidatePath("/account/orders");
    if (session.user.role === Role.ADMIN) {
      revalidatePath(`/admin/orders/${orderId}`);
    }

    return { success: true, message: "Adres başarıyla güncellendi." };
  } catch (error) {
    console.error("Adres güncelleme hatası:", error);
    return { success: false, message: "Adres güncellenemedi." };
  }
}