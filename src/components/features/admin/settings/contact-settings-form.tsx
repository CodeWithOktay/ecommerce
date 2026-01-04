"use client";

import { Settings } from "@prisma/client";
import { Phone, Mail, MapPin } from "lucide-react";

/**
 * İletişim Ayarları Formu
 * 
 * Sitenin iletişim bilgilerini (E-posta, Telefon, Adres) düzenler.
 * SettingsTabs bileşeni tarafından render edilir.
 */
export default function ContactSettingsForm({
  initialData,
}: {
  initialData: Settings;
}) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100/50">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 shadow-sm ring-1 ring-emerald-100">
          <Phone size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">İletişim Bilgileri</h2>
          <p className="text-sm text-gray-500">
            Müşterilerinizin size ulaşabileceği kanalları belirleyin.
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* E-posta */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="contactEmail"
                type="email"
                defaultValue={initialData.contactEmail ?? ""}
                placeholder="info@kervanpazar.com"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Telefon */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Telefon Numarası
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="contactPhone"
                type="tel"
                defaultValue={initialData.contactPhone ?? ""}
                placeholder="0 555 123 45 67"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Adres */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Açık Adres
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
            <textarea
              name="address"
              rows={3}
              defaultValue={initialData.address ?? ""}
              placeholder="Örn: Maslak Mah. Büyükdere Cad. No:1 Sarıyer/İstanbul"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400 leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
