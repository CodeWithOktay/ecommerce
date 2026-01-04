import Link from "next/link";
import {
  ShieldBan,
  LockKeyhole,
  FileWarning,
  ChevronRight,
} from "lucide-react";

/**
 * Yetkisiz Erişim Sayfası (403)
 * 
 * Kullanıcının yetkisi olmayan bir sayfaya erişmeye çalıştığında yönlendirildiği sayfa.
 * Genellikle Admin paneline girmeye çalışan normal kullanıcılar için gösterilir.
 */
export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      {/* Arka Plan Deseni (Kurumsal/Teknik his için) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      <div className="relative w-full max-w-lg bg-white shadow-2xl border-t-4 border-red-700">
        {/* Header Kısmı: Sert ve Net */}
        <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center gap-4">
          <div className="p-3 bg-red-100 border border-red-200 rounded-sm">
            <ShieldBan className="h-8 w-8 text-red-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              Erişim Engellendi
            </h1>
            <p className="text-xs text-red-600 font-mono mt-1 font-semibold">
              ERR_CODE: 403_FORBIDDEN
            </p>
          </div>
        </div>

        {/* İçerik Gövdesi */}
        <div className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <FileWarning className="h-6 w-6 text-gray-400 mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">
                Yetki Sınırlandırması Tespit Edildi
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sayın kullanıcı, talep ettiğiniz kaynağa erişim yetkiniz
                bulunmamaktadır. Sistem güvenlik protokolleri gereği bu işlem
                sonlandırılmıştır. Bu girişimin tekrarlanması durumunda IP
                adresiniz güvenlik günlüğüne işlenecektir.
              </p>
            </div>
          </div>

          {/* Teknik Bilgi Kutusu (Korkutucu/Ciddi detay) */}
          <div className="bg-gray-900 text-gray-300 p-4 rounded-sm font-mono text-xs mb-8 border-l-4 border-gray-500">
            <div className="flex justify-between mb-1">
              <span>SECURITY_LEVEL:</span>
              <span className="text-white">HIGH</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>USER_ROLE:</span>
              <span className="text-red-400">UNAUTHORIZED</span>
            </div>
            <div className="flex justify-between">
              <span>TIMESTAMP:</span>
              <span>{new Date().toISOString()}</span>
            </div>
          </div>

          {/* Aksiyon Butonları: Keskin ve Köşeli */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/login"
              className="group flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors rounded-sm"
            >
              <LockKeyhole className="h-4 w-4" />
              Giriş Yap
            </Link>

            <Link
              href="/"
              className="group flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors rounded-sm"
            >
              Ana Sayfa
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Footer: Sistem Mesajı */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 text-center">
          <p className="text-[10px] text-gray-400 font-mono">
            KERVANPAZAR SECURITY INFRASTRUCTURE ID:{" "}
            {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
