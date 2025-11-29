'use client';

import { Building2, Shield } from 'lucide-react';

/**
 * Admin Footer Bileşeni
 *
 * Admin panelinin alt bilgi çubuğu.
 * Marka bilgisi, sistem durumu ve versiyon bilgilerini gösterir.
 * Responsive tasarım ile mobil ve desktop uyumludur.
 */
export default function AdminFooter() {
  // Mevcut yılı dinamik olarak al
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-6 py-4">
        {/* Container - mobilde dikey, desktop'ta yatay düzen */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          {/* ✅ Sol Bölüm - Marka ve Telif Hakkı Bilgileri */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {/* Marka Adı */}
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">KervanPazar</span>
            </div>

            {/* Ayraç */}
            <div className="w-px h-4 bg-gray-300"></div>

            {/* Panel Bilgisi */}
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Yönetim Paneli</span>
            </div>

            {/* Ayraç */}
            <div className="w-px h-4 bg-gray-300"></div>

            {/* Telif Hakkı */}
            <span>© {currentYear} Tüm hakları saklıdır.</span>
          </div>

          {/* ✅ Sağ Bölüm - Sistem Durumu ve Versiyon Bilgisi */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {/* Sistem Durumu Göstergesi */}
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Sistem Aktif</span>
            </div>

            {/* Ayraç */}
            <div className="w-px h-4 bg-gray-300"></div>

            {/* Versiyon Bilgisi */}
            <span>v2.4.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
