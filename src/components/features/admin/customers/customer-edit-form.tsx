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

export default function CustomerEditForm({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // 🟢 2. Router'ı tanımladık

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateUserProfile(formData);

      if (result.success) {
        toast.success(result.message);
        // 🟢 3. Başarılıysa 1 saniye sonra listeye geri gönder
        // (Hemen gönderirsek toast mesajı okunmadan kaybolabilir)
        setTimeout(() => {
          router.push("/admin/customers");
          router.refresh(); // Listeyi de tazele
        }, 1000);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-lg text-gray-900 mb-6 pb-4 border-b border-gray-100 flex justify-between items-center">
        <span>Hesap Bilgileri</span>
        {/* İsteğe bağlı: Vazgeç butonu */}
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeft size={12} /> Vazgeç
        </button>
      </h3>

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
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Ad
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                name="firstName"
                defaultValue={user.firstName || ""}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* SOYAD */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Soyad
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                name="lastName"
                defaultValue={user.lastName || ""}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              name="email"
              type="email"
              defaultValue={user.email || ""}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* TELEFON */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Telefon
          </label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              name="phoneNumber"
              type="tel" // Mobilde sayısal klavye açar
              maxLength={11} // 11'den fazla basamaz
              defaultValue={user.phoneNumber || ""}
              placeholder="05xxxxxxxxx"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              // 👇 SİHİRLİ KOD: Sadece rakam girmesine izin verir ve 11'de keser
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                // Rakam dışındaki her şeyi sil
                target.value = target.value.replace(/[^0-9]/g, "");
              }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 ml-1">
            Örn: 05xxxxxxxxx (11 Hane)
          </p>
        </div>

        {/* KAYDET BUTONU */}
        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            Vazgeç
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="flex-[2] flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Kaydediliyor...
              </>
            ) : (
              <>
                <Save size={18} /> Kaydet ve Çık
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
