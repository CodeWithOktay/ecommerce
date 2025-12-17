"use client";

import {
  Bell,
  LogOut,
  Menu,
  Settings,
  User as UserIcon,
  ChevronDown,
  LayoutDashboard,
  HelpCircle,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

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
  const menuRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-sm transition-all supports-[backdrop-filter]:bg-white/60">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* --- SOL TARAF: MOBİL MENÜ & BREADCRUMB --- */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            onClick={onMenuToggle}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all lg:hidden active:scale-95"
            aria-label="Menüyü aç"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Breadcrumb / Page Title */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 font-medium">
            <LayoutDashboard className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">Yönetim Paneli</span>
          </div>
        </div>

        {/* --- ORTA: ARAMA ÇUBUĞU KALDIRILDI --- */}
        {/* Buradaki div'i sildik, justify-between sayesinde sağ ve sol yaslandı */}

        {/* --- SAĞ TARAF: AKSİYONLAR --- */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Yardım Butonu (Opsiyonel) */}
          <button className="hidden sm:flex p-2 text-gray-400 hover:bg-gray-50 hover:text-indigo-600 rounded-full transition-all">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* ✅ BİLDİRİMLER (SİPARİŞLER LİNKİ) */}
          <Link
            href="/admin/orders"
            className="relative p-2 text-gray-400 hover:bg-gray-50 hover:text-indigo-600 rounded-full transition-all group"
            title="Siparişlere Git"
          >
            <span className="sr-only">Sipariş Bildirimleri</span>
            <Bell className="w-5 h-5 group-hover:animate-swing" />

            {/* Bildirim Işığı (Pulse) */}
            <span className="absolute top-2 right-2.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
            </span>
          </Link>

          {/* Ayırıcı */}
          <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>

          {/* Kullanıcı Menüsü */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-3 p-1 pl-1.5 pr-2 rounded-full border border-transparent transition-all duration-200
                ${showUserMenu ? "bg-gray-50 border-gray-200 ring-2 ring-gray-100" : "hover:bg-gray-50 hover:border-gray-100"}
              `}
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profil"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-200">
                  {getInitials()}
                </div>
              )}

              <div className="hidden lg:flex flex-col items-start pr-1">
                <span className="text-sm font-semibold text-gray-700 leading-tight">
                  {session?.user?.firstName || "Admin"}
                </span>
                <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full mt-0.5">
                  {(session?.user as any)?.role || "Yönetici"}
                </span>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-gray-400 hidden lg:block transition-transform duration-300 ${showUserMenu ? "rotate-180 text-indigo-500" : ""}`}
              />
            </button>

            {/* Dropdown Menü */}
            <div
              className={`absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50 transform transition-all duration-200 origin-top-right
                ${showUserMenu ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
              `}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
                <p className="text-sm font-bold text-gray-900">Hesabım</p>
                <p className="text-xs text-gray-500 mt-1 truncate font-medium">
                  {session?.user?.email}
                </p>
              </div>

              {/* Linkler */}
              <div className="p-2 space-y-1">
                <Link
                  href="/admin/profile"
                  className="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="p-1.5 bg-gray-100 text-gray-500 rounded-lg group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-all">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  Profil Bilgileri
                </Link>
                <Link
                  href="/admin/settings"
                  className="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="p-1.5 bg-gray-100 text-gray-500 rounded-lg group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-all">
                    <Settings className="w-4 h-4" />
                  </div>
                  Sistem Ayarları
                </Link>
              </div>

              <div className="h-px bg-gray-100 my-1 mx-4"></div>

              {/* Çıkış */}
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="group w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <div className="p-1.5 bg-red-50 text-red-500 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                    <LogOut className="w-4 h-4" />
                  </div>
                  Güvenli Çıkış
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
