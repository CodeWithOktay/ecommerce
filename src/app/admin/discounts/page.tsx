import { prisma } from "@/lib/db";
import DiscountsClient from "./discounts-client";

export default async function DiscountsPage() {
  // 👇 GÜNCELLENDİ: include: { brands: true } eklendi
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { brands: true },
  });

  // Eğer "Tüm Mağaza" seçilirse diye tüm markaları da ayrıca çekebiliriz veya kategorilerden türetebiliriz.
  // Ama pratik olsun diye tüm markaları da çekelim.
  const allBrands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });
  const rawCoupons = await prisma.coupon.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const coupons = rawCoupons.map((coupon) => ({
    ...coupon,
    value: Number(coupon.value), // Decimal -> Number (Hatanın kökü burası)
    minAmount: Number(coupon.minAmount), // Decimal -> Number
    // Tarihler bazen Serialization hatası verebilir, garanti olsun diye:
    startDate: coupon.startDate?.toISOString() || null,
    endDate: coupon.endDate?.toISOString() || null,
    createdAt: coupon.createdAt.toISOString(),
    updatedAt: coupon.updatedAt.toISOString(),
  }));
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Kampanya Merkezi 🚀
        </h1>
        <p className="text-gray-500">
          Kupon kodları oluştur veya marka/kategori bazlı indirim yap.
        </p>
      </div>

      {/* allBrands prop'unu da ekledik */}
      <DiscountsClient
        categories={categories}
        coupons={coupons} // Tertemiz veri!
        allBrands={allBrands}
      />
    </div>
  );
}
