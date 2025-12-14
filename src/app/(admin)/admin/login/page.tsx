"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  AlertCircle,
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// 🟢 ZOD VE HOOK FORM IMPORTS
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 🟢 1. ŞEMA TANIMI (Admin Kuralları)
const adminLoginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(1, "Şifre alanı boş bırakılamaz."),
});

// Tip Türetme
type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function ManagementLogin() {
  // UI State'leri
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // Next.js Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  // 🟢 2. REACT HOOK FORM KURULUMU
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Zaten giriş yapılmışsa panele at
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin/dashboard");
    }
  }, [status, router]);

  // URL Hatalarını Yakala
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "CredentialsSignin") {
      setGlobalError("Geçersiz email, şifre veya yetki.");
    }
  }, [searchParams]);

  // 🟢 3. SUBMIT FONKSİYONU
  const onSubmit = async (data: AdminLoginFormValues) => {
    setGlobalError("");

    try {
      const result = await signIn("credentials", {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        loginType: "ADMIN", // Yönetici Kapısı
        redirect: false,
      });

      if (result?.error) {
        setGlobalError(
          "Giriş başarısız. Yetkinizi ve bilgilerinizi kontrol edin."
        );
      } else if (result?.ok) {
        router.replace("/admin/dashboard");
        router.refresh();
      }
    } catch (error) {
      setGlobalError("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
  };

  // Yükleniyor Ekranı (Session Kontrolü)
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

      {/* Ana içerik */}
      <div className="max-w-md w-full relative z-10">
        {/* Başlık */}
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

        {/* Giriş Kartı */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Hata Mesajı */}
            {globalError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center animate-pulse">
                <Shield className="w-5 h-5 mr-3 flex-shrink-0" />
                {globalError}
              </div>
            )}

            {/* EMAIL ALANI */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                E-posta Adresi
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 bg-white
                    ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  placeholder="example@mail.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* ŞİFRE ALANI */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-900">
                  Şifre
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {showPassword ? "Gizle" : "Göster"}
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 pr-12 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 bg-white
                    ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  placeholder="••••••••"
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
              {errors.password && (
                <p className="text-xs text-red-600 mt-1 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 group active:scale-[0.98]"
            >
              {isSubmitting ? (
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

          {/* Güvenlik Bilgisi */}
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
