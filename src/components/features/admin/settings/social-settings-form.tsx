"use client";

import { Settings } from "@prisma/client";
import { Instagram, Facebook, Twitter, Link as LinkIcon } from "lucide-react";

/**
 * Sosyal Medya Ayarları Formu
 * 
 * Instagram, Facebook ve Twitter bağlantılarını yönetir.
 * Kullanıcı adı veya tam URL desteği input açıklamalarında belirtilmiştir.
 */
export default function SocialSettingsForm({
  initialData,
}: {
  initialData: Settings;
}) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100/50">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-purple-50 p-3 rounded-2xl text-purple-600 shadow-sm ring-1 ring-purple-100">
          <LinkIcon size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sosyal Medya</h2>
          <p className="text-sm text-gray-500">
            Kullanıcılarınızı sosyal medya hesaplarınıza yönlendirin.
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Instagram */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Instagram size={16} className="text-pink-600" />
            Instagram
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none group-focus-within:text-purple-600 transition-colors">
              @
            </span>
            <input
              name="instagram"
              placeholder="kervanpazar"
              defaultValue={initialData.instagram ?? ""}
              className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Facebook */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Facebook size={16} className="text-blue-600" />
            Facebook
          </label>
          <div className="relative">
             <input
              name="facebook"
              placeholder="https://facebook.com/..."
              defaultValue={initialData.facebook ?? ""}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
            />
          </div>
          <p className="text-[11px] text-gray-400 ml-1">
             Lütfen tam profil bağlantısını yapıştırın.
          </p>
        </div>

        {/* Twitter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Twitter size={16} className="text-sky-500" />
            Twitter (X)
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none group-focus-within:text-purple-600 transition-colors">
              @
            </span>
            <input
              name="twitter"
              placeholder="kervanpazar"
              defaultValue={initialData.twitter ?? ""}
              className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
