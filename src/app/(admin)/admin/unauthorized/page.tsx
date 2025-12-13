import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>

        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Erişim Engellendi
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Bu sayfayı görüntülemek için gerekli yetkiye sahip değilsiniz.
          Hesabınızın yetkilerini kontrol edin veya yönetici ile iletişime
          geçin.
        </p>

        {/* Aksiyon Butonları */}
        <div className="space-y-3">
          {/* Ana Buton: Login'e Dön */}
          <Link
            href="/admin/login"
            className="flex items-center justify-center w-full bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <span>Farklı Hesapla Giriş Yap</span>
            <ArrowLeft className="w-4 h-4 ml-2 group-hover:-translate-x-1 transition-transform" />
          </Link>

          {/* İkincil Buton: Ana Sayfa */}
          <Link
            href="/"
            className="flex items-center justify-center w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Link>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
          Hata Kodu: 403_FORBIDDEN
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} KervanPazar Güvenlik Sistemleri
      </p>
    </div>
  );
}
