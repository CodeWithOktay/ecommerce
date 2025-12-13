import { prisma } from "@/lib/prisma-client";
import { CategoryBrandForm } from "@/components/forms/Category-brand-form";

// Sayfa parametreleri (Next.js App Router standartı)
interface PageProps {
  params: {
    categoryId: string;
  };
}

const CategoryPage = async ({ params }: PageProps) => {
  // Kategoriyi ve içindeki markaları çekiyoruz
  const category = await prisma.category.findUnique({
    where: { id: params.categoryId },
    include: { brands: true }, // Markaları da getir!
  });

  if (!category) return <div>Kategori bulunamadı.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kategori: {category.name}</h1>

      {/* --- Mevcut Markaların Listesi --- */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Mevcut Markalar:</h2>
        <div className="flex flex-wrap gap-2">
          {category.brands.length === 0 ? (
            <span className="text-gray-500 italic">Henüz marka yok.</span>
          ) : (
            category.brands.map((brand) => (
              <span
                key={brand.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {brand.name}
              </span>
            ))
          )}
        </div>
      </div>

      {/* --- Marka Ekleme Formu --- */}
      <CategoryBrandForm categoryId={category.id} />
    </div>
  );
};

export default CategoryPage;
