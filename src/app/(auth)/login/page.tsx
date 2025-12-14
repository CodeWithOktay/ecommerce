// src/app/(auth)/login/page.tsx
"use client";

import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// 🟢 ZOD VE HOOK FORM IMPORTS
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 🟢 1. ŞEMA TANIMI
const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(1, "Şifre alanı boş bırakılamaz."),
});

// Şemadan tip türetme
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // UI State'leri
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // 🟢 2. REACT HOOK FORM KURULUMU
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // URL'den gelen hataları yakala (NextAuth redirect hataları)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "CredentialsSignin") {
      setGlobalError("Geçersiz e-posta veya şifre.");
    }
  }, [searchParams]);

  // 🟢 3. SUBMIT FONKSİYONU
  const onSubmit = async (data: LoginFormValues) => {
    setGlobalError(""); // Önceki hataları temizle

    try {
      const result = await signIn("credentials", {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        loginType: "USER", // Müşteri girişi
        redirect: false,
      });

      if (result?.error) {
        setGlobalError("Giriş başarısız. Bilgilerinizi kontrol edin.");
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setGlobalError("Bağlantı hatası. Lütfen tekrar deneyin.");
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Global Hata Mesajı */}
          {globalError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center animate-pulse">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
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
                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-[#667EEA] transition-colors" />
              </div>
              <input
                {...register("email")}
                type="email"
                className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 bg-white 
                  ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 hover:border-gray-300 focus:border-[#667EEA] focus:ring-indigo-100"
                  }`}
                placeholder="ornek@mail.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 ml-1">
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
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-[#667EEA] transition-colors" />
              </div>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className={`w-full pl-10 pr-12 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 bg-white
                  ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 hover:border-gray-300 focus:border-[#667EEA] focus:ring-indigo-100"
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
              <p className="text-xs text-red-500 mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Giriş Butonu */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-[0.98]"
          >
            {isSubmitting ? (
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
              className="font-medium text-[#667EEA] hover:text-[#5a6fd6] underline-offset-4 hover:underline transition-colors"
            >
              Hemen Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
