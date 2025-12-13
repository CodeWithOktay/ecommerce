// app/admin/dashboard/dashboard-client.tsx
"use client";

import {
  DollarSign,
  Eye,
  PackageCheck,
  ShoppingCart,
  TrendingUp,
  UserPlus,
} from "lucide-react";

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
} from "recharts";

// Gelen veri tipleri (Server Action'dan dönen yapıya uygun)
interface DashboardDataProps {
  data: {
    revenue: number;
    ordersCount: number;
    usersCount: number;
    productsSoldCount: number;
    salesData: any[];
    categoryData: any[];
    recentOrders: any[];
  };
}

const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
const STATUS_CLASSES: any = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PAID: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

export default function DashboardClient({ data }: DashboardDataProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(value);
  };

  // Dinamik İstatistik Kartları
  const stats = [
    {
      title: "Toplam Gelir",
      value: formatCurrency(data.revenue),
      change: "+12.5%", // Şimdilik sabit, ileride dinamik hesaplanabilir
      icon: DollarSign,
      color: "green",
      trend: "up",
    },
    {
      title: "Toplam Sipariş",
      value: data.ordersCount.toString(),
      change: "+8.2%",
      icon: ShoppingCart,
      color: "blue",
      trend: "up",
    },
    {
      title: "Aktif Kullanıcı",
      value: data.usersCount.toString(),
      change: "+5.7%",
      icon: UserPlus,
      color: "purple",
      trend: "up",
    },
    {
      title: "Satılan Ürün",
      value: data.productsSoldCount.toString(),
      change: "+3.4%",
      icon: PackageCheck,
      color: "orange",
      trend: "up",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 p-8">
      {/* Header bölümü */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">KervanPazar Yönetim Paneli</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Rapor İndir
            </button>
          </div>
        </div>
      </div>

      {/* İstatistik kartları grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat: any) => {
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
                  <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.change}</span>
                    <span className="text-gray-500">geçen aya göre</span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl bg-${stat.color}-100 text-${stat.color}-600`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grafikler bölümü */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Satış performansı grafiği */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Satış Performansı (Son 6 Ay)
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  formatter={(value: any) => [
                    typeof value === "number" ? formatCurrency(value) : value,
                    "Değer",
                  ]}
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

        {/* Kategori dağılımı grafiği */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Kategori Dağılımı (Ürün Sayısı)
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} %${(percent * 100).toFixed(0)}`
                  }
                >
                  {data.categoryData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Son siparişler tablosu */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Son Siparişler
          </h2>
        </div>
        <div className="p-6 overflow-x-auto">
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
                <th className="text-left py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order: any) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                >
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="py-4 px-4 text-gray-700">{order.customer}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full border font-medium ${STATUS_CLASSES[order.status] || "bg-gray-100"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {order.date}
                  </td>
                  <td className="py-4 px-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.recentOrders.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Henüz sipariş bulunmuyor.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
