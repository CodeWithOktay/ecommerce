import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden">
        {/* Üst Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>

          {/* Başlık */}
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Yetkisiz Erişim
          </h1>

          {/* Açıklama */}
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            Bu sayfaya erişim yetkiniz bulunmamaktadır. Devam edebilmek için
            farklı bir hesapla giriş yapabilir veya ana sayfaya dönebilirsiniz.
          </p>

          {/* Aksiyonlar */}
          <div className="mt-8 space-y-3">
            {/* Primary */}
            <Link
              href="/login"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Farklı Hesapla Giriş Yap
            </Link>

            {/* Secondary */}
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Home className="h-4 w-4" />
              Ana Sayfaya Dön
            </Link>
          </div>

          {/* Divider */}
          <div className="mt-8 border-t border-gray-100 pt-4 text-xs text-gray-400">
            Hata Kodu: <span className="font-medium">403 — Forbidden</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-xs text-gray-400">
        © {new Date().getFullYear()} KervanPazar. Tüm hakları saklıdır.
      </p>
    </div>
  );
}
