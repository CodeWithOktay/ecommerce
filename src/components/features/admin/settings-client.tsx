"use client";

import { updateSettings } from "@/lib/actions/settings";
import { Settings } from "@prisma/client";
import {
  Save,
  Globe,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SettingsClient({
  initialData,
}: {
  initialData: Settings;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const res = await updateSettings(formData);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error("Hata: " + res.message);
    }

    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="max-w-5xl mx-auto p-8 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sistem Ayarları</h1>
          <p className="text-gray-500 mt-1">
            Sitenin başlığı, iletişim bilgileri ve sosyal medya bağlantılarını
            buradan yönetebilirsin.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50 shadow-lg active:scale-95"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
          <span>{loading ? "Kaydediliyor..." : "Ayarları Kaydet"}</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* 1. GENEL BİLGİLER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <Globe size={24} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Genel Bilgiler</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Site Başlığı
              </label>
              <input
                name="siteTitle"
                defaultValue={initialData.siteTitle ?? ""}
                placeholder="Örn: KervanPazar"
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">
                Tarayıcı sekmesinde ve İletişim sayfasında görünür.
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slogan
              </label>
              <input
                name="slogan"
                defaultValue={initialData.slogan ?? ""}
                placeholder="En iyi ürünler burada..."
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Site Açıklaması (SEO)
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={initialData.description ?? ""}
                placeholder="Google aramalarında görünecek açıklama metni..."
                className="w-full border border-gray-200 p-3 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* 2. İLETİŞİM BİLGİLERİ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="bg-green-50 p-2 rounded-lg text-green-600">
              <Phone size={24} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              İletişim Bilgileri
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-posta Adresi
              </label>
              <Mail className="absolute left-3 top-[2.4rem] text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                name="contactEmail"
                type="email"
                defaultValue={initialData.contactEmail ?? ""}
                placeholder="info@kervanpazar.com"
                className="w-full pl-10 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefon Numarası
              </label>
              <Phone className="absolute left-3 top-[2.4rem] text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                name="contactPhone"
                type="tel"
                defaultValue={initialData.contactPhone ?? ""}
                placeholder="0 555 123 45 67"
                className="w-full pl-10 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
            <div className="col-span-full relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Açık Adres
              </label>
              <MapPin className="absolute left-3 top-[2.4rem] text-gray-400 w-5 h-5 pointer-events-none" />
              <textarea
                name="address"
                rows={2}
                defaultValue={initialData.address ?? ""}
                placeholder="Örn: Maslak Mah. Büyükdere Cad. No:1 Sarıyer/İstanbul"
                className="w-full pl-10 border border-gray-200 p-3 rounded-xl resize-none focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* 3. SOSYAL MEDYA (Placeholder Güncellemelerine Dikkat) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
              <Instagram size={24} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Sosyal Medya</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* INSTAGRAM */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Instagram
              </label>
              <div className="relative">
                <Instagram className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  name="instagram"
                  placeholder="kervanpazar (Sadece kullanıcı adı)"
                  defaultValue={initialData.instagram ?? ""}
                  className="w-full pl-10 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Sadece kullanıcı adını yazın (@ koymayın).
              </p>
            </div>

            {/* FACEBOOK */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Facebook
              </label>
              <div className="relative">
                <Facebook className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  name="facebook"
                  placeholder="https://facebook.com/..."
                  defaultValue={initialData.facebook ?? ""}
                  className="w-full pl-10 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Facebook sayfasının <b>tam linkini</b> yapıştırın.
              </p>
            </div>

            {/* TWITTER */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Twitter (X)
              </label>
              <div className="relative">
                <Twitter className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  name="twitter"
                  placeholder="kervanpazar (Sadece kullanıcı adı)"
                  defaultValue={initialData.twitter ?? ""}
                  className="w-full pl-10 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Sadece kullanıcı adını yazın.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
