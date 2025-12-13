"use client";

// Gerekli ikon ve bileşen importları
import { ArrowRight, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { signIn, useSession } from "next-auth/react"; // useSession eklendi
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ManagementLogin() {
  // State'lerin tanımlanması
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Next.js ve Auth hook'ları
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession(); // Oturum durumunu dinliyoruz

  // ✅ Zaten giriş yapılmışsa direkt panele fırlat (Replace ile)
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin/dashboard");
    }
  }, [status, router]);

  // URL'den hata parametresini kontrol etme
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "CredentialsSignin") {
      setError("Geçersiz email, şifre veya yetki.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        loginType: "ADMIN", // Yönetici Kapısı
        redirect: false,
      });

      if (result?.error) {
        setError("Giriş başarısız. Yetkinizi ve bilgilerinizi kontrol edin.");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // ✅ PUSH YERİNE REPLACE: Geri tuşuyla bu sayfaya dönülmesini engeller
        router.replace("/admin/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("Giriş sırasında bir hata oluştu");
      setLoading(false);
    }
  };

  // ✅ YÜKLENİYOR DURUMU:
  // Session kontrol edilirken veya zaten giriş yapılmışsa formu gösterme.
  // Bu sayede sayfa "yanıp sönmez".
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">
            Güvenli bağlantı kuruluyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arkaplan dekoratif elementleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
      </div>

      {/* Ana içerik container'ı */}
      <div className="max-w-md w-full relative z-10">
        {/* Başlık bölümü */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6 relative h-16">
            <Image
              src="/kervanpazar-logo.png"
              alt="KervanPazar Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Yönetim Paneli</h2>
          <p className="text-gray-600 mt-2">
            Sistem yöneticisi olarak giriş yapın
          </p>
        </div>

        {/* Giriş kartı */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hata mesajı */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center animate-pulse">
                <Shield className="w-5 h-5 mr-3 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Email alanı */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900"
              >
                E-posta Adresi
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                  placeholder="example@mail.com"
                  required
                />
              </div>
            </div>

            {/* Şifre alanı */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Şifre
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {showPassword ? "Gizle" : "Göster"}
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Giriş butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 group"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Doğrulanıyor...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Yönetici Girişi</span>
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Güvenlik bilgisi */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <Shield className="w-3 h-3 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Güvenli Bölge
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bu alan sadece yetkili personel içindir. Yetkisiz giriş
                  denemeleri kayıt altına alınır.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-2">
            <span>v2.4.1</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span>Secure Connection</span>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} KervanPazar Yönetim Sistemi
          </p>
        </div>
      </div>
    </div>
  );
}
