import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import RestoreProductButton from "@/components/features/admin/products/product-actions";
import DeleteProductButton from "@/components/features/admin/products/product-actions";

export default async function ArchivePage() {
  // Veritabanından sadece PASİF (Arşivlenmiş) ürünleri çekiyoruz
  // İlişkili tabloları (category ve images) include etmeyi unutmuyoruz
  const archivedProducts = await prisma.product.findMany({
    where: { isActive: false },
    include: {
      category: true,
      images: true, // Ürün resimlerini de buradan çekiyoruz
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-8">
      {/* Üst Başlık ve Geri Dön Butonu */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-red-700">Çöp Kutusu</h1>
          <p className="text-sm text-gray-500">
            Bu ürünler şu an müşterilere gözükmüyor.
          </p>
        </div>
      </div>

      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-red-50 border-b border-red-100">
            <tr>
              <th className="p-3">Resim</th>
              <th className="p-3">Ürün Adı</th>
              <th className="p-3">Fiyat</th>
              <th className="p-3 text-right">İşlemler (Kurtar / Yok Et)</th>
            </tr>
          </thead>
          <tbody>
            {archivedProducts.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {/* Resim objesinin içinden url bilgisini alıyoruz */}
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="object-cover rounded border opacity-50 grayscale" // Arşivde olduğu belli olsun diye soluk ve siyah-beyaz yaptık
                      unoptimized
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded"></div>
                  )}
                </td>
                <td className="p-3 font-medium text-gray-600 line-through">
                  {/* Üstü çizili isim */}
                  {product.name}
                </td>
                {/* Decimal tipindeki fiyatı ekrana basmak için string'e çeviriyoruz */}
                <td className="p-3 text-gray-500">
                  {product.price.toString()} TL
                </td>
                <td className="p-3 text-right flex justify-end gap-3">
                  {/* 1. Geri Yükle (Yeşil Buton) */}
                  <RestoreProductButton id={product.id} isArchived={true} />

                  {/* 2. Kalıcı Sil (Kırmızı Buton) */}
                  <DeleteProductButton id={product.id} isArchived={true} />
                </td>
              </tr>
            ))}

            {archivedProducts.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-500">
                  <div className="text-4xl mb-2">✨</div>
                  Çöp kutusu boş, arşivlenmiş ürün yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
