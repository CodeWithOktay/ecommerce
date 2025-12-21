import { prisma } from "@/lib/db";
import ProductDataTable from "@/components/features/admin/products/product-data-table";
import Link from "next/link";
import { Plus } from "lucide-react";

// Cache'i kesin olarak kapatır
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const rawProducts = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
      brand: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. VERİYİ DÖNÜŞTÜR
  const products = rawProducts.map((p) => {
    const imageList = p.images || [];
    const mainImage = imageList.find((img) => img.isMain) || imageList[0];
    const imageUrl = mainImage ? mainImage.url : "/placeholder.png";

    return {
      id: p.id,
      name: p.name,
      price: Number(p.price),
      stock: p.stock,
      isActive: p.isActive,
      isArchived: p.isArchived,
      categoryName: p.category?.name || "Kategorisiz",
      brandName: p.brand?.name || "-",
      image: imageUrl,
    };
  });

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-1">
            Toplam {products.length} ürün listeleniyor.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all font-medium shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Yeni Ürün Ekle
        </Link>
      </div>

      {/* Ana Tablo */}
      <ProductDataTable products={products} />
    </div>
  );
}
