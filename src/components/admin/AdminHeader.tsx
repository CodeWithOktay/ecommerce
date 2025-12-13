"use client";

import {
  Bell,
  LogOut,
  Menu,
  Settings,
  Search,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link"; // Link eklendi

// Kullanıcı bilgileri için interface
interface User {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  user?: User;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Dışarı tıklamayı algılamak için

  // Menü açıkken dışarı tıklanırsa kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (): string => {
    return (
      session?.user?.name?.charAt(0) ||
      session?.user?.email?.charAt(0) ||
      "A"
    ).toUpperCase();
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    // ✨ Sticky Header & Glass Effect
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* --- SOL TARTAF: LOGO & MOBİL MENÜ --- */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden text-gray-600"
            aria-label="Menüyü aç"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* --- ORTA: GLOBAL ARAMA (Sadece Desktop) --- */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <div className="relative w-full text-gray-500 focus-within:text-indigo-600">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3"></div>
          </div>
        </div>

        {/* --- SAĞ TARAF: AKSİYONLAR --- */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobil Arama İkonu (Sadece Mobilde Görünür) */}

          {/* Bildirimler */}
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg hover:text-indigo-600 transition-colors">
            <span className="sr-only">Bildirimleri Gör</span>
            <Bell className="w-5 h-5" />
            {/* 🔥 Pulse Animasyonu */}
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
          </button>

          {/* Ayırıcı Çizgi */}
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          {/* Kullanıcı Menüsü */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1.5 sm:pl-3 sm:pr-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profil"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm border border-indigo-200">
                  {getInitials()}
                </div>
              )}

              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-700 leading-none">
                  {session?.user?.name || "Admin User"}
                </span>
                <span className="text-[11px] text-gray-400 font-medium mt-1">
                  {/* Role yoksa fallback */}
                  {(session?.user as any)?.role || "Süper Admin"}
                </span>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-gray-400 hidden lg:block transition-transform ${showUserMenu ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menü */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Header Kısmı */}
                <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 rounded-t-2xl">
                  <p className="text-sm font-bold text-gray-900">Hesabım</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {session?.user?.email}
                  </p>
                </div>

                {/* Linkler */}
                <div className="p-2 space-y-1">
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    Profil Bilgileri
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Sistem Ayarları
                  </Link>
                </div>

                <div className="h-px bg-gray-100 my-1 mx-2"></div>

                {/* Çıkış */}
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Güvenli Çıkış
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
