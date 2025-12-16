import { prisma } from "@/lib/prisma-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Favorilerim | KervanPazar",
};

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  // 1. Giriş kontrolü
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/favorites");
  }

  // 2. Favorileri çek (Ürün detaylarıyla beraber)
  const favorites = await prisma.favorite.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: {
        include: {
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // En son eklenen en başa
    },
  });

  // 3. Veriyi ProductCard formatına uyarla (Decimal -> Number)
  const products = favorites.map((fav) => {
    const p = fav.product;
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      stock: p.stock,
      images: p.images.map((img) => ({
        url: img.url,
        isMain: img.isMain,
      })),
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-white rounded-xl shadow-sm text-red-500">
            <Heart size={24} className="fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Favorilerim</h1>
            <p className="text-gray-500 text-sm">
              Beğendiğiniz ve takip ettiğiniz <strong>{products.length}</strong>{" "}
              ürün var.
            </p>
          </div>
        </div>

        {/* LİSTELEME ALANI */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              // Zaten ProductCard içinde FavoriteButton var, o yüzden burada çalışır.
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          // BOŞ STATE (Favori Yoksa)
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Heart size={48} className="text-red-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Listeniz Henüz Boş
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Beğendiğiniz ürünleri kalp ikonuna tıklayarak buraya ekleyebilir,
              fiyat takibi yapabilirsiniz.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all hover:-translate-y-1"
            >
              <ShoppingBag size={20} />
              Alışverişe Başla
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
