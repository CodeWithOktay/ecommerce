import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/features/product/product-card";
// Yeni oluşturduğumuz componenti import ediyoruz
import BrandFilter from "@/components/features/category/brand-filter";
import { X, ChevronRight, Home, Filter } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{
    sort?: string;
    brands?: string; // Brands parametresini ekledik
    [key: string]: string | string[] | undefined;
  }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const rawSlug = (await params).slug[(await params).slug.length - 1];
  const slug = decodeURIComponent(rawSlug);

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  return {
    title: category ? `${category.name} | KervanPazar` : "Kategori Bulunamadı",
  };
}

/**
 * Kategori Sayfası
 * 
 * Belirli bir kategorideki ürünleri listeler.
 * - Dinamik slug yapısı ile çalışır.
 * - Alt kategorileri recursive (iç içe) olarak bulur.
 * - Filtreleme (Marka) ve Sıralama (Fiyat) özelliklerini barındırır.
 */
export default async function CategoryPage({ params, searchParams }: Props) {
  const rawSlug = (await params).slug[(await params).slug.length - 1];
  const categorySlug = decodeURIComponent(rawSlug);

  // 1. Kategori ve Altları
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      children: {
        include: {
          children: true,
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  // 2. ID Listesi Oluşturma (Recursive mantık)
  // Kategori ağacındaki tüm alt kategorilerin ID'lerini toplar.
  // Böylece "Elektronik" seçildiğinde altındaki "Telefon" kategorisindeki ürünler de gelir.
  const allCategoryIds = [category.id];
  if (category.children) {
    category.children.forEach((child) => {
      allCategoryIds.push(child.id);
      if (child.children) {
        child.children.forEach((grandChild) => {
          allCategoryIds.push(grandChild.id);
        });
      }
    });
  }

  // --- YENİ EKLENEN KISIM: Markaları ve Sayıları Çekme ---
  // Bu sorgu, bu kategorilerde en az 1 ürünü olan markaları getirir
  // Ve o markanın BU kategorilerdeki ürün sayısını hesaplar.
  const rawBrands = await prisma.brand.findMany({
    where: {
      products: {
        some: {
          categoryId: { in: allCategoryIds },
          isActive: true,
          isArchived: false,
        },
      },
    },
    select: {
      id: true,
      name: true,
      products: {
        where: {
          categoryId: { in: allCategoryIds },
          isActive: true,
          isArchived: false,
        },
        select: { id: true }, // Sadece sayım için ID çekiyoruz
      },
    },
    orderBy: { name: "asc" },
  });

  // Marka verisini frontend'e uygun hale getir
  const brandsWithCounts = rawBrands.map((b) => ({
    id: b.id,
    name: b.name,
    count: b.products.length,
  }));
  // -----------------------------------------------------

  // 3. Sıralama ve Filtreleme Hazırlığı
  const resolvedSearchParams = await searchParams; // searchParams'ı await et
  const sortParam = resolvedSearchParams.sort;
  const brandsParam = resolvedSearchParams.brands;

  // Seçili markaları array'e çevir (Örn: "id1,id2" -> ["id1", "id2"])
  const selectedBrandIds = brandsParam ? brandsParam.split(",") : [];

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sortParam === "price_asc") orderBy = { price: "asc" };
  if (sortParam === "price_desc") orderBy = { price: "desc" };

  // 4. Ürünleri Çek
  const rawProducts = await prisma.product.findMany({
    where: {
      categoryId: { in: allCategoryIds },
      isActive: true,
      isArchived: false,
      // Eğer marka seçiliyse filtreye ekle
      ...(selectedBrandIds.length > 0 && {
        brandId: { in: selectedBrandIds },
      }),
    },
    include: {
      images: true,
      variants: true,
      category: { select: { parentId: true } }, // 🟢 Hiyerarşi için gerekli
    },
    orderBy: orderBy,
  });

  // 6. Kuponları Çek (YENİ)
  const rawCoupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      OR: [{ startDate: null }, { startDate: { lte: new Date() } }],
      AND: [{ OR: [{ endDate: null }, { endDate: { gte: new Date() } }] }],
    },
    orderBy: { value: "desc" },
  });

  const activeCoupons = rawCoupons.map((c) => ({
    ...c,
    value: Number(c.value),
    minAmount: Number(c.minAmount),
    usageLimit: c.usageLimit ? Number(c.usageLimit) : null,
    usedCount: c.usedCount || 0,
  }));

  // 5. Veri Dönüşümü
  const products = rawProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    stock: p.stock,
    images: p.images.map((img) => ({
      url: img.url,
      isMain: img.isMain,
    })),
    variants: p.variants.map((variant) => ({
      ...variant,
      price: Number(variant.price),
    })),
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* --- HEADER (Aynı) --- */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-4">
            <Link
              href="/"
              className="hover:text-[#667EEA] transition-colors flex items-center gap-1"
            >
              <Home size={12} /> Ana Sayfa
            </Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">{category.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {category.name}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Toplam{" "}
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>{" "}
                ürün listeleniyor
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- İÇERİK --- */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* SOL TARA: FİLTRELER */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* 1. Alt Kategoriler */}
              {category.children && category.children.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
                    Kategoriler
                  </h3>
                  <ul className="space-y-2.5">
                    {category.children.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/category/${sub.slug}`}
                          className="text-sm text-gray-600 hover:text-[#667EEA] hover:pl-1 transition-all flex items-center justify-between group"
                        >
                          {sub.name}
                          <ChevronRight
                            size={14}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#667EEA]"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {/* Ayırıcı Çizgi */}
                  <div className="my-6 border-b border-gray-100"></div>
                </div>
              )}

              {/* 2. Marka Filtresi (YENİ) */}
              <BrandFilter brands={brandsWithCounts} />
            </div>
          </aside>

          {/* SAĞ TARAF: ÜRÜN LİSTESİ */}
          <div className="flex-1">
            {/* Sıralama Barı */}
            {/* Sıralama Barı */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter size={16} />
                <span className="hidden sm:inline">Listeleme seçenekleri</span>

                {/* --- FİLTRE DURUMU VE TEMİZLEME BUTONU --- */}
                {selectedBrandIds.length > 0 && (
                  <div className="flex items-center gap-3 ml-2 border-l border-gray-200 pl-3">
                    {/* Seçili Sayısı */}
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-bold">
                      {selectedBrandIds.length} seçim
                    </span>

                    {/* FİLTREYİ TEMİZLE: Sıralamayı korur, markaları siler */}
                    <Link
                      href={`/category/${categorySlug}${sortParam ? `?sort=${sortParam}` : ""}`}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer group"
                      title="Filtreleri Temizle"
                    >
                      <div className="w-4 h-4 rounded-full bg-red-50 group-hover:bg-red-100 flex items-center justify-center">
                        <X size={10} />
                      </div>
                      <span className="hidden sm:inline">
                        Filtreleri Temizle
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-400 text-xs uppercase font-bold tracking-wide">
                  Sırala:
                </span>
                <div className="flex gap-2">
                  <Link
                    href={{
                      query: { ...resolvedSearchParams, sort: "price_asc" },
                    }}
                    className={`px-3 py-1.5 rounded-lg border transition-all text-xs sm:text-sm ${sortParam === "price_asc" ? "border-[#667EEA] text-[#667EEA] bg-indigo-50" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    Artan Fiyat
                  </Link>
                  <Link
                    href={{
                      query: { ...resolvedSearchParams, sort: "price_desc" },
                    }}
                    className={`px-3 py-1.5 rounded-lg border transition-all text-xs sm:text-sm ${sortParam === "price_desc" ? "border-[#667EEA] text-[#667EEA] bg-indigo-50" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    Azalan Fiyat
                  </Link>
                </div>
              </div>
            </div>

            {/* Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      price: Number(product.price),
                      salePrice: product.salePrice
                        ? Number(product.salePrice)
                        : null,
                      variants:
                        product.variants?.map((v) => ({
                          ...v,
                          price: v.price ? Number(v.price) : null,
                          salePrice: v.salePrice ? Number(v.salePrice) : null,
                        })) || [],
                      category: product.category, // 🟢 Hiyerarşi parentId
                    }}
                    coupons={activeCoupons} // 🟢 Kuponlar
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <PackageIcon className="text-gray-300 w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Ürün Bulunamadı
                </h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                  {selectedBrandIds.length > 0
                    ? "Seçilen markalara ait bu kategoride ürün bulunamadı."
                    : "Bu kategoride henüz ürün bulunmuyor."}
                </p>

                {selectedBrandIds.length > 0 && (
                  <Link
                    href={`/category/${categorySlug}`}
                    className="mt-4 text-indigo-600 font-medium hover:underline text-sm"
                  >
                    Filtreleri Temizle
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon
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
