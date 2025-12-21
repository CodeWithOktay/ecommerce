import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import ProductForm from "@/components/features/admin/products/product-form";

// Define a type for the variant
type ProductVariant = {
  id: string;
  productId: string;
  name: string;
  color: string | null;
  size: string | null;
  stock: number;
  price: number | null;
  image: string | null;
};

// 1. Next.js 15 Standardı: params bir Promise'dir
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  // 2. KRİTİK ADIM: params'ı await edip 'id'yi alıyoruz
  // Klasör adın [id] olduğu için değişken adı da 'id' olmalı (productId değil)
  const { id } = await params;

  // 3. Prisma sorgusu
  const RawProduct = await prisma.product.findUnique({
    where: { id: id },
    include: {
      images: true,
      variants: true,
      attributeValues: {
        include: {
          attribute: true,
        },
      },
    },
  });
  if (!RawProduct) {
    notFound();
  }

  // Convert Decimal to number for price and salePrice
  const product = {
    ...RawProduct,
    price: RawProduct.price ? Number(RawProduct.price) : 0,
    salePrice: RawProduct.salePrice ? Number(RawProduct.salePrice) : null,
    variants: RawProduct.variants?.map((v: ProductVariant) => ({
      ...v,
      price: v.price ? Number(v.price) : 0,
    })),
  };

  // Form için gerekli yan verileri çek
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      brands: true,
      attributes: true,
      children: {
        include: {
          attributes: true,
          brands: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Ürünü Düzenle</h1>
      </div>

      <ProductForm
        initialData={product}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
