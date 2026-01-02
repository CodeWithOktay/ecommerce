"use client";

import { Settings } from "@prisma/client";
import { Globe, Type, FileText, AlignLeft } from "lucide-react";

export default function GeneralSettingsForm({
  initialData,
}: {
  initialData: Settings;
}) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100/50">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 shadow-sm ring-1 ring-indigo-100">
          <Globe size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Genel Bilgiler</h2>
          <p className="text-sm text-gray-500">
            Sitenizin kimliğini ve temel SEO ayarlarını yapılandırın.
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Başlığı */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Type size={16} className="text-gray-400" />
              Site Başlığı
            </label>
            <input
              name="siteTitle"
              defaultValue={initialData.siteTitle ?? ""}
              placeholder="Örn: KervanPazar"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium"
            />
            <p className="text-[11px] text-gray-400 ml-1">
              Tarayıcı sekmesinde görünen ana başlık.
            </p>
          </div>

          {/* Slogan */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <AlignLeft size={16} className="text-gray-400" />
              Slogan
            </label>
            <input
              name="slogan"
              defaultValue={initialData.slogan ?? ""}
              placeholder="En iyi ürünler burada..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Site Açıklaması */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FileText size={16} className="text-gray-400" />
            Site Açıklaması (Meta Description)
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={initialData.description ?? ""}
            placeholder="KervanPazar ile en kaliteli ürünlere en uygun fiyatlarla ulaşın..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 leading-relaxed"
          />
          <p className="text-[11px] text-gray-400 ml-1">
            Google arama sonuçlarında görünecek açıklama metni.
          </p>
        </div>
      </div>
    </div>
  );
}
