import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
// Az önce yaptığımız arama bileşenini ekliyoruz
import CustomerSearch from "@/components/features/admin/customers/customer-search";

// Next.js 15: searchParams bir Promise'dır
interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function CustomersPage({ searchParams }: PageProps) {
  // 1. URL'deki arama terimini alıyoruz (Await ile)
  const params = await searchParams;
  const query = params.q || "";

  // 2. Prisma sorgusunu güncelliyoruz
  const customers = await prisma.user.findMany({
    where: {
      role: "USER", // Sadece müşteriler
      // Eğer arama terimi varsa (query), filtrele:
      ...(query && {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } }, // Büyük/küçük harf duyarsız
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* BAŞLIK VE ARAMA ALANI (Yanyana getirdik) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Müşteriler</h1>

        {/* Arama Bileşeni Buraya */}
        <CustomerSearch />
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b uppercase font-semibold text-gray-600">
            <tr>
              <th className="p-4">Müşteri</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.length > 0 ? (
              customers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 flex items-center gap-3">
                    <Image
                      src={
                        user.image ||
                        `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
                      }
                      width={40}
                      height={40}
                      alt=""
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                        Müşteri
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">
                    {user.email}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/customers/${user.id}`}
                      className="text-blue-600 font-medium hover:underline hover:text-blue-800"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              /* Arama sonucu boşsa */
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  &quot;{query}&quot; ile eşleşen müşteri bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Toplam Sayı Göstergesi */}
      <div className="mt-4 text-sm text-gray-500 text-right">
        Toplam <strong>{customers.length}</strong> kayıt gösteriliyor.
      </div>
    </div>
  );
}
