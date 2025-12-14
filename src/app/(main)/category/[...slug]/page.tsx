import { prisma } from "@/lib/prisma-client";
import ProductCard from "@/components/product/ProductCard"; // Default import kullanıyoruz
import { ChevronRight, Home, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string[]; // [...slug] olduğu için array gelir
  };
  searchParams: {
    sort?: string;
  };
}

export const revalidate = 0; // Her girişte güncel veri (Dynamic)

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  // 1. URL'den slug'ı al (Örn: /category/elektronik -> "elektronik")
  // [...slug] array olduğu için son parçayı alıyoruz.
  const categorySlug = params.slug[params.slug.length - 1];

  // 2. Kategoriyi Veritabanında Bul
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  // Kategori yoksa 404 sayfasına at
  if (!category) {
    notFound();
  }

  const sortParam = searchParams.sort;
  let orderBy: any = { createdAt: "desc" }; // Varsayılan: En yeniler

  if (sortParam === "price_asc") orderBy = { price: "asc" }; // Artan Fiyat
  if (sortParam === "price_desc") orderBy = { price: "desc" }; // Azalan Fiyat
  if (sortParam === "name_asc") orderBy = { name: "asc" }; // A-Z

  // 4. Bu Kategoriye Ait Ürünleri Çek
  const rawProducts = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      isActive: true, // Sadece aktifler
      isArchived: false, // Arşivlenmemişler
    },
    include: {
      images: true, // Resimler lazım
    },
    orderBy: orderBy,
  });

  // 5. Decimal -> Number Dönüşümü (ProductCard için)
  const products = rawProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    stock: p.stock,
    images: p.images.map((img) => ({
      url: img.url,
      isMain: img.isMain,
    })),
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* --- HEADER & BREADCRUMB --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              <Home size={16} />
            </Link>
            <ChevronRight size={16} />
            <span className="font-medium text-gray-900">{category.name}</span>
          </div>

          {/* Başlık ve Bilgi */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {category.name}
              </h1>
              <p className="text-gray-500 mt-2">
                Bu kategoride toplam <strong>{rawProducts.length}</strong> ürün
                bulundu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- İÇERİK --- */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SOL TARA: FİLTRELER (Şimdilik Statik Görünüm) */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 font-bold text-gray-900 mb-4 pb-4 border-b">
                <SlidersHorizontal size={20} />
                Filtrele
              </div>

              {/* Örnek Filtre Grubu */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-gray-900">
                  Fiyat Aralığı
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {/* Buraya ileride Slider veya Input eklenebilir */}
                  <span>Tüm Fiyatlar</span>
                </div>
              </div>
            </div>
          </aside>

          {/* SAĞ TARAF: ÜRÜN LİSTESİ */}
          <div className="flex-1">
            {/* Sıralama Mobilde Görünsün */}
            <div className="flex justify-end mb-6">
              {/* SortDropdown bileşenin varsa buraya ekleyebilirsin, 
                   yoksa şimdilik basit bir link listesi koyabiliriz */}
              <div className="flex gap-2 text-sm">
                <Link
                  href={`?sort=price_asc`}
                  className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
                >
                  En Düşük Fiyat
                </Link>
                <Link
                  href={`?sort=price_desc`}
                  className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
                >
                  En Yüksek Fiyat
                </Link>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  // ✅ ProductCard'a doğru veriyi yolluyoruz
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              // Ürün Yoksa
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <PackageIcon className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Ürün Bulunamadı
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-2">
                  Bu kategoride henüz aktif bir ürün bulunmuyor.
                </p>
                <Link
                  href="/"
                  className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Ana Sayfaya Dön
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// İkon komponenti (Aşağıda tanımladım ki import hatası olmasın)
function PackageIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16.5 9.4 7.55 5.35" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.29 7 12 12.03 20.71 7" />
      <path d="M12 22.03V12" />
    </svg>
  );
}
