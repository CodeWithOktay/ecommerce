"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  User,
  Package,
  LogOut,
  ChevronDown,
  UserPlus,
  LogIn,
  LayoutDashboard,
} from "lucide-react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Loading
  if (status === "loading")
    return (
      <div className="h-[42px] w-32 bg-gray-100 animate-pulse rounded-xl"></div>
    );

  // GİRİŞ YAPMAMIŞ (Login / Register)
  if (!session) {
    return (
      <div className="flex items-center gap-3">
        {/* Giriş Yap Linki */}
        <Link
          href="/login"
          className="flex items-center gap-2 bg-gradient-to-tr from-[#667EEA] to-[#764BA2] text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:opacity-95 transition-all font-semibold text-sm"
        >
          {" "}
          <User size={18} />
          Merhaba, Giriş Yapın.
        </Link>
        <span className=" flex items-center gap-2 bg-gradient-to-tr from-gray-100 to-gray-200 text-gray-800 px-5 py-2.5 rounded-xl transition-all text-sm">
          Yeni müşteri misiniz? <br />
          <Link
            href="/register"
            className="flex items-center gap-2 text-gray-800 over:opacity-95 hover:shadow-lg hover:text-color-gray-800 rounded-xl transition-all hover:font-semibold text-sm"
          >
            <UserPlus size={18} />
            Üye olun.
          </Link>
        </span>
      </div>
    );
  }

  // GİRİŞ YAPMIŞ (Profil Butonu)
  return (
    <div className="relative z-50">
      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 border font-semibold text-sm
          ${isOpen ? "bg-purple-50 border-[#667EEA]/30" : "bg-transparent border-transparent hover:bg-gray-50"}`}
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#667EEA] to-[#764BA2] text-white flex items-center justify-center text-xs font-bold">
          {session.user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="hidden lg:block text-gray-700">
          {session.user?.name}
        </div>

        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown İçerik */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
          {/* Menü linkleri aynen kalabilir */}
          <div className="p-2 flex flex-col gap-1">
            <Link
              href="/hesabim/siparislerim"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-[#667EEA]/10 hover:text-[#667EEA]"
            >
              <Package size={18} /> Siparişlerim
            </Link>
            <Link
              href="/myaccount/bilgilerim"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-[#667EEA]/10 hover:text-[#667EEA]"
            >
              <User size={18} /> Bilgilerim
            
            </Link>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50 w-full text-left"
            >
              <LogOut size={18} /> Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
