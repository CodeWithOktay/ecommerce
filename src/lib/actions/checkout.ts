"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/actions/auth";
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

  try {
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

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

        const price = Number(product.price);
        totalAmount += price * item.quantity;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });

        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

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
