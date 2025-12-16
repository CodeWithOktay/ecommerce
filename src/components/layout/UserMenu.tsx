"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  User,
  LogOut,
  ShoppingBag,
  LayoutDashboard,
  LogIn,
  UserPlus,
  ChevronDown,
} from "lucide-react";

export default function UserMenu() {
  const { data: session } = useSession();

  // DURUM 1: HİÇ GİRİŞ YAPILMAMIŞ (MİSAFİR)
  if (!session) {
    return (
      <div className="group relative z-50">
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100/80 hover:text-[#764BA2] transition-all duration-300">
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-full group-hover:border-[#764BA2]/30 group-hover:bg-white transition-colors">
            <LogIn
              size={20}
              className="text-gray-500 group-hover:text-[#764BA2]"
            />
          </div>
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-bold flex items-center gap-1">
              Giriş Yap
              <ChevronDown
                size={14}
                className="text-gray-400 group-hover:rotate-180 transition-transform duration-300"
              />
            </span>
          </div>
        </button>

        {/* Dropdown Menü (Misafir) */}
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-[#667EEA]/10 border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
          <div className="absolute top-0 right-6 -mt-2 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>

          <div className="px-5 py-4 text-center border-b border-gray-50">
            <h3 className="text-base font-bold text-gray-900">
              Hoş Geldiniz! 👋
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Siparişlerini takip etmek ve fırsatlardan yararlanmak için giriş
              yap.
            </p>
          </div>

          <div className="p-3 space-y-2">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white text-sm font-bold shadow-lg shadow-[#667EEA]/20 hover:shadow-[#667EEA]/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              <LogIn size={18} />
              Giriş Yap
            </Link>

            <Link
              href="/register"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-gray-700 hover:text-[#764BA2] hover:border-[#764BA2]/30 hover:bg-purple-50 text-sm font-bold transition-all duration-300"
            >
              <UserPlus size={18} />
              Üye Ol
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // DURUM 2: ADMİN GİRİŞİ YAPILMIŞ
  if (session.user.role === "ADMIN") {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden lg:block text-[10px] font-extrabold text-[#764BA2] bg-[#764BA2]/10 px-2 py-1 rounded border border-[#764BA2]/20 uppercase tracking-wider">
          Yönetici
        </span>
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-[#667EEA]/30 transition-all duration-300 active:scale-95"
        >
          <LayoutDashboard size={18} />
          <span className="hidden sm:inline">Panele Git</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          title="Güvenli Çıkış"
        >
          <LogOut size={20} />
        </button>
      </div>
    );
  }

  // DURUM 3: NORMAL MÜŞTERİ GİRİŞİ (USER)
  return (
    <div className="group relative z-50">
      <button className="flex items-center gap-2 hover:opacity-80 transition outline-none">
        <div className="w-10 h-10 p-[2px] rounded-full bg-gradient-to-r from-[#667EEA] to-[#764BA2]">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            <User size={18} className="text-[#764BA2]" />
          </div>
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
            Hesabım
          </p>
          <p className="text-sm font-bold text-gray-900 leading-none truncate max-w-[120px]">
            {session.user.firstName}
          </p>
        </div>
      </button>

      {/* Dropdown Menü (User) */}
      <div className="absolute right-0 top-full mt-4 w-64 bg-white rounded-2xl shadow-xl shadow-[#667EEA]/10 border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
        <div className="absolute top-0 right-3 -mt-2 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>

        <div className="px-5 py-3 border-b border-gray-50 mb-2">
          <p className="text-xs text-gray-400 font-medium mb-1">Aktif Hesap</p>
          <p className="font-bold text-sm truncate text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#667EEA] to-[#764BA2]"></span>
            {session.user.email}
          </p>
        </div>

        <div className="px-2 space-y-1">
          <Link
            href="/account/profile"
            className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 hover:text-[#764BA2] hover:bg-purple-50 rounded-xl transition-all group/item"
          >
            <User
              size={18}
              className="text-gray-400 group-hover/item:text-[#764BA2] transition-colors"
            />
            Profilim
          </Link>
          <Link
            href="/account/orders"
            className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 hover:text-[#764BA2] hover:bg-purple-50 rounded-xl transition-all group/item"
          >
            <ShoppingBag
              size={18}
              className="text-gray-400 group-hover/item:text-[#764BA2] transition-colors"
            />
            Siparişlerim
          </Link>
        </div>

        <div className="border-t border-gray-50 mt-2 pt-2 px-2">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}
