import { prisma } from "@/lib/db";
import ProductDataTable from "@/components/features/admin/products/product-data-table";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductToolbar from "@/components/features/admin/products/product-toolbar";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

interface AdminProductsPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    status?: string;
    categoryId?: string;
    lowStock?: string;
  }>;
}

/**
 * Ürün Yönetimi Sayfası
 * 
 * Mağazadaki tüm ürünlerin listelendiği ana sayfa.
 * - URL parametreleri ile gelişmiş filtreleme (arama, stok durumu, arşiv, sıralama) yapar.
 * - Prisma 'where' ve 'orderBy' sorgularını dinamik olarak oluşturur.
 * - Tablo görünümü için veriyi formatlar.
 */
export default async function AdminProductsPage(props: AdminProductsPageProps) {
  const searchParams = await props.searchParams;

  const query = searchParams.q || "";
  const sortParam = searchParams.sort || "createdAt_desc";
  const statusParam = searchParams.status; // 'list', 'archived', 'out_of_stock'
  const categoryIdParam = searchParams.categoryId;
  const isLowStockParam = searchParams.lowStock === "true";

  /* 1. KATEGORİLERİ ÇEK (Filtreleme için) */
  const allCategories = await prisma.category.findMany({
    select: { id: true, name: true, parentId: true },
    orderBy: { name: "asc" }
  });

  /* 2. SIRALAMA */
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  // Eğer özel bir sıralama yoksa ve "list" veya varsayılan moddaysak createdAt_desc
  
  if (sortParam === "price_asc") orderBy = { price: "asc" };
  if (sortParam === "price_desc") orderBy = { price: "desc" };
  if (sortParam === "stock_asc") orderBy = { stock: "asc" };
  if (sortParam === "stock_desc") orderBy = { stock: "desc" };
  if (sortParam === "name_asc") orderBy = { name: "asc" };
  if (sortParam === "name_desc") orderBy = { name: "desc" };
  if (sortParam === "createdAt_asc") orderBy = { createdAt: "asc" };
  if (sortParam === "createdAt_desc") orderBy = { createdAt: "desc" };

  /* 3. FİLTRELEME MANTIĞI */
  const isViewingArchived = statusParam === "archived";
  const isViewingOutOfStock = statusParam === "out_of_stock";

  // Kategori Filtreleme Logic (Hiyararşik)
  let categoryFilterIds: string[] = [];
  if (categoryIdParam) {
    // 1. Seçili kategoriyi al
    categoryFilterIds = [categoryIdParam];
    
    // 2. Alt kategorilerini bul (1 seviye derinlik şimdilik yeterli, gerekirse recursive yapılır)
    const childCategories = allCategories.filter(c => c.parentId === categoryIdParam);
    childCategories.forEach(child => categoryFilterIds.push(child.id));
  }

  const where: Prisma.ProductWhereInput = {
    AND: [
      /* Sekme Mantığı */
      isViewingArchived
        ? { isArchived: true }
        : { isArchived: false }, // Aktif veya Tükendi sekmeleri arşivde OLMAMALI

      /* Tükendi Sekmesi */
      isViewingOutOfStock ? { stock: { equals: 0 } } : {},

      /* Stok Az Filtresi */
      !isViewingOutOfStock && isLowStockParam
        ? { stock: { gt: 0, lte: 10 } } // Stok 0'dan büyük ama 10 ve altı
        : {},

      /* Kategori Filtresi (Gelişmiş) */
      categoryIdParam ? { categoryId: { in: categoryFilterIds } } : {},

      // Arama Kutusu
      query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { category: { name: { contains: query, mode: "insensitive" } } },
              ...(query.length > 20 ? [{ id: { equals: query } }] : []),
            ],
          }
        : {},
    ],
  };

  // 4. VERİ ÇEKME
  const rawProducts = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      images: true,
      brand: true,
    },
  });

  // 5. FORMATLAMA
  const products = rawProducts.map((p) => {
    const imageList = p.images || [];
    const mainImage = imageList.find((img) => img.isMain) || imageList[0];

    return {
      id: p.id,
      name: p.name,
      price: Number(p.price),
      stock: p.stock,
      isActive: p.isActive,
      isArchived: p.isArchived,
      categoryName: p.category?.name || "Kategorisiz",
      brandName: p.brand?.name || "-",
      image: mainImage ? mainImage.url : "/placeholder.png",
      createdAt: p.createdAt,
    };
  });

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen">
      {/* ÜST BAŞLIK */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Ürün Yönetimi
          </h1>
          <p className="text-gray-500 text-lg font-medium">
            Mağaza envanterinizi buradan izleyin ve düzenleyin.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2.5 bg-gray-900 text-white px-7 py-3.5 rounded-2xl hover:bg-black hover:shadow-lg hover:shadow-gray-900/20 active:scale-95 transition-all duration-300 font-bold group"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
             <Plus size={18} strokeWidth={3} />
          </div>
          <span className="text-[15px]">Yeni Ürün Ekle</span>
        </Link>
      </div>

      {/* FILTER & TOOLBAR */}
      <ProductToolbar 
        count={products.length} 
        categories={allCategories}
      />

      {/* TABLO ALANI */}
      <ProductDataTable products={products} currentSort={sortParam} />
    </div>
  );
}
