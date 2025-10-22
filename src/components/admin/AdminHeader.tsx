'use client';

import { Bell, LogOut, Menu, Settings } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  user?: User;
}

export default function AdminHeader({ onMenuToggle, user }: AdminHeaderProps) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getInitials = (): string => {
    return (
      session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'A'
    );
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <header className="bg-white border-b border-gray-200 ">
      <div className="flex items-start justify-between ">
        <Image
          src="/kervanpazar-logo.png"
          alt="KervanPazar Logo"
          width={250}
          height={10}
          className="object-contain group-hover:scale-105 transition-transform"
          priority
        />
        <div className="flex items-center gap-1">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Menüyü aç"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            aria-label="Bildirimler"
          >
            <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            aria-label="Ayarlar"
          >
            <Settings className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials()}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  {session?.user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">
                  {session?.user?.role || 'Sistem Yöneticisi'}
                </p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session?.user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {session?.user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Çevrimiçi</span>
                  </div>
                </div>

                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Hesap Ayarları</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    <span>Profilim</span>
                  </button>
                </div>

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

      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
