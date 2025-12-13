import prisma from "@/lib/prisma-client";
import { updateUser } from "@/lib/actions/user-actions";
import Link from "next/link";
import Image from "next/image";

export default async function AdminEditPage({
  params,
}: {
  params: { adminId: string };
}) {
  const user = await prisma.user.findUnique({
    where: { id: params.adminId },
  });

  if (!user || user.role !== "ADMIN") return <div>Yönetici bulunamadı.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link
        href="/admin/administrators"
        className="text-gray-500 hover:text-black mb-4 inline-block"
      >
        ← Yöneticilere Dön
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-purple-900">
        Yönetici Düzenle
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-purple-100">
        <div className="flex items-center gap-4 mb-8">
          <Image
            src={
              user.image ||
              `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`
            }
            width={64}
            height={64}
            alt=""
            className="rounded-full border-2 border-purple-200"
          />
          <div>
            <h2 className="font-bold text-lg">
              {user.firstName} {user.lastName}
            </h2>
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded flex items-center gap-1">
              🛡️ Tam Yetkili Yönetici
            </span>
          </div>
        </div>

        <form action={updateUser} className="space-y-4">
          <input type="hidden" name="id" value={user.id} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700">
                Ad
              </label>
              <input
                name="firstName"
                defaultValue={user.firstName || ""}
                className="w-full border border-gray-300 p-2 rounded focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-700">
                Soyad
              </label>
              <input
                name="lastName"
                defaultValue={user.lastName || ""}
                className="w-full border border-gray-300 p-2 rounded focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">
              Email
            </label>
            <input
              name="email"
              defaultValue={user.email || ""}
              className="w-full border border-gray-300 p-2 rounded focus:border-purple-500 outline-none"
            />
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
            ⚠️ Not: Yönetici yetkileri buradan değiştirilemez. Yetki değişimi
            için veritabanı yöneticisine başvurun.
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-2 rounded font-bold hover:bg-purple-800"
          >
            Yönetici Bilgilerini Güncelle
          </button>
        </form>
      </div>
    </div>
  );
}
