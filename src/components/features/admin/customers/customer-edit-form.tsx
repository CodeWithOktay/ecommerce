"use client";

import { updateUserProfile } from "@/lib/actions/user";
import { User as UserType } from "@prisma/client";
import { Save, Loader2, User, Mail, Phone, ArrowLeft } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // 🟢 1. Router'ı ekledik

interface Props {
  user: UserType;
}

/**
 * Müşteri Düzenleme Formu
 * 
 * Yöneticinin müşteri bilgilerini düzenlemesini sağlar.
 * - Ad, Soyad, Email ve Telefon bilgilerini yönetir.
 * - useTransition ve optimistic UI güncellemelerini kullanır.
 * - Server Action (updateUserProfile) ile iletişim kurar.
 */
export default function CustomerEditForm({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateUserProfile(formData);

      if (result.success) {
        toast.success(result.message);
        setTimeout(() => {
          router.push("/admin/customers");
          router.refresh();
        }, 1000);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      <form action={handleSubmit} className="space-y-6">
        <input type="hidden" name="id" value={user.id} />
        <input type="hidden" name="role" value={user.role} />
        <input
          type="hidden"
          name="isActive"
          value={user.isActive ? "on" : "off"}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AD */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
               Ad
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="firstName"
                defaultValue={user.firstName || ""}
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-900"
              />
            </div>
          </div>

          {/* SOYAD */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
               Soyad
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="lastName"
                defaultValue={user.lastName || ""}
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* EMAIL */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
             Email Adresi
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              name="email"
              type="email"
              defaultValue={user.email || ""}
              required
              className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-900"
            />
          </div>
        </div>

        {/* TELEFON */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
             Telefon Numarası
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              name="phoneNumber"
              type="tel"
              maxLength={11}
              defaultValue={user.phoneNumber || ""}
              placeholder="05xxxxxxxxx"
              className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-900"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, "");
              }}
            />
          </div>
          <p className="text-xs text-gray-400 pl-1">
             Başına 0 ekleyerek 11 hane giriniz.
          </p>
        </div>

        {/* KAYDET BUTONU */}
        <div className="pt-6 flex gap-4 border-t border-gray-100 mt-8">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-gray-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-xl shadow-gray-200 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
          >
            {isPending ? (
              <>
                 <Loader2 size={18} className="animate-spin" /> Kaydediliyor...
              </>
            ) : (
              <>
                 <Save size={18} /> Değişiklikleri Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
