"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowLeft, CheckCircle2, MailOpen } from "lucide-react";
import Link from "next/link";

const resetSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
});

type ResetFormValues = z.infer<typeof resetSchema>;

/**
 * Şifre Sıfırlama İsteği Sayfası
 * 
 * Kullanıcının e-posta adresini girerek sıfırlama linki talep ettiği sayfa.
 * Başarılı gönderim sonrası bilgilendirme ekranı gösterir.
 */
export default function ResetPage() {
  // 🟢 State: Başarılı oldu mu?
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    setErrorMessage("");
    try {
      const response = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // API hatası varsa yakala
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Bir hata oluştu.");
      }

      // 🟢 Başarılıysa state'i değiştir (Ekran değişsin)
      setIsSuccess(true);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  // 🟢 SENARYO 1: Mail Başarıyla Gönderildi Ekranı
  if (isSuccess) {
    return (
      <div className="text-center">
        {/* İkon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <MailOpen className="w-10 h-10 text-green-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Mail Gönderildi!
        </h2>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          <p className="text-gray-600 text-lg mb-6">
            Şifre sıfırlama bağlantısını e-posta adresine gönderdik. Lütfen
            gelen kutunu (ve bazen spam klasörünü) kontrol et.
          </p>

          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-8 border border-blue-100">
            <p>
              <strong>İpucu:</strong> Link 1 saat boyunca geçerlidir.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full bg-[#667EEA] text-white py-4 px-6 rounded-xl font-semibold hover:bg-[#5a6fd6] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Giriş Sayfasına Dön
          </Link>
        </div>
      </div>
    );
  }

  // 🟢 SENARYO 2: Mail İsteme Formu (Varsayılan)
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Şifreni Sıfırla</h2>
        <p className="text-gray-600 mt-2">
          E-posta adresini gir, sana bir sıfırlama bağlantısı gönderelim.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-3 transform rotate-45" />{" "}
            {/* Hata ikonu niyetine */}
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-[#667EEA] focus:ring-indigo-100 transition-all"
                placeholder="ornek@mail.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg disabled:opacity-70 transition-all duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Gönderiliyor...
              </span>
            ) : (
              "Sıfırlama Bağlantısı Gönder"
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </>
  );
}
