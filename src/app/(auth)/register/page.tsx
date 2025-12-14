// src/app/(auth)/register/page.tsx
"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Lock,
  Mail,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// 🟢 ZOD ve REACT HOOK FORM İMPORTLARI
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 🟢 1. ZOD ŞEMASI (Kurallar burada)
const registerSchema = z
  .object({
    firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır."),
    lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır."),
    email: z.string().email("Geçerli bir e-posta adresi giriniz."),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
    confirmPassword: z.string().min(6, "Şifre tekrarı gereklidir."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"], // Hatanın hangi alanda görüneceği
  });

// Şemadan tip türetme (TypeScript gücü)
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  // 🟢 2. HOOK FORM KURULUMU
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // Kullanıcı yazarken anlık kontrol et
  });

  // 🟢 3. SUBMIT FONKSİYONU
  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");
    setSuccess(false);

    try {
      // confirmPassword backend'e gitmez, onu çıkarıyoruz
      const { confirmPassword, ...payload } = data;

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        reset(); // Formu temizle
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errorData = await res.json();
        setServerError(errorData.message || "Bir hata oluştu!");
      }
    } catch (err) {
      setServerError("Ağ hatası. Lütfen tekrar deneyin.");
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Hesabınızı Oluşturun
        </h2>
        <p className="text-gray-600 mt-2">
          KervanPazar&apos;a katılın ve alışverişe başlayın.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Global Server Hatası */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {serverError}
            </div>
          )}

          {/* Başarı Mesajı */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AD ALANI */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Adınız
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  {...register("firstName")}
                  className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all 
                    ${errors.firstName ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"}
                  `}
                  placeholder="Adınız"
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* SOYAD ALANI */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Soyadınız
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  {...register("lastName")}
                  className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all 
                    ${errors.lastName ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"}
                  `}
                  placeholder="Soyadınız"
                />
              </div>
              {errors.lastName && (
                <p className="text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* EMAIL ALANI */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              E-posta Adresi
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                {...register("email")}
                type="email"
                className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all 
                  ${errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"}
                `}
                placeholder="example@mail.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* ŞİFRE ALANI */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Şifre
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                {...register("password")}
                type="password"
                className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all 
                  ${errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"}
                `}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* ŞİFRE TEKRAR ALANI */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Şifre Tekrar
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                {...register("confirmPassword")}
                type="password"
                className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all 
                  ${errors.confirmPassword ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"}
                `}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 group"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Kayıt Olunuyor...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>Hesap Oluştur</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Zaten bir hesabın var mı?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
