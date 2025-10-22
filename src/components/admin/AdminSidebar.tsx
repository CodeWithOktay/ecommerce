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

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    badge: 3,
  },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Siparişler', badge: 12 },
  { href: '/admin/products', icon: Package, label: 'Ürünler', badge: 5 },
  { href: '/admin/users', icon: Users, label: 'Kullanıcılar', badge: 8 },
  { href: '/admin/settings', icon: Settings, label: 'Ayarlar' },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/admin/login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-20 w-40 bg-gradient-to-b from-gray-900 to-gray-800 text-white transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isHovered ? 'lg:w-80' : 'lg:w-20'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full">
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
                />
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative
                      ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-400 border-r-4 border-blue-500 shadow-lg'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }
                      ${!isHovered && 'lg:justify-center lg:px-3'}
                    `}
                    onClick={onClose}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        p-2 rounded-lg transition-colors
                        ${
                          isActive
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600'
                        }
                      `}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`font-medium transition-all duration-300 ${isHovered ? 'opacity-100' : 'lg:opacity-0 lg:absolute'}`}
                      >
                        {item.label}
                      </span>
                    </div>

                    {item.badge && (
                      <div
                        className={`
                        flex items-center gap-2 transition-all duration-300
                        ${isHovered ? 'opacity-100' : 'lg:opacity-0 lg:absolute'}
                      `}
                      >
                        <span
                          className={`
                          px-2 py-1 text-xs rounded-full font-medium
                          ${
                            isActive
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-700 text-gray-300'
                          }
                        `}
                        >
                          {item.badge}
                        </span>
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

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className={`
                flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all duration-200 group
                ${!isHovered && 'lg:justify-center lg:px-3'}
              `}
            >
              <div className="p-2 rounded-lg bg-gray-700/50 group-hover:bg-red-500/30 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
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
