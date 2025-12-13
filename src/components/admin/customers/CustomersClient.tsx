"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Role } from "@prisma/client"; // Prisma tiplerini kullanıyoruz
import { Search, Shield, Users, User as UserIcon } from "lucide-react";
import Link from "next/link";

interface UsersClientProps {
  initialUsers: User[];
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
  // 'ALL' | 'ADMIN' | 'USER'
  const [activeTab, setActiveTab] = useState<"ALL" | Role>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Önce Taba göre filtrele
  const filteredByTab = initialUsers.filter((user) => {
    if (activeTab === "ALL") return true;
    return user.role === activeTab;
  });

  // 2. Sonra Arama kelimesine göre filtrele
  const filteredUsers = filteredByTab.filter((user) => {
    const fullName =
      `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const email = (user.email || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || email.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* --- ÜST KISIM: İstatistik ve Arama --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Sekmeler (Tabs) */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("ADMIN")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "ADMIN"
                ? "bg-white shadow text-purple-600"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Shield size={16} />
            Yöneticiler ({initialUsers.filter((u) => u.role === "ADMIN").length}
            )
          </button>
          <button
            onClick={() => setActiveTab("USER")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "USER"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Users size={16} />
            Müşteriler ({initialUsers.filter((u) => u.role === "USER").length})
          </button>
        </div>

        {/* Arama Kutusu */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="İsim veya e-posta ara..."
            className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-gray-600 uppercase font-semibold">
            <tr>
              <th className="p-4">Kullanıcı</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Email</th>
              <th className="p-4">Kayıt Tarihi</th>
              <th className="p-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="p-4 flex items-center gap-3">
                  {/* Avatar Kısmı (width/height hatası düzeltildi) */}
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <Image
                      className="rounded-full object-cover"
                      src={
                        user.image ||
                        `https://ui-avatars.com/api/?name=${user.firstName || "U"}+${user.lastName || ""}&background=random`
                      }
                      alt="Avatar"
                      fill // Container'ı doldur
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-gray-400 text-xs">
                      ID: {user.id.slice(-4)}
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  {user.role === "ADMIN" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                      <Shield size={12} /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      <UserIcon size={12} /> Müşteri
                    </span>
                  )}
                </td>

                <td className="p-4 text-gray-600">{user.email}</td>

                <td className="p-4 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                </td>

                <td className="p-4 text-right">
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/customers/${user.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors hover:underline"
                    >
                      Düzenle
                    </Link>
                  </td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Users className="w-12 h-12 text-gray-300 mb-2" />
            <p>Kriterlere uygun kullanıcı bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
