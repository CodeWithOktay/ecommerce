'use client';

import {
  BarChart3,
  Bell,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Users,
  X,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Types
interface StatCard {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

interface MenuItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface SalesData {
  month: string;
  gelir: number;
}

// Constants
const STATS: StatCard[] = [
  { title: 'Kullanıcılar', value: '1,234', icon: Users, color: 'blue' },
  { title: 'Siparişler', value: '567', icon: ShoppingCart, color: 'green' },
  { title: 'Ürünler', value: '890', icon: Package, color: 'purple' },
  { title: 'Aylık Gelir', value: '₺45,678', icon: BarChart3, color: 'orange' },
];

const MENU_ITEMS: MenuItem[] = [
  { name: 'Dashboard', icon: BarChart3, href: '/admin/dashboard' },
  { name: 'Kullanıcılar', icon: Users, href: '/admin/users' },
  { name: 'Ürünler', icon: Package, href: '/admin/products' },
  { name: 'Siparişler', icon: ShoppingCart, href: '/admin/orders' },
  { name: 'Ayarlar', icon: Settings, href: '/admin/settings' },
];

const SALES_DATA: SalesData[] = [
  { month: 'Ocak', gelir: 12000 },
  { month: 'Şubat', gelir: 15000 },
  { month: 'Mart', gelir: 10000 },
  { month: 'Nisan', gelir: 22000 },
  { month: 'Mayıs', gelir: 19000 },
  { month: 'Haziran', gelir: 24000 },
];

const ORDER_STATUS = {
  completed: { text: 'Tamamlandı', classes: 'bg-green-100 text-green-800' },
  pending: { text: 'Beklemede', classes: 'bg-yellow-100 text-yellow-800' },
};

// Color mapping for dynamic classes
const COLOR_CLASSES = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
};

export default function ManagementDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/admin/login');
      return;
    }

    if (session.user?.role !== 'ADMIN') {
      router.push('/admin/unauthorized');
      return;
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: '/admin/login' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (): string => {
    return (
      session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'A'
    );
  };

  const getOrderStatus = (index: number) => {
    return index % 2 === 0 ? ORDER_STATUS.completed : ORDER_STATUS.pending;
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  // Auth check
  if (!session || session.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r shadow-sm transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-lg font-bold text-blue-600">
              KervanPazar Admin
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Sidebar'ı kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Kullanıcı Bilgisi */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">
                  {session.user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user?.email}
                </p>
                <p className="text-xs font-semibold text-blue-600">
                  {session.user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Menü */}
          <nav className="flex-1 p-3 space-y-1">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-500 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Ana içerik - Sidebar genişliğine göre margin eklendi */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0 min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Sidebar'ı aç"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative max-w-md w-full mx-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ara..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Bildirimler"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* İçerik - Sidebar'dan kaçacak şekilde düzenlendi */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-full">
            <h1 className="text-2xl font-bold mb-6">
              Hoş geldin, {session.user?.name || 'Admin'} 👋
            </h1>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              {STATS.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="bg-white p-4 lg:p-6 rounded-xl border shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500 truncate">
                          {stat.title}
                        </p>
                        <p className="text-xl lg:text-2xl font-bold mt-1 truncate">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`p-2 lg:p-3 rounded-lg flex-shrink-0 ${COLOR_CLASSES[stat.color]}`}
                      >
                        <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grafik + Son Siparişler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Satış Grafiği */}
              <div className="bg-white rounded-xl border shadow-sm p-4 lg:p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Aylık Satış Grafiği
                </h2>
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={SALES_DATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₺${value}`, 'Gelir']} />
                      <Line
                        type="monotone"
                        dataKey="gelir"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Son Siparişler */}
              <div className="bg-white rounded-xl border shadow-sm p-4 lg:p-6">
                <h2 className="text-lg font-semibold mb-4">Son Siparişler</h2>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => {
                    const status = getOrderStatus(item);

                    return (
                      <div
                        key={item}
                        className="flex items-center justify-between py-2 border-b last:border-none"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 truncate">
                            #ORD10{item}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            Ahmet Yılmaz • ₺{item * 200}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium flex-shrink-0 ml-2 ${status.classes}`}
                        >
                          {status.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
