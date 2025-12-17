import { prisma } from "@/lib/prisma-client";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  DoorOpen,
  FileEdit,
  Globe,
  LogIn,
  LogOut,
  PlusCircle,
  Search,
  ShieldAlert,
  Trash2,
  User,
} from "lucide-react";

export default async function AdminLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Log Tipine Göre Stil ve İkon Döndüren Helper
  const getLogStyle = (action: string) => {
    if (
      action.includes("ERROR") ||
      action.includes("FAILED") ||
      action.includes("UNAUTHORIZED")
    ) {
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: ShieldAlert,
        label: "Hata / Yetkisiz",
      };
    }
    if (action.includes("DELETE")) {
      return {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        icon: Trash2,
        label: "Silme",
      };
    }
    if (action.includes("CREATE")) {
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: PlusCircle,
        label: "Oluşturma",
      };
    }
    if (action.includes("UPDATE") || action.includes("EDIT")) {
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: FileEdit,
        label: "Güncelleme",
      };
    }
    if (action.includes("LOGIN")) {
      return {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        border: "border-indigo-200",
        icon: LogIn,
        label: "Giriş",
      };
    }
    if (action.includes("LOGOUT")) {
      return {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: LogOut,
        label: "Çıkış",
      };
    }
    // Varsayılan
    return {
      bg: "bg-gray-50",
      text: "text-gray-600",
      border: "border-gray-200",
      icon: Activity,
      label: "İşlem",
    };
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Sistem Kayıtları
          </h1>
          <p className="text-gray-500 mt-1">
            Son 100 işlem ve güvenlik aktivitesi listeleniyor.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 text-sm font-medium text-gray-600">
          <Activity size={18} className="text-[#667EEA]" />
          Toplam Kayıt:{" "}
          <span className="text-gray-900 font-bold">{logs.length}</span>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
        {/* Opsiyonel: Search Bar Alanı (İleride eklenebilir) */}
        <div className="border-b border-gray-100 p-4 bg-gray-50/30 flex justify-end">
          {/* Buraya filtreler gelebilir */}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="px-6 py-4">Durum & İşlem</th>
                <th className="px-6 py-4">Kullanıcı</th>
                <th className="px-6 py-4">Detaylar</th>
                <th className="px-6 py-4 text-right">Zaman & IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => {
                const style = getLogStyle(log.action);
                const Icon = style.icon;

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    {/* 1. İŞLEM TÜRÜ */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-xl border ${style.bg} ${style.border} ${style.text}`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">
                            {log.action}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                            {style.label}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. KULLANICI */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 border border-white shadow-sm">
                          {log.adminEmail?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {log.adminEmail || "Sistem / Anonim"}
                          </span>
                          {log.adminId && (
                            <span className="text-[10px] text-gray-400 font-mono">
                              ID: {log.adminId.slice(0, 8)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 3. DETAYLAR */}
                    <td className="px-6 py-4 align-top">
                      <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                        {log.details}
                      </p>
                    </td>

                    {/* 4. ZAMAN VE IP */}
                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-bold text-gray-900">
                          {new Date(log.createdAt).toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>

                        <div className="flex items-center gap-1 mt-1 px-2 py-0.5 bg-gray-100 rounded text-[10px] font-mono text-gray-500">
                          <Globe size={10} />
                          {log.ipAddress || "IP Gizli"}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {logs.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <p>Henüz kayıtlı bir log bulunmuyor.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-400 text-center">
          Güvenlik logları değiştirilemez ve silinemez. Tüm zamanlar yerel saati
          gösterir.
        </div>
      </div>
    </div>
  );
}
