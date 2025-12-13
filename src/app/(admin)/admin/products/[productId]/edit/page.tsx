import { prisma } from "@/lib/prisma-client";
import ProductForm from "@/components/admin/products/ProductForm";
import { notFound } from "next/navigation";

interface Props {
  params: { productId: string };
}

export default async function EditProductPage({ params }: Props) {
  // 1. Kategorileri Çek (Hiyerarşik + Özellikler)
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: { attributes: true },
      },
      attributes: true,
    },
    orderBy: { name: "asc" },
  });

  // 2. Markaları Çek (⚠️ EKSİKTİ, EKLENDİ)
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  // 3. Ürünü Detaylı Çek (⚠️ include EKLENDİ)
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    include: {
      variants: true, // Varyantları getir
      attributeValues: true, // Özellik değerlerini getir
      images: true, // Resimleri getir
    },
  });

  if (!product) {
    notFound();
  }

  // 4. Decimal -> Number Dönüşümü (Serialization)
  // Form bileşeni Decimal tipini (obje) sevmez, düz sayı (number) ister.
  const formattedProduct = {
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    // Varyantların içindeki Decimal fiyatları da çeviriyoruz (varsa)
    variants: product.variants.map((v) => ({
      ...v,
      price: v.price ? Number(v.price) : null,
    })),
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50/50 min-h-screen">
      <ProductForm
        categories={categories}
        brands={brands} // ✅ Artık tanımlı
        initialData={formattedProduct}
      />
    </div>
  );
}
