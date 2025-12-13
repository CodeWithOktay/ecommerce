"use client";

import { updateSettings } from "@/lib/actions/settings-actions";
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
  AlertTriangle,
  Loader2, // Loading ikonu eklendi
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast"; // Alert yerine Toast
import { useRouter } from "next/navigation"; // Sayfa yenileme için

export default function SettingsClient({
  initialData,
}: {
  initialData: Settings;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Bakım modu için state (Checkbox kontrolü için)
  const [maintenance, setMaintenance] = useState(initialData.maintenance);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    // Server action'ı çağır
    const res = await updateSettings(formData);

    if (res.success) {
      toast.success(res.message); // Şık bildirim
      router.refresh(); // Verileri arkadan güncelle
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
            Mağazanızın genel yapılandırması ve iletişim bilgileri.
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
                // DÜZELTME: Null gelirse boş string ("") yap
                defaultValue={initialData.siteTitle ?? ""}
                placeholder="Örn: KervanPazar"
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slogan
              </label>
              <input
                name="slogan"
                defaultValue={initialData.slogan ?? ""}
                placeholder="En iyi ürünler burada..."
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                placeholder="Google aramalarında görünecek açıklama..."
                className="w-full border border-gray-200 p-3 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. İLETİŞİM */}
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
                E-posta
              </label>
              <Mail className="absolute left-3 top-[2.4rem] text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                name="contactEmail"
                type="email"
                defaultValue={initialData.contactEmail ?? ""}
                placeholder="info@kervanpazar.com"
                className="w-full pl-10 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefon
              </label>
              <Phone className="absolute left-3 top-[2.4rem] text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                name="contactPhone"
                defaultValue={initialData.contactPhone ?? ""}
                placeholder="+90 555 ..."
                className="w-full pl-10 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div className="col-span-full relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adres
              </label>
              <MapPin className="absolute left-3 top-[2.4rem] text-gray-400 w-5 h-5 pointer-events-none" />
              <textarea
                name="address"
                rows={2}
                defaultValue={initialData.address ?? ""}
                placeholder="Şirket adresi..."
                className="w-full pl-10 border border-gray-200 p-3 rounded-xl resize-none focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. SOSYAL MEDYA */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
              <Instagram size={24} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Sosyal Medya</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Instagram className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                name="instagram"
                placeholder="Instagram Kullanıcı Adı"
                defaultValue={initialData.instagram ?? ""}
                className="w-full pl-10 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="relative">
              <Facebook className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                name="facebook"
                placeholder="Facebook URL"
                defaultValue={initialData.facebook ?? ""}
                className="w-full pl-10 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="relative">
              <Twitter className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                name="twitter"
                placeholder="Twitter (X) Kullanıcı Adı"
                defaultValue={initialData.twitter ?? ""}
                className="w-full pl-10 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. BAKIM MODU */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            maintenance
              ? "bg-red-50 border-red-200 shadow-inner"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-full shadow-sm transition-colors ${maintenance ? "bg-red-100 text-red-600" : "bg-white text-gray-400"}`}
              >
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2
                  className={`text-lg font-bold transition-colors ${maintenance ? "text-red-800" : "text-gray-900"}`}
                >
                  Bakım Modu
                </h2>
                <p className="text-sm text-gray-600">
                  {maintenance
                    ? "SİTE ŞU AN KAPALI. Sadece yöneticiler görebilir."
                    : "Site şu an yayında ve herkese açık."}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="maintenance"
                className="sr-only peer"
                checked={maintenance}
                onChange={(e) => setMaintenance(e.target.checked)}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
  