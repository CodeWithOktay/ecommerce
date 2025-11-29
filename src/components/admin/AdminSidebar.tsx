'use client';

import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// Props interface'i - admin sidebar bileşeninin alacağı props'lar
interface AdminSidebarProps {
  isOpen: boolean; // Sidebar'ın açık/kapalı durumu
  onClose: () => void; // Sidebar'ı kapatma fonksiyonu
}

// Menü öğeleri için interface
interface MenuItem {
  href: string; // Yönlendirme linki
  icon: React.ComponentType<{ className?: string }>; // Lucide React ikonu
  label: string; // Menü öğesi etiketi
  badge?: number; // Opsiyonel: bildirim sayısı
}

/**
 * Admin menü öğeleri dizisi
 * Dashboard, siparişler, ürünler, kullanıcılar ve ayarlar bölümleri
 */
const menuItems: MenuItem[] = [
  {
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    badge: 3, // Bekleyen işlem sayısı
  },
  { 
    href: '/admin/orders', 
    icon: ShoppingCart, 
    label: 'Siparişler', 
    badge: 12 // Yeni sipariş sayısı
  },
  { 
    href: '/admin/products', 
    icon: Package, 
    label: 'Ürünler', 
    badge: 5 // Düzenlenecek ürün sayısı
  },
  { 
    href: '/admin/users', 
    icon: Users, 
    label: 'Kullanıcılar', 
    badge: 8 // Yeni kullanıcı sayısı
  },
  { 
    href: '/admin/settings', 
    icon: Settings, 
    label: 'Ayarlar' 
    // Ayarlar için badge yok
  },
];

/**
 * Admin Sidebar Bileşeni
 * 
 * Admin paneli için yönlendirme menüsü.
 * Collapsible sidebar özelliği ile desktop'ta hover ile genişler.
 * Mobile'da slide-in menü olarak çalışır.
 */
export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  // Mevcut sayfa yolunu al
  const pathname = usePathname();
  // Desktop'ta hover durumunu takip et
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Çıkış yapma fonksiyonu
   * NextAuth signOut ile kullanıcı oturumunu sonlandırır
   */
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/admin/login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* ✅ Mobile Overlay - sidebar açıkken arkaplan karartması */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ✅ Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isHovered ? 'lg:w-80' : 'lg:w-20'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="navigation"
        aria-label="Admin menüsü"
      >
        <div className="flex flex-col h-full">
          {/* ✅ Header - Logo ve Kapatma Butonu */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div
              className={`flex items-center gap-3 transition-all duration-300 ${!isHovered && 'lg:justify-center'}`}
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/kervanpazar-logo.png"
                  alt="KervanPazar Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/* Logo yanında marka adı - sadece geniş modda görünür */}
              <span className={`font-bold text-lg transition-all duration-300 ${isHovered ? 'opacity-100' : 'lg:opacity-0 lg:absolute'}`}>
                KervanPazar
              </span>
            </div>

            {/* Mobile Kapatma Butonu - sadece mobilde görünür */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors lg:hidden"
              aria-label="Menüyü kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ✅ Navigasyon Menüsü */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                // Mevcut sayfa aktif menü öğesi mi kontrol et
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative
                      ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-400 border-r-4 border-blue-500 shadow-lg' // Aktif menü stili
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white' // Normal menü stili
                      }
                      ${!isHovered && 'lg:justify-center lg:px-3'} // Dar modda içeriği ortala
                    `}
                    onClick={onClose} // Mobile'da tıklamada menüyü kapat
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-3">
                      {/* Menü İkonu */}
                      <div
                        className={`
                        p-2 rounded-lg transition-colors
                        ${
                          isActive
                            ? 'bg-blue-500 text-white' // Aktif ikon stili
                            : 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600' // Normal ikon stili
                        }
                      `}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {/* Menü Etiketi - sadece geniş modda görünür */}
                      <span
                        className={`font-medium transition-all duration-300 ${isHovered ? 'opacity-100' : 'lg:opacity-0 lg:absolute'}`}
                      >
                        {item.label}
                      </span>
                    </div>

                    {/* Badge ve Ok İkonu - bildirim sayısı varsa göster */}
                    {item.badge && (
                      <div
                        className={`
                        flex items-center gap-2 transition-all duration-300
                        ${isHovered ? 'opacity-100' : 'lg:opacity-0 lg:absolute'}
                      `}
                      >
                        {/* Bildirim Badge'i */}
                        <span
                          className={`
                          px-2 py-1 text-xs rounded-full font-medium
                          ${
                            isActive
                              ? 'bg-blue-500 text-white' // Aktif badge stili
                              : 'bg-gray-700 text-gray-300' // Normal badge stili
                          }
                        `}
                        >
                          {item.badge}
                        </span>
                        {/* Yön oku - aktif menüde döner */}
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : ''}`}
                        />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* ✅ Çıkış Butonu - sidebar'ın alt kısmında */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className={`
                flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all duration-200 group
                ${!isHovered && 'lg:justify-center lg:px-3'} // Dar modda içeriği ortala
              `}
              aria-label="Çıkış yap"
            >
              {/* Çıkış İkonu */}
              <div className="p-2 rounded-lg bg-gray-700/50 group-hover:bg-red-500/30 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              {/* Çıkış Metni - sadece geniş modda görünür */}
              <span
                className={`transition-all duration-300 ${isHovered ? 'opacity-100' : 'lg:opacity-0 lg:absolute'}`}
              >
                Çıkış Yap
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}