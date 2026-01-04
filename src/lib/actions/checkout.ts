/**
 * Ödeme Sistemi Server Actions
 * 
 * Bu modül, sipariş oluşturma (checkout) süreçlerini yönetir:
 * - Sepet kontrolü ve stok doğrulama
 * - Stok düşümü ve sipariş oluşturma (Transaction ile atomik işlem)
 */

"use server";

import {prisma} from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

/**
 * Sepet Öğesi Tipi
 */
interface CartItemInput {
  productId: string;
  quantity: number;
}

/**
 * Sipariş Oluşturur (Checkout)
 * 
 * 1. Kullanıcı oturumunu kontrol eder.
 * 2. Sepetteki ürünlerin stoğunu veritabanından doğrular.
 * 3. Yeterli stok varsa, stoktan düşer ve siparişi oluşturur.
 * 4. Tüm bu işlemleri bir "Transaction" içinde yapar (Hepsi ya olur, ya hiçbiri olmaz).
 * 
 * @param cartItems - Sepetteki ürünler ve adetleri
 * @param address - Seçilen teslimat adresi
 * @returns Başarı durumu ve Sipariş ID'si
 */
export async function createOrder(cartItems: CartItemInput[], address: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { success: false, message: "Lütfen önce giriş yapın." };
  }

  if (cartItems.length === 0) {
    return { success: false, message: "Sepetiniz boş." };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of cartItems) {
        // Ürünü veritabanından güncel haliyle çek
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Ürün bulunamadı: ${item.productId}`);
        }

        // Stok kontrolü
        if (product.stock < item.quantity) {
          throw new Error(`Stok yetersiz: ${product.name}`);
        }

        const price = Number(product.price);
        totalAmount += price * item.quantity;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });

        // Stoktan düş
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Siparişi kaydet
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          total: totalAmount,
          status: "PENDING",
          customerName: session.user.name || "Müşteri",
          customerEmail: session.user.email || "",
          address: address, // Add the address to the order
          items: {
            create: orderItemsData,
          },
        },
      });

      return order;
    });

    return { success: true, orderId: result.id };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu";
    console.error("Sipariş hatası:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}
