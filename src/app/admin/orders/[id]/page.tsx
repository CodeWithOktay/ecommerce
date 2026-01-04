import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import OrderDetailClient from "./order-detail-client";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Sipariş Detay Sayfası
 * 
 * Belirli bir siparişin tüm detaylarını (ürünler, müşteri, adres vb.) veritabanından çeker.
 * - Prisma ile ilişkili dataları (User, OrderItem, Product, Image) derinlemesine include eder.
 * - Decimal tiplerini (fiyat, tutar) client component'e göndermeden önce number'a çevirir.
 */
export default async function OrderDetailPage(props: OrderDetailPageProps) {
  const params = await props.params;
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: {
        include: {
          product: {
            include: { images: true },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Serialize dates and decimals if necessary, but passing direct usually works fine in latest Next.js server components if not passed to client yet. 
  // However, for Client Component props, we usually need simple JSON. 
  // Order items price is Decimal, total is Decimal. 
  // We need to convert them to numbers or strings for the client component to handle cleanly without warnings.
  
  const serializedOrder = {
    ...order,
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      product: {
        ...item.product,
        // Ensure other non-serializable fields are handled if any
      }
    })),
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10 font-sans">
      <OrderDetailClient order={serializedOrder} />
    </div>
  );
}
