"use client";

import {
  DollarSign,
  Eye,
  PackageCheck,
  ShoppingCart,
  TrendingUp,
  UserPlus,
  LucideIcon,
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
  TooltipProps,
} from "recharts";

import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

// --- TİP TANIMLAMALARI ---

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

// İstatistik Kartı Tipi (Dinamik hale getirildi)
interface StatItem {
  title: string;
  value: string;
  changeRate: number; // Yüzdelik değişim (Sayısal)
  icon: LucideIcon;
  variant: "green" | "blue" | "purple" | "orange";
}

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

interface SalesDataItem {
  month: string;
  income: number;
  order: number;
}

interface CategoryDataItem {
  [key: string]: string | number;
  id: string;
  name: string;
  value: number;
}

// ✅ GÜNCELLENMİŞ PROPS: Change verileri eklendi
interface DashboardDataProps {
  data: {
    revenue: number;
    revenueChange: number; // Yeni

    ordersCount: number;
    ordersChange: number; // Yeni

    usersCount: number;
    usersChange: number; // Yeni

    productsSoldCount: number;
    productsSoldChange: number; // Yeni

    salesData: SalesDataItem[];
    categoryData: CategoryDataItem[];
    recentOrders: Order[];
  };
}

// --- SABİTLER VE HARİTALAMALAR ---

const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Bekliyor",
  PAID: "Ödendi",
  SHIPPED: "Kargolandı",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal",
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const STAT_VARIANTS = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
};

// --- BİLEŞEN ---

export default function DashboardClient({ data }: DashboardDataProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(value);
  };

  // ✅ İSTATİSTİK VERİLERİNİ BAĞLAMA (Hardcoded veriler silindi)
  const stats: StatItem[] = [
    {
      title: "Toplam Gelir",
      value: formatCurrency(data.revenue),
      changeRate: data.revenueChange, // Dinamik veri
      icon: DollarSign,
      variant: "green",
    },
    {
      title: "Toplam Sipariş",
      value: data.ordersCount.toString(),
      changeRate: data.ordersChange, // Dinamik veri
      icon: ShoppingCart,
      variant: "blue",
    },
    {
      title: "Aktif Kullanıcı",
      value: data.usersCount.toString(),
      changeRate: data.usersChange, // Dinamik veri
      icon: UserPlus,
      variant: "purple",
    },
    {
      title: "Satılan Ürün",
      value: data.productsSoldCount.toString(),
      changeRate: data.productsSoldChange, // Dinamik veri
      icon: PackageCheck,
      variant: "orange",
    },
  ];

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType> & {
    payload?: Array<{
      value: string | number | (string | number)[] | undefined;
      name: string;
      payload: {
        month: string;
        income: number;
        order: number;
        [key: string]: string | number;
      };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
          <p className="font-semibold text-gray-700 mb-1">{label}</p>
          <p className="text-blue-600 text-sm">
            Gelir: {formatCurrency(Number(payload[0].payload.income))}
          </p>
          <p className="text-blue-600 text-sm">
            Sipariş: {payload[0].payload.order}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            KervanPazar Yönetim Paneli ve İstatistikleri
          </p>
        </div>
        {/* <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            Tarih Filtresi
          </button>
          <button className="px-4 py-2 bg-[#667EEA] text-white rounded-lg text-sm font-medium hover:bg-[#5a6fd6] transition-colors shadow-sm shadow-indigo-200">
            Rapor İndir
          </button>
        </div> */}
      </div>

      {/* ✅ GÜNCELLENMİŞ İSTATİSTİK KARTLARI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;

          // Artış mı Azalış mı kontrolü
          const isPositive = stat.changeRate >= 0;
          // Format: +%12.5 veya %-5.2
          const changeLabel = `${isPositive ? "+" : ""}%${stat.changeRate.toFixed(1)}`;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </h3>

                  {/* Dinamik Trend Göstergesi */}
                  <div
                    className={`flex items-center gap-1.5 text-sm font-medium w-fit px-2 py-0.5 rounded-full ${
                      isPositive
                        ? "text-emerald-600 bg-emerald-50" // Pozitif ise Yeşil
                        : "text-red-600 bg-red-50" // Negatif ise Kırmızı
                    }`}
                  >
                    {/* Negatif ise ikonu ters çevir */}
                    <TrendingUp
                      className={`w-3.5 h-3.5 ${!isPositive ? "rotate-180" : ""}`}
                    />
                    <span>{changeLabel}</span>
                    <span className="text-gray-400 text-xs font-normal ml-1 hidden sm:inline">
                      geçen aya göre
                    </span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl ${STAT_VARIANTS[stat.variant]}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grafikler Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Satış Grafiği */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Satış Performansı (Son 6 Ay)
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.salesData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₺${value / 1000}k`}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#F3F4F6" }}
                />
                <Bar
                  dataKey="income"
                  fill="#667EEA"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pasta Grafik */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Kategori Dağılımı
          </h2>
          <div className="h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.categoryData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, "Adet"]} />
              </PieChart>
            </ResponsiveContainer>

            {/* Orta Kısım */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-900">
                {data.productsSoldCount}
              </span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Toplam
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {data.categoryData.slice(0, 4).map((cat, index) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="truncate">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Son Siparişler Tablosu */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Son Siparişler</h2>
          <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
            Tümünü Gör
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sipariş No
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="relative py-4 px-6">
                  <span className="sr-only">İşlem</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-gray-900 text-sm">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                    {order.customer}
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        STATUS_CLASSES[order.status] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.recentOrders.length === 0 && (
            <div className="text-center py-10">
              <PackageCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Henüz sipariş bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
