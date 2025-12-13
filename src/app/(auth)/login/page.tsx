// src/app/(auth)/login/page.tsx
"use client";

import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "CredentialsSignin") {
      setError("Geçersiz e-posta veya şifre.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // ✅ KRİTİK GÜNCELLEME BURADA
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password: password,
        loginType: "USER", // <--- Bu formun Müşteri Kapısı olduğunu belirtiyoruz
        redirect: false,
      });

      if (result?.error) {
        // Backend'den "Kullanıcı bulunamadı" veya "Hatalı şifre" dönebilir
        // Admin buradan girmeye çalışırsa da hata alacak
        setError("Giriş başarısız. Bilgilerinizi kontrol edin.");
        setIsLoading(false);
      } else if (result?.ok) {
        // Başarılıysa müşteri ana sayfasına yönlendir
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Başlık */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Tekrar Hoş Geldiniz!
        </h2>
        <p className="text-gray-600 mt-2">
          Hesabınıza giriş yapın ve alışverişe devam edin.
        </p>
      </div>

      {/* Giriş Kartı */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hata Mesajı */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center animate-pulse">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Email Alanı */}
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
                placeholder="ornek@mail.com"
                required
              />
            </div>
          </div>

          {/* Şifre Alanı */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-900"
              >
                Şifre
              </label>
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
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Giriş Butonu */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Giriş Yapılıyor...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>Giriş Yap</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>
        </form>

        {/* Kayıt Sayfasına Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Henüz bir hesabın yok mu?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline"
            >
              Hemen Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
