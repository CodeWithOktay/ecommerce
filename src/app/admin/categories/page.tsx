import { prisma } from "@/lib/db";
import CategoryManager from "./category-manager"; // Yol değişebilir

/**
 * Kategoriler Sayfası (Server Component)
 * 
 * Tüm kategorileri veritabanından çeker ve yönetim bileşenine iletir.
 * - Parent (Üst kategori), Attributes (Özellikler) ve Brands (Markalar) detaylarını içerir.
 */
const CategoriesPage = async () => {
  const categories = await prisma.category.findMany({
    include: {
      parent: true, // Üst kategoriyi getir
      attributes: true, // Özellikleri getir
      brands: true, 
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="p-6">
      <CategoryManager categories={categories} />
    </div>
  );
};

export default CategoriesPage;
