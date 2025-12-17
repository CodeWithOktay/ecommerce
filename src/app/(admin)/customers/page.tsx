import prisma from "@/lib/prisma-client";
import Link from "next/link";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";

export default async function CustomersPage() {
  // SADECE MÜŞTERİLERİ GETİR
  const customers = await prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Müşteriler</h1>

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
            {customers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
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
                    <div className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      Müşteri
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/customers/${user.id}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Düzenle
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
