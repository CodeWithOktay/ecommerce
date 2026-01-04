"use client";

import { Download } from "lucide-react";

import { User } from "@prisma/client";

interface Props {
  data: User[];
}

/**
 * Dışa Aktarma Butonu (CSV/Excel)
 * 
 * Verilen veri setini (dizi) tarayıcı tarafında CSV formatına çevirir
 * ve indirme işlemi başlatır.
 * - Sunucuya istek atmaz, tamamen client-side çalışır.
 * - UTF-8 desteği ile Türkçe karakterleri korur.
 */
export default function ExportButton({ data }: Props) {
  const handleExport = () => {
    // 1. Create CSV header
    const headers = ["ID", "Isim", "Soyisim", "Email", "Telefon", "Rol", "Kayit Tarihi"];
    
    // 2. Format data rows
    const rows = data.map(user => [
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.phoneNumber || "",
      user.role,
      new Date(user.createdAt).toLocaleDateString("tr-TR")
    ]);

    // 3. Combine to string
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // 4. Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `musteriler_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm text-sm font-medium"
    >
      <Download size={16} />
      Excel/CSV İndir
    </button>
  );
}
