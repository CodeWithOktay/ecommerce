'use client';

import {
  DollarSign,
  Eye,
  PackageCheck,
  ShoppingCart,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend: 'up' | 'down';
}

interface SalesData {
  month: string;
  gelir: number;
  siparis: number;
}

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
}

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number;
}

const STATS: StatCard[] = [
  {
    title: 'Toplam Gelir',
    value: '₺45,678',
    change: '+12.5%',
    icon: DollarSign,
    color: 'green',
    trend: 'up',
  },
  {
    title: 'Toplam Sipariş',
    value: '1,234',
    change: '+8.2%',
    icon: ShoppingCart,
    color: 'blue',
    trend: 'up',
  },
  {
    title: 'Aktif Kullanıcı',
    value: '8,901',
    change: '+5.7%',
    icon: UserPlus,
    color: 'purple',
    trend: 'up',
  },
  {
    title: 'Ürün Satışı',
    value: '567',
    change: '+3.4%',
    icon: PackageCheck,
    color: 'orange',
    trend: 'up',
  },
];

const SALES_DATA: SalesData[] = [
  { month: 'Ocak', gelir: 12000, siparis: 45 },
  { month: 'Şubat', gelir: 15000, siparis: 52 },
  { month: 'Mart', gelir: 10000, siparis: 38 },
  { month: 'Nisan', gelir: 22000, siparis: 68 },
  { month: 'Mayıs', gelir: 19000, siparis: 59 },
  { month: 'Haziran', gelir: 24000, siparis: 72 },
];

const RECENT_ORDERS: Order[] = [
  {
    id: '#ORD1001',
    customer: 'Ahmet Yılmaz',
    amount: 450,
    status: 'completed',
    date: '2024-01-15',
  },
  {
    id: '#ORD1002',
    customer: 'Ayşe Demir',
    amount: 890,
    status: 'pending',
    date: '2024-01-15',
  },
  {
    id: '#ORD1003',
    customer: 'Mehmet Kaya',
    amount: 320,
    status: 'completed',
    date: '2024-01-14',
  },
  {
    id: '#ORD1004',
    customer: 'Zeynep Şahin',
    amount: 1250,
    status: 'completed',
    date: '2024-01-14',
  },
  {
    id: '#ORD1005',
    customer: 'Can Öztürk',
    amount: 670,
    status: 'pending',
    date: '2024-01-13',
  },
];

const CATEGORY_DATA: CategoryData[] = [
  { name: 'Elektronik', value: 35 },
  { name: 'Giyim', value: 25 },
  { name: 'Ev & Yaşam', value: 20 },
  { name: 'Kitap', value: 15 },
  { name: 'Diğer', value: 5 },
];

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

const COLOR_CLASSES: Record<'blue' | 'green' | 'purple' | 'orange', string> = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
};

const STATUS_CLASSES = {
  completed: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export default function DashboardPage() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">KervanPazar Yönetim Paneli</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Rapor İndir
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Yeni Ekle
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {STATS.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.change}</span>
                    <span className="text-gray-500">geçen aya göre</span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${COLOR_CLASSES[stat.color]} text-white shadow-lg`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Satış Performansı
            </h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg font-medium">
                Aylık
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded-lg font-medium">
                Yıllık
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  formatter={(value) => [
                    typeof value === 'number' ? formatCurrency(value) : value,
                    'Değer',
                  ]}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar
                  dataKey="gelir"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  name="Gelir"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Kategori Dağılımı
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} %${(percent * 100).toFixed(0)}`
                  }
                  labelLine={false}
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`%${value}`, 'Oran']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {CATEGORY_DATA.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-medium text-gray-900 ml-auto">
                  %{item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Son Siparişler
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Tümünü Gör →
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Sipariş No
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Müşteri
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Tutar
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Durum
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Tarih
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">
                        {order.id}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700">{order.customer}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">
                        {formatCurrency(order.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border font-medium ${STATUS_CLASSES[order.status]}`}
                      >
                        {order.status === 'completed'
                          ? 'Tamamlandı'
                          : order.status === 'pending'
                            ? 'Beklemede'
                            : 'İptal Edildi'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {order.date}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
