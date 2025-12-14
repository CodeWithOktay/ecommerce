"use client";

import {
  ChevronRight,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    pendingOrders: number;
    lowStockProducts: number;
    totalUsers: number;
    totalAdmins: number;
    totalCategories: number;
  };
}

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
}

export default function AdminSidebar({
  isOpen,
  onClose,
  stats,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems: MenuItem[] = [
    {
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: "/admin/orders",
      icon: ShoppingCart,
      label: "Siparişler",
      badge: stats.pendingOrders,
    },
    {
      href: "/admin/products",
      icon: Package,
      label: "Ürünler",
      badge: stats.lowStockProducts,
    },
    {
      href: "/admin/categories",
      icon: FolderTree,
      label: "Kategoriler",
      badge: stats.totalCategories,
    },
    {
      href: "/admin/customers",
      icon: Users,
      label: "Müşteriler",
      badge: stats.totalUsers,
    },
    {
      href: "/admin/administrators",
      icon: Users,
      label: "Yöneticiler",
      badge: stats.totalAdmins,
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Ayarlar",
    },
    {
      href: "/admin/logs",
      icon: Settings,
      label: "Loglar",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/admin/login" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-[#111827] text-white 
          transform transition-all duration-300 ease-in-out lg:static
          ${isOpen ? "translate-x-0 w-72" : "-translate-x-full w-72 lg:translate-x-0"}
          ${isHovered ? "lg:w-72" : "lg:w-20"}
          border-r border-gray-800 shadow-2xl flex flex-col
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* --- HEADER (LOGO) --- */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-800 flex-shrink-0">
          {/* Logo Container - Animasyonlu */}
          <div
            className={`flex items-center transition-all duration-300 ${isHovered ? "w-full px-2" : "w-full justify-center"}`}
          >
            <div
              className={`relative h-10 flex-shrink-0 transition-all duration-300 overflow-hidden ${isHovered ? "w-48" : "w-10"}`}
            >
              {/* Logo Resmi */}
              <Image
                src="/kervanpazar-logo.png"
                alt="Logo"
                fill
                className={`object-contain transition-all duration-300 ${isHovered ? "object-left" : "object-left"}`}
                // Not: Kapalıyken (w-10) object-left diyerek logonun sadece baş kısmını (ikonunu) gösteriyoruz.
                priority
              />
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- NAVİGASYON --- */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`
                      group relative flex items-center px-3 py-3 rounded-xl transition-all duration-200
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                  >
                    {/* İkon */}
                    <div
                      className={`flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Metin (Animasyonlu) */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap
                      ${isHovered ? "w-40 ml-3 opacity-100" : "w-0 ml-0 opacity-0 lg:w-0"}`}
                    >
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>

                    {/* Badge (Sayı) */}
                    {item.badge !== undefined && item.badge > 0 && (
                      <div
                        className={`
                        absolute right-2 transition-all duration-300
                        ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 lg:hidden"}
                      `}
                      >
                        <span
                          className={`
                           px-2 py-0.5 text-[10px] font-bold rounded-full
                           ${isActive ? "bg-white text-blue-600" : "bg-blue-600 text-white"}
                         `}
                        >
                          {item.badge}
                        </span>
                      </div>
                    )}

                    {/* Kapalıyken çıkan küçük nokta badge */}
                    {!isHovered &&
                      item.badge !== undefined &&
                      item.badge > 0 && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full lg:block hidden"></div>
                      )}

                    {/* Tooltip (Sadece kapalıyken) */}
                    <div
                      className={`
                      absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md shadow-xl 
                      opacity-0 invisible -translate-x-2 transition-all z-50 whitespace-nowrap border border-gray-700
                      lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:translate-x-0
                      ${isHovered ? "hidden" : "block"}
                    `}
                    >
                      {item.label}
                      {item.badge ? ` (${item.badge})` : ""}
                      {/* Tooltip Oku */}
                      <div className="absolute top-1/2 -left-1 -mt-1 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 transform rotate-45"></div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* --- FOOTER (ÇIKIŞ) --- */}
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`
              flex items-center w-full px-3 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 group
            `}
          >
            <div className="flex-shrink-0">
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap
                ${isHovered ? "w-40 ml-3 opacity-100" : "w-0 ml-0 opacity-0 lg:w-0"}`}
            >
              <span className="font-medium text-sm">Çıkış Yap</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
