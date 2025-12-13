import { prisma } from "@/lib/prisma-client";
import CategoryManager from "./CategoryManager"; // Yol değişebilir

const CategoriesPage = async () => {
  const categories = await prisma.category.findMany({
    include: {
      parent: true, // Üst kategoriyi getir
      attributes: true, // Özellikleri getir
      brands: true, // 👈 BUNU YAZMAZSAN MARKA SAYISI HEP 0 VEYA ESKİ KALIR!
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <CategoryManager categories={categories} />
    </div>
  );
};

export default CategoriesPage;
