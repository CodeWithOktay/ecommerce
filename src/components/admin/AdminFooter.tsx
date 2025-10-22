'use client';

import { Building2, Shield } from 'lucide-react';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">KervanPazar</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Yönetim Paneli</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <span>© {currentYear} Tüm hakları saklıdır.</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Sistem Aktif</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <span>v2.4.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
