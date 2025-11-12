'use client';

import { Bell, LogOut, Menu, Settings } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

// Kullanıcı bilgileri için interface
interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

// Props interface'i - admin header bileşeninin alacağı props'lar
interface AdminHeaderProps {
  onMenuToggle?: () => void; // Menü açma/kapama fonksiyonu (mobile için)
  user?: User; // Opsiyonel: Kullanıcı bilgileri
}

/**
 * Admin Header Bileşeni
 *
 * Admin panelinin üst navigasyon çubuğu.
 * Logo, mobil menü butonu, bildirimler, ayarlar ve kullanıcı menüsü içerir.
 * Responsive tasarım ile mobil ve desktop uyumludur.
 */
export default function AdminHeader({ onMenuToggle, user }: AdminHeaderProps) {
  // NextAuth session bilgilerini al
  const { data: session } = useSession();
  // Kullanıcı menüsünün açık/kapalı durumu
  const [showUserMenu, setShowUserMenu] = useState(false);

  /**
   * Kullanıcı adının baş harfini alır
   * @returns {string} Kullanıcı adı veya email'in ilk harfi
   */
  const getInitials = (): string => {
    return (
      session?.user?.name?.charAt(0) || // İsim varsa ilk harf
      session?.user?.email?.charAt(0) || // Email varsa ilk harf
      'A' // Varsayılan harf
    );
  };

  /**
   * Çıkış yapma fonksiyonu
   * NextAuth ile güvenli çıkış ve login sayfasına yönlendirme
   */
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-start justify-between">
        {/* ✅ Logo */}
        <Image
          src="/kervanpazar-logo.png"
          alt="KervanPazar Logo"
          width={250}
          height={10}
          className="object-contain group-hover:scale-105 transition-transform"
          priority // Öncelikli yükleme
        />

        {/* ✅ Mobil Menü Butonu - sadece mobilde görünür */}
        <div className="flex items-center gap-1">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Menüyü aç"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* ✅ Sağ Üst Aksiyon Butonları */}
        <div className="flex items-center gap-4">
          {/* ✅ Bildirim Butonu */}
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            aria-label="Bildirimler"
          >
            <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
            {/* Bildirim göstergesi - yeni bildirim varsa kırmızı nokta */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* ✅ Ayarlar Butonu */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            aria-label="Ayarlar"
          >
            <Settings className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
          </button>

          {/* ✅ Kullanıcı Menüsü */}
          <div className="relative">
            {/* Kullanıcı Butonu - tıklamada menüyü açar/kapatır */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              aria-label="Kullanıcı menüsü"
              aria-expanded={showUserMenu}
            >
              {/* Kullanıcı Avatarı - ismin baş harfi ile gradient daire */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials()}
              </div>
              {/* Kullanıcı Bilgileri - sadece desktop'ta görünür */}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  {session?.user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">
                  {session?.user?.role || 'Sistem Yöneticisi'}
                </p>
              </div>
            </button>

            {/* ✅ Kullanıcı Açılır Menüsü - sadece açıkken görünür */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {/* Kullanıcı Bilgi Bölümü */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session?.user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {session?.user?.email}
                  </p>
                  {/* Çevrimiçi Durum Göstergesi */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Çevrimiçi</span>
                  </div>
                </div>

                {/* Menü Öğeleri */}
                <div className="py-2">
                  {/* Hesap Ayarları */}
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Hesap Ayarları</span>
                  </button>
                  {/* Profilim */}
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    <span>Profilim</span>
                  </button>
                </div>

                {/* Çıkış Butonu */}
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors rounded-lg mx-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Mobile Overlay - kullanıcı menüsü açıkken arkaplan karartması */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
