"use client";

import { useState } from "react";
import { updateAdmin } from "@/lib/actions/admin"; // Senin action dosyan
import toast from "react-hot-toast";
import { Loader2, Save, Lock, User, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

interface AdminEditFormProps {
  user: User;
}

/**
 * Yönetici Düzenleme Formu
 * 
 * Mevcut yönetici bilgilerini güncellemek için kullanılır.
 * - Server Action (updateAdmin) ile iletişim kurar.
 * - İşlem başarılı olursa sayfayı yeniler (router.refresh).
 */
export default function AdminEditForm({ user }: AdminEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    // Server Action'ı çağır (ID + Form Verisi)
    const res = await updateAdmin(user.id, formData);

    if (res.success) {
      toast.success(res.message);
      router.refresh(); // Verileri yenile
    } else {
      toast.error(res.message);
    }

    setIsSubmitting(false);
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Gizli ID inputuna gerek yok, action'a parametre olarak geçiyoruz ama form yapısında kalsa da zarar gelmez */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <User size={16} className="text-purple-600" /> Ad
          </label>
          <input
            name="firstName"
            defaultValue={user.firstName || ""}
            required
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="Ad giriniz"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <User size={16} className="text-purple-600" /> Soyad
          </label>
          <input
            name="lastName"
            defaultValue={user.lastName || ""}
            required
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="Soyad giriniz"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Mail size={16} className="text-purple-600" /> E-posta
        </label>
        <input
          name="email"
          type="email"
          defaultValue={user.email || ""}
          required
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
          placeholder="ornek@kervanpazar.com"
        />
      </div>

      {/* Şifre Alanı */}
      <div className="pt-4 border-t border-purple-50">
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Lock size={16} className="text-purple-600" /> Şifre Güncelle
          (Opsiyonel)
        </label>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
          placeholder="Değiştirmek istemiyorsanız boş bırakın"
        />
        <p className="text-xs text-gray-500 mt-2">
          Sadece şifreyi değiştirmek istiyorsanız doldurun. Boş bırakırsanız
          mevcut şifre geçerli kalır.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-700 text-white py-4 rounded-xl font-bold hover:bg-purple-800 transition shadow-lg shadow-purple-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin" /> Güncelleniyor...
          </>
        ) : (
          <>
            <Save size={20} /> Değişiklikleri Kaydet
          </>
        )}
      </button>
    </form>
  );
}
