import { prisma } from "@/lib/prisma-client";
import ProductDataTable from "@/components/admin/products/ProductDataTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  // 1. VERİYİ ÇEK (İlişkilerle Beraber)
  const rawProducts = await prisma.product.findMany({
    include: {
      category: true, // Kategori ismini almak için
      images: true, // Resim URL'ini almak için
      brand: true, // Marka ismini almak için
    },
    orderBy: { createdAt: "desc" }, // En yeni en üstte
  });

  // 2. VERİYİ DÖNÜŞTÜR (Frontend için basitleştir)
  const products = rawProducts.map((p) => {
    // Ana görseli bul (Yoksa ilkini al, o da yoksa placeholder)
    const mainImage = p.images.find((img) => img.isMain) || p.images[0];

    return {
      id: p.id,
      name: p.name,
      price: Number(p.price), // Decimal -> Number
      stock: p.stock,
      isActive: p.isActive,
      isArchived: p.isArchived,

      // İlişkisel verileri düzleştiriyoruz (Flattening)
      categoryName: p.category.name,
      brandName: p.brand?.name || "-", // Marka yoksa tire koy

      // Resim objesi yerine direkt URL string'i yolluyoruz
      image: mainImage ? mainImage.url : "/placeholder.png",
    };
  });

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Başlık ve Ekle Butonu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-1">
            Stok takibi, fiyat güncelleme ve arşivleme işlemleri.
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

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Toplam Ürün" value={products.length} />
        <StatCard
          title="Aktif Satış"
          value={products.filter((p) => p.isActive && !p.isArchived).length}
          color="text-emerald-600"
        />
        <StatCard
          title="Kritik Stok"
          value={products.filter((p) => p.stock < 10).length}
          color="text-amber-600"
        />
        <StatCard
          title="Arşiv"
          value={products.filter((p) => p.isArchived).length}
          color="text-gray-500"
        />
      </div>

      {/* Ana Tablo */}
      {/* Artık 'products' değişkeni tablonun beklediği formata (image string, brandName vb.) sahip */}
      <ProductDataTable products={products} />
    </div>
  );
}

// Basit İstatistik Kartı
function StatCard({ title, value, color = "text-gray-900" }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
        {title}
      </p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}
