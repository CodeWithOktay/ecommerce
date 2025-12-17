import prisma from "@/lib/prisma-client";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export default async function AdministratorsPage() {
  // SADECE YÖNETİCİLERİ GETİR
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Yöneticiler</h1>

      <div className="bg-white border border-purple-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-purple-50 border-b border-purple-100 uppercase font-semibold text-purple-900">
            <tr>
              <th className="p-4">Yönetici</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {admins.map((user) => (
              <tr key={user.id} className="hover:bg-purple-50/30">
                <td className="p-4 flex items-center gap-3">
                  <Image
                    src={
                      user.image ||
                      `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`
                    }
                    width={40}
                    height={40}
                    alt=""
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-purple-600 font-bold bg-purple-100 px-2 py-0.5 rounded-full inline-block mt-1">
                      Admin
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/administrators/${user.id}`}
                    className="text-purple-600 font-medium hover:underline"
                  >
                    Yönet
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
