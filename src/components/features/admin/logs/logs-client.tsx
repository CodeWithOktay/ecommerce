"use client";

import { useState } from "react";
import { 
  ShieldAlert, 
  LogIn, 
  Search, 
  Calendar,
  Activity,
  History
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface AuditLog {
  id: string;
  action: string;
  details: string | null;
  adminId: string | null;
  adminEmail: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date | string;
}

interface LoginLog {
  id: string;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  ipAddress: string | null;
  createdAt: Date | string;
}

interface Props {
  auditLogs: AuditLog[];
  loginLogs: LoginLog[];
}

type Tab = "audit" | "login";

/**
 * Admin Kayıtları Görüntüleyici (Client Component)
 * 
 * İki tür kaydı tek bir arayüzde gösterir:
 * 1. Audit Logs: Yönetici işlemlerini (oluşturma, silme, güncelleme) takip eder.
 * 2. Login Logs: Kullanıcı giriş hareketlerini takip eder.
 * 
 * Özellikler:
 * - Client-side arama ve filtreleme
 * - Sekmeli (Tab) yapı ile geçiş
 * - Detaylı tablo görünümü
 */
export default function AdminLogsClient({ auditLogs, loginLogs }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("audit");
  const [searchTerm, setSearchTerm] = useState("");

  // Basit filtreleme
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterLogs = (logs: any[]) => {
    if (!searchTerm) return logs;
    const lowerTerm = searchTerm.toLowerCase();
    return logs.filter((log) => 
       // AuditLog için
       log.action?.toLowerCase().includes(lowerTerm) ||
       log.details?.toLowerCase().includes(lowerTerm) ||
       log.adminEmail?.toLowerCase().includes(lowerTerm) ||
       // LoginLog için
       log.user?.email?.toLowerCase().includes(lowerTerm) ||
       log.user?.firstName?.toLowerCase().includes(lowerTerm)
    );
  };

  const filteredAuditLogs = filterLogs(auditLogs) as AuditLog[];
  const filteredLoginLogs = filterLogs(loginLogs) as LoginLog[];

  return (
    <div className="space-y-6">
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        
        {/* TABS */}
        <div className="flex bg-gray-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("audit")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === "audit" 
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200" 
                : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            <ShieldAlert size={16} />
            Sistem Kayıtları
            <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-xs ml-1">
              {auditLogs.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("login")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === "login" 
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200" 
                : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            <LogIn size={16} />
            Giriş Kayıtları
            <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-xs ml-1">
              {loginLogs.length}
            </span>
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
           <input 
             type="text" 
             placeholder="Kayıtlarda ara..." 
             className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        {activeTab === "audit" ? (
          <AuditLogTable logs={filteredAuditLogs} />
        ) : (
          <LoginLogTable logs={filteredLoginLogs} />
        )}
      </div>

    </div>
  );
}

// --- SUB COMPONENTS ---

// --- ALT BİLEŞENLER ---

/**
 * Audit Log Tablosu
 * Yönetici işlemlerini listeler.
 */
function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) return <EmptyState />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs">
          <tr>
            <th className="px-6 py-4">İşlem & Detay</th>
            <th className="px-6 py-4">Yönetici / Kullanıcı</th>
            <th className="px-6 py-4">IP & Cihaz</th>
            <th className="px-6 py-4 text-right">Zaman</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                 <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                       <Activity size={18} />
                    </div>
                    <div>
                       <div className="font-bold text-gray-900">{log.action}</div>
                       <div className="text-gray-500 text-xs mt-0.5 max-w-sm font-mono truncate" title={log.details || undefined}>
                         {log.details || "-"}
                       </div>
                    </div>
                 </div>
              </td>
              <td className="px-6 py-4">
                 <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {log.adminEmail || "Sistem"}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      ID: {log.adminId || "SYSTEM"}
                    </span>
                 </div>
              </td>
              <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                 <div>{log.ipAddress || "Localhost"}</div>
                 <div className="truncate max-w-[150px] opacity-70" title={log.userAgent || undefined}>
                   {log.userAgent || "-"}
                 </div>
              </td>
              <td className="px-6 py-4 text-right">
                 <div className="flex flex-col items-end text-gray-600">
                    <span className="font-medium">
                      {format(new Date(log.createdAt), "d MMMM yyyy", { locale: tr })}
                    </span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(log.createdAt), "HH:mm:ss")}
                    </span>
                 </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Login Log Tablosu
 * Kullanıcı girişlerini listeler.
 */
function LoginLogTable({ logs }: { logs: LoginLog[] }) {
  if (logs.length === 0) return <EmptyState message="Henüz hiç giriş kaydı yok." />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs">
          <tr>
            <th className="px-6 py-4">Kullanıcı</th>
            <th className="px-6 py-4">Durum</th>
            <th className="px-6 py-4">IP Adresi</th>
            <th className="px-6 py-4 text-right">Giriş Zamanı</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
                       {log.user?.firstName?.[0] || log.user?.email?.[0] || "?"}
                       {log.user?.lastName?.[0]}
                    </div>
                    <div>
                       <div className="font-bold text-gray-900">
                         {log.user?.firstName} {log.user?.lastName}
                       </div>
                       <div className="text-xs text-gray-500">
                         {log.user?.email}
                       </div>
                    </div>
                 </div>
              </td>
              <td className="px-6 py-4">
                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <LogIn size={12} />
                    Başarılı Giriş
                 </span>
              </td>
              <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                 {log.ipAddress || "Bilinmiyor"}
              </td>
              <td className="px-6 py-4 text-right">
                 <div className="flex flex-col items-end text-gray-600">
                    <span className="font-medium">
                      {format(new Date(log.createdAt), "d MMMM yyyy", { locale: tr })}
                    </span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(log.createdAt), "HH:mm:ss")}
                    </span>
                 </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ message = "Kayıt bulunamadı." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-gray-50 p-4 rounded-full mb-3 text-gray-400">
         <History size={32} />
      </div>
      <p className="text-gray-900 font-medium">{message}</p>
      <p className="text-sm text-gray-500 mt-1">
        Arama kriterlerinizi değiştirerek tekrar deneyin.
      </p>
    </div>
  );
}
