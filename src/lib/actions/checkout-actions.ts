"use server";

import prisma from "@/lib/prisma-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";

interface CartItemInput {
  productId: string;
  quantity: number;
}

export async function createOrder(cartItems: CartItemInput[], address: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { success: false, message: "Lütfen önce giriş yapın." };
  }

  if (cartItems.length === 0) {
    return { success: false, message: "Sepetiniz boş." };
  }

  // Transaction Başlatıyoruz (Ya hepsi çalışır ya hiçbiri)
  try {
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      // 1. Ürünleri ve Stokları Kontrol Et
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Ürün bulunamadı: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stok yetersiz: ${product.name}`);
        }

        // Fiyatı veritabanından alıyoruz (Frontend'e güvenilmez!)
        const price = Number(product.price);
        totalAmount += price * item.quantity;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });

        // 2. Stoktan Düş
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 3. Siparişi Oluştur
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          total: totalAmount,
          status: "PENDING",
          customerName: session.user.name || "Müşteri",
          customerEmail: session.user.email || "",
          items: {
            create: orderItemsData,
          },
        },
      });

      return order;
    });

    return { success: true, orderId: result.id };
  } catch (error: any) {
    console.error("Sipariş hatası:", error);
    return {
      success: false,
      message: error.message || "Sipariş oluşturulamadı.",
    };
  }
}
