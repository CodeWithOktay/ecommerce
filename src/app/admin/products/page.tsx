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
    isActive?: string;
  }>;
}

export default async function AdminProductsPage(props: AdminProductsPageProps) {
  const searchParams = await props.searchParams;

  const query = searchParams.q || "";
  const sortParam = searchParams.sort || "createdAt_desc";
  const statusParam = searchParams.status; // 'list' veya 'archived'
  const isActiveParam = searchParams.isActive;

  // 1. SIRALAMA
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sortParam === "price_asc") orderBy = { price: "asc" };
  if (sortParam === "price_desc") orderBy = { price: "desc" };
  if (sortParam === "stock_asc") orderBy = { stock: "asc" };
  if (sortParam === "stock_desc") orderBy = { stock: "desc" };
  if (sortParam === "name_asc") orderBy = { name: "asc" };

  // 2. FİLTRELEME MANTIĞI (Burayı sıkılaştırdık)
  // Eğer URL'de ?status=archived varsa -> SADECE Arşivlileri göster.
  // Yoksa (Varsayılan) -> SADECE Arşivde OLMAYANLARI göster.
  const isViewingArchived = statusParam === "archived";

  const where: Prisma.ProductWhereInput = {
    AND: [
      // 🔥 KESİN KURAL: Sekme neyse ona göre getir.
      // Arşiv sekmesindeysek isArchived: true, değilsek isArchived: false zorunlu.
      { isArchived: isViewingArchived },

      // Satış Durumu Filtresi (Sadece Liste modunda çalışır)
      // Seçim yapılmadıysa hepsini getir, yapıldıysa filtrele.
      !isViewingArchived && isActiveParam
        ? { isActive: isActiveParam === "true" }
        : {},

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

  // 3. VERİ ÇEKME
  const rawProducts = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      images: true,
      brand: true,
    },
  });

  // 4. FORMATLAMA
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
    <div className="p-6 md:p-10 max-w-[1800px] mx-auto space-y-8 min-h-screen bg-[#F9FAFB]">
      {/* ÜST BAŞLIK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Ürün Yönetimi
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Envanterini buradan profesyonelce yönet.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl hover:bg-black hover:shadow-xl hover:shadow-gray-200 active:scale-95 transition-all font-bold group"
        >
          <Plus
            size={20}
            className="group-hover:rotate-90 transition-transform"
          />
          Yeni Ürün Ekle
        </Link>
      </div>

      {/* TOOLBAR (Filtreler ve Sekmeler) */}
      <ProductToolbar count={products.length} />

      {/* TABLO ALANI */}
      <div className="bg-white border border-gray-200/60 rounded-3xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
        <ProductDataTable products={products} />
      </div>
    </div>
  );
}
