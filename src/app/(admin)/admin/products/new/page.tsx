import { prisma } from "@/lib/prisma-client";
import ProductForm from "@/components/admin/products/ProductForm";

export const dynamic = "force-dynamic";

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
