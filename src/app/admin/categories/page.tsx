import { prisma } from "@/lib/db";
import CategoryManager from "./category-manager"; // Yol değişebilir

const CategoriesPage = async () => {
  const categories = await prisma.category.findMany({
    include: {
      parent: true, // Üst kategoriyi getir
      attributes: true, // Özellikleri getir
      brands: true, 
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
