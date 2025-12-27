import { prisma } from "@/lib/db";
import Image from "next/image";
import {
  AdminRowActions,
  CreateAdminButton,
} from "@/components/features/admin/admin-actions";

/**
 * Sistemdeki tüm yönetici (ADMIN) kullanıcıları listeleyen sunucu bileşeni.
 */
export default async function AdministratorsPage() {
  const admins = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* Üst Kısım: Başlık ve Ekleme Butonu */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yöneticiler</h1>
          <p className="text-gray-500 mt-1">
            Yetkili kullanıcıları yönetin ve düzenleyin.
          </p>
        </div>
        <CreateAdminButton />
      </div>

      <div className="bg-white border border-purple-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-purple-50 border-b border-purple-100 uppercase font-semibold text-purple-900">
            {/* DÜZELTME: tr içinde yorum satırı veya boşluk bırakmadık */}
            <tr>
              <th className="p-4">Yönetici</th>
              <th className="p-4">Email</th>
              <th className="p-4">Durum</th>
              <th className="p-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {admins.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-purple-50/40 transition-colors"
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
                    className="rounded-full ring-2 ring-purple-100"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-purple-600 font-bold bg-purple-100 px-2 py-0.5 rounded-full inline-block mt-1">
                      Admin
                    </div>
                  </div>
                </td>

                <td className="p-4 text-gray-600 font-medium">{user.email}</td>

                <td className="p-4">
                  {user.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      Pasif
                    </span>
                  )}
                </td>

                <td className="p-4 text-right">
                  <AdminRowActions user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {admins.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            Henüz sisteme kayıtlı bir yönetici bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
}
