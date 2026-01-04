import { prisma } from "@/lib/db";
import ProductForm from "@/components/features/admin/products/product-form";

export const dynamic = "force-dynamic";

/**
 * Yeni Ürün Ekleme Sayfası
 * 
 * Yeni bir ürün oluşturmak için gerekli formu gösterir.
 * - Kategori ve marka verilerini veritabanından çekerek forma (`ProductForm`) iletir.
 * - İç içe geçmiş kategori yapısını (children, attributes) dahil eder.
 */
export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      brands: true,
      children: {
        include: {
          attributes: true,
          brands: true,
        },
      },
      attributes: true,
    },
    orderBy: { name: "asc" },
  });

  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6 md:p-8 bg-gray-50/50 min-h-screen">
      <ProductForm categories={categories} brands={brands} initialData={null} />
    </div>
  );
}
