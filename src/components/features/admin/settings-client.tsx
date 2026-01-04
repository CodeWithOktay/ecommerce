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
  LayoutDashboard,
  Share2,
  LucideIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/utils";

/**
 * Site Ayarları Yönetim Formu
 *
 * Genel site yapılandırmasını yönetir.
 * Premium, sekmeli ve responsive tasarım.
 */
export default function SettingsClient({
  initialData,
}: {
  initialData: Settings;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "contact" | "social">(
    "general"
  );

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

  // Sekme Butonu Bileşeni
  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: typeof activeTab;
    label: string;
    icon: LucideIcon;
  }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 w-full md:w-auto justify-center md:justify-start",
        activeTab === id
          ? "bg-white text-indigo-600 shadow-lg shadow-indigo-100 ring-1 ring-indigo-50 scale-[1.02]"
          : "text-gray-500 hover:bg-white/50 hover:text-gray-700"
      )}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <form action={handleSubmit} className="max-w-6xl mx-auto p-4 md:p-8 pb-32">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Sistem Ayarları
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base max-w-lg">
            Mağazanızın kimliğini, iletişim kanallarını ve sosyal medya
            varlığını buradan yönetin.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-70 shadow-xl shadow-gray-200 hover:shadow-2xl hover:shadow-gray-300 w-full md:w-auto active:scale-95"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Save size={20} className="group-hover:scale-110 transition-transform" />
          )}
          <span>{loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</span>
          
          {/* Shine Effect */}
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
             <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          </div>
        </button>
      </div>

      {/* TABS & CONTENT LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR TABS */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-gray-100/50 backdrop-blur-sm p-1.5 rounded-2xl flex flex-col gap-1 sticky top-24">
            <TabButton id="general" label="Genel Bilgiler" icon={LayoutDashboard} />
            <TabButton id="contact" label="İletişim" icon={Phone} />
            <TabButton id="social" label="Sosyal Medya" icon={Share2} />
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 min-h-[500px]">
          {/* 1. GENEL BİLGİLER */}
          <div className={cn("space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", activeTab !== "general" && "hidden")}>
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100/80">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                  <Globe size={28} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Genel Yapılandırma</h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">SEO ve Site Kimliği</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                    Site Başlığı (Title)
                  </label>
                  <input
                    name="siteTitle"
                    defaultValue={initialData.siteTitle ?? ""}
                    placeholder="Örn: KervanPazar"
                    className="w-full border-gray-200 bg-gray-50/50 p-4 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                  />
                  <p className="text-[11px] text-gray-400 mt-2 ml-1 flex items-center gap-1">
                     <span className="w-1 h-1 bg-indigo-400 rounded-full" /> Tarayıcı sekmesinde görünür.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                    Slogan
                  </label>
                  <input
                    name="slogan"
                    defaultValue={initialData.slogan ?? ""}
                    placeholder="En kaliteli ürünler, en uygun fiyatlarla..."
                    className="w-full border-gray-200 bg-gray-50/50 p-4 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                    Meta Açıklama (Description)
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={initialData.description ?? ""}
                    placeholder="Google aramalarında çıkacak site açıklaması..."
                    className="w-full border-gray-200 bg-gray-50/50 p-4 rounded-xl resize-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm leading-relaxed text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. İLETİŞİM BİLGİLERİ */}
          <div className={cn("space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", activeTab !== "contact" && "hidden")}>
             <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100/80">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                  <Phone size={28} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">İletişim Kanalları</h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Müşteri Destek Hattı & Adres</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full md:col-span-1">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                    E-posta Adresi
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5 pointer-events-none" />
                    <input
                        name="contactEmail"
                        type="email"
                        defaultValue={initialData.contactEmail ?? ""}
                        placeholder="info@magaza.com"
                        className="w-full pl-12 border-gray-200 bg-gray-50/50 p-4 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>

                <div className="col-span-full md:col-span-1">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                    Telefon
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5 pointer-events-none" />
                    <input
                        name="contactPhone"
                        type="tel"
                        defaultValue={initialData.contactPhone ?? ""}
                        placeholder="0850 123 45 67"
                        className="w-full pl-12 border-gray-200 bg-gray-50/50 p-4 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                    Merkez Adres
                  </label>
                  <div className="relative group">
                     <MapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5 pointer-events-none" />
                    <textarea
                        name="address"
                        rows={3}
                        defaultValue={initialData.address ?? ""}
                        placeholder="Açık adres detayı..."
                        className="w-full pl-12 border-gray-200 bg-gray-50/50 p-4 rounded-xl resize-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm leading-relaxed text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. SOSYAL MEDYA */}
          <div className={cn("space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", activeTab !== "social" && "hidden")}>
             <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100/80">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-pink-50 p-3 rounded-2xl text-pink-600">
                  <Share2 size={28} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Sosyal Medya</h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Hesap Bağlantıları</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                
                {/* Instagram */}
                <div className="group">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                    Instagram
                  </label>
                  <div className="flex items-center">
                    <div className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl px-4 py-4 text-gray-500 group-focus-within:text-pink-600 group-focus-within:bg-pink-50 group-focus-within:border-pink-200 transition-colors">
                        <Instagram size={20} />
                    </div>
                    <input
                      name="instagram"
                      placeholder="kullaniciadi"
                      defaultValue={initialData.instagram ?? ""}
                      className="w-full border-l-0 border-gray-200 bg-gray-50/50 p-4 rounded-r-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>

                {/* Facebook */}
                <div className="group">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                    Facebook
                  </label>
                  <div className="flex items-center">
                    <div className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl px-4 py-4 text-gray-500 group-focus-within:text-blue-600 group-focus-within:bg-blue-50 group-focus-within:border-blue-200 transition-colors">
                        <Facebook size={20} />
                    </div>
                    <input
                      name="facebook"
                      placeholder="https://facebook.com/..."
                      defaultValue={initialData.facebook ?? ""}
                      className="w-full border-l-0 border-gray-200 bg-gray-50/50 p-4 rounded-r-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>

                {/* Twitter */}
                <div className="group">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 block ml-1">
                    Twitter (X)
                  </label>
                  <div className="flex items-center">
                    <div className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl px-4 py-4 text-gray-500 group-focus-within:text-black group-focus-within:bg-gray-200 group-focus-within:border-gray-400 transition-colors">
                        <Twitter size={20} />
                    </div>
                    <input
                      name="twitter"
                      placeholder="kullaniciadi"
                      defaultValue={initialData.twitter ?? ""}
                      className="w-full border-l-0 border-gray-200 bg-gray-50/50 p-4 rounded-r-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
