"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, ShoppingBag, LayoutDashboard } from "lucide-react";

export default function UserMenu() {
  const { data: session } = useSession();

  // DURUM 1: HİÇ GİRİŞ YAPILMAMIŞ (MİSAFİR)
  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-700 hover:text-black transition"
        >
          Giriş Yap
        </Link>
        <Link
          href="/register"
          className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
        >
          Kayıt Ol
        </Link>
      </div>
    );
  }

  // DURUM 2: ADMİN GİRİŞİ YAPILMIŞ
  // Admin ana sayfada gezerken müşteri menülerini görmesin.
  if (session.user.role === "ADMIN") {
    return (
      <div className="flex items-center gap-3">
        {/* Sadece Admin olduğunu hatırlatan ufak bir etiket */}
        <span className="hidden md:block text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
          Yönetici Modu
        </span>

        {/* Panele Dönüş Butonu */}
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition shadow-md"
        >
          <LayoutDashboard size={16} />
          Panele Git
        </Link>
      </div>
    );
  }

  // DURUM 3: NORMAL MÜŞTERİ GİRİŞİ (USER)
  // Burası senin standart müşteri menün
  return (
    <div className="group relative z-50">
      <button className="flex items-center gap-2 hover:opacity-80 transition outline-none">
        {/* Avatar veya İsim */}
        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
          <User size={18} className="text-gray-600" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs text-gray-500">Hesabım</p>
          <p className="text-sm font-semibold text-gray-900 leading-none">
            {session.user.firstName}
          </p>
        </div>
      </button>

      {/* Dropdown Menü */}
      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
        <div className="px-4 py-3 border-b border-gray-50 mb-1">
          <p className="text-xs text-gray-500">Giriş yapıldı</p>
          <p className="font-semibold text-sm truncate text-gray-900">
            {session.user.email}
          </p>
        </div>

        <Link
          href="/account/profile"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <User size={16} className="text-gray-400" />
          Profilim
        </Link>

        <Link
          href="/account/orders"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ShoppingBag size={16} className="text-gray-400" />
          Siparişlerim
        </Link>

        <div className="border-t border-gray-50 mt-1 pt-1">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}
