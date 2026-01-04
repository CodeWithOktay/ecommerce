"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// 🟡 1. ŞEMA GÜNCELLEMESİ: confirmPassword ve eşleşme kontrolü eklendi
const newPasswordSchema = z
  .object({
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
    confirmPassword: z.string().min(1, "Şifre tekrarı boş bırakılamaz."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler birbiriyle uyuşmuyor.",
    path: ["confirmPassword"], // Hata mesajı bu alanın altında çıksın
  });

type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

/**
 * Yeni Şifre Belirleme Formu
 * 
 * Şifre sıfırlama linkine tıklandıktan sonra açılan sayfa.
 * URL'deki token'ı alarak backend'e doğrulamaya gönderir.
 */
function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  // 🟡 UI State: İkinci şifre alanı için ayrı görünürlük state'i
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus({
        type: "error",
        text: "Geçersiz bağlantı! Token bulunamadı.",
      });
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onSubmit = async (data: NewPasswordFormValues) => {
    if (!token) return;

    setStatus(null);
    try {
      // Backend'e sadece password ve token gönderiyoruz, confirmPassword'e ihtiyacı yok
      const response = await fetch("/api/auth/new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: data.password,
          token: token,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Bir hata oluştu.");
      }

      setStatus({
        type: "success",
        text: "Şifren başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsun...",
      });

      // Kullanıcı mesajı okusun diye biraz bekletip atıyoruz
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu";
      setStatus({ type: "error", text: errorMessage });
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Yeni Şifre Belirle</h2>
        <p className="text-gray-600 mt-2">
          Lütfen hesabın için yeni ve güçlü bir şifre gir.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
        {status && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center ${
              status.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-3" />
            )}
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 1. ŞİFRE ALANI */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Yeni Şifre
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-[#667EEA] transition-colors" />
              </div>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                disabled={isSubmitting || !token}
                className={`w-full pl-10 pr-12 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 
                  ${errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-[#667EEA] focus:ring-indigo-100"}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
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

          {/* 🟡 2. ŞİFRE DOĞRULAMA ALANI (YENİ) */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Şifreyi Doğrula
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-[#667EEA] transition-colors" />
              </div>
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                disabled={isSubmitting || !token}
                className={`w-full pl-10 pr-12 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 
                  ${errors.confirmPassword ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-[#667EEA] focus:ring-indigo-100"}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1 ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !token}
            className="w-full bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg disabled:opacity-70 transition-all duration-200 flex items-center justify-center"
          >
            {isSubmitting ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#667EEA] rounded-full animate-spin"></div>
        </div>
      }
    >
      <NewPasswordForm />
    </Suspense>
  );
}
