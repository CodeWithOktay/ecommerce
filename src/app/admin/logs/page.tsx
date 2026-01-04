import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  Activity,
  FileEdit,
  Globe,
  LogIn,
  LogOut,
  PlusCircle,
  Search,
  ShieldAlert,
  Trash2,
  Filter,
  User,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface AdminLogsPageProps {
  searchParams: Promise<{
    q?: string;
    role?: string;
    action?: string;
  }>;
}

export default async function AdminLogsPage(props: AdminLogsPageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const roleParam = searchParams.role; 
  const actionParam = searchParams.action;

  // Filtreleme Mantığı
  const where: Prisma.AuditLogWhereInput = {};

  if (roleParam) {
    if (roleParam === "ADMIN") where.role = "ADMIN";
    if (roleParam === "USER") where.role = "USER";
    if (roleParam === "SYSTEM") where.role = "SYSTEM";
  }

  if (actionParam) {
    where.action = { contains: actionParam }; 
  }

  if (query) {
    where.OR = [
        { adminEmail: { contains: query, mode: "insensitive" } },
        { details: { contains: query, mode: "insensitive" } },
        { ipAddress: { contains: query } }
    ];
  }

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Log Tipine Göre Stil ve İkon Döndüren Helper
  const getLogStyle = (action: string) => {
    if (
      action.includes("ERROR") ||
      action.includes("FAILED") ||
      action.includes("UNAUTHORIZED") ||
      action.includes("BLOCKED")
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
            Sistemdeki tüm admin ve kullanıcı hareketlerini izleyin.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 text-sm font-medium text-gray-600">
          <Activity size={18} className="text-[#667EEA]" />
          Toplam Kayıt:{" "}
          <span className="text-gray-900 font-bold">{logs.length}</span>
        </div>
      </div>

      {/* TABS & FILTERS */}
      <div className="flex flex-col gap-6 mb-8">
        
        {/* Role Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
          <Link 
            href="/admin/logs" 
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              !roleParam 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Tüm Kayıtlar
          </Link>
          <Link 
            href="/admin/logs?role=ADMIN" 
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              roleParam === "ADMIN" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Yönetici İşlemleri
          </Link>
          <Link 
            href="/admin/logs?role=USER" 
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              roleParam === "USER" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Müşteri Hareketleri
          </Link>
          <Link 
            href="/admin/logs?role=SYSTEM" 
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              roleParam === "SYSTEM" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Sistem Hataları
          </Link>
        </div>

        {/* Search & Action Filter */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
           <form className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Hidden Role Input to persist tab selection during search */}
              {roleParam && <input type="hidden" name="role" value={roleParam} />}

              <div className="relative flex-1 w-full">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                   name="q" 
                   defaultValue={query}
                   placeholder="E-posta, IP veya detay ara..." 
                   className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                 />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                 <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <select 
                      name="action" 
                      defaultValue={actionParam || ""}
                      className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-indigo-400 appearance-none min-w-[160px]"
                    >
                      <option value="">Tüm İşlemler</option>
                      <option value="LOGIN">Giriş / Çıkış</option>
                      <option value="CREATE">Ekleme (Create)</option>
                      <option value="UPDATE">Güncelleme (Update)</option>
                      <option value="DELETE">Silme (Delete)</option>
                      <option value="ERROR">Hatalar / Başarısız</option>
                    </select>
                 </div>

                 <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-900/20 active:scale-95">
                    Ara
                 </button>
                 
                 {(query || actionParam) && (
                    <Link 
                      href={`/admin/logs${roleParam ? `?role=${roleParam}` : ""}`} 
                      className="px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        Temizle
                    </Link>
                 )}
              </div>
           </form>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="px-6 py-4">Durum & İşlem</th>
                <th className="px-6 py-4">Rol & Kullanıcı</th>
                <th className="px-6 py-4">Detaylar</th>
                <th className="px-6 py-4 text-right">Zaman & IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => {
                const style = getLogStyle(log.action);
                const Icon = style.icon;
                const isAdmin = log.role === "ADMIN";

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

                    {/* 2. ROL & KULLANICI */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border shadow-sm ${
                            isAdmin 
                                ? "bg-indigo-100 text-indigo-600 border-indigo-200"
                                : "bg-emerald-100 text-emerald-600 border-emerald-200"
                        }`}>
                           {isAdmin ? <ShieldCheck size={16} /> : <User size={16} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {log.adminEmail || "Sistem / Anonim"}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                 isAdmin ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                             }`}>
                                {log.role || "UNKNOWN"}
                             </span>
                             {log.adminId && (
                                <span className="text-[10px] text-gray-400 font-mono">
                                ID: {log.adminId.slice(0, 6)}...
                                </span>
                             )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 3. DETAYLAR */}
                    <td className="px-6 py-4 align-top">
                      <p className="text-sm text-gray-600 leading-relaxed max-w-md break-all">
                        {log.details}
                      </p>
                      {/* JSON Metadata Gösterimi (Eğer varsa) */}
                      {log.metadata && (
                         <pre className="mt-1 text-[10px] text-gray-400 bg-gray-50 p-1.5 rounded border border-gray-100 overflow-x-auto max-w-[200px]">
                            {JSON.stringify(log.metadata, null, 2)}
                         </pre>
                      )}
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
                      <p>Kriterlere uygun kayıt bulunamadı.</p>
                      {(query || roleParam || actionParam) && (
                         <Link href="/admin/logs" className="text-sm text-indigo-600 font-medium hover:underline">
                            Filtreleri Temizle
                         </Link>
                      )}
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
