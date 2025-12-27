"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  DollarSign,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Filter,
  BarChart3,
  ArrowRight,
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
  PieLabelRenderProps,
} from "recharts";

export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

export interface SalesItem {
  month: string;
  income: number;
  [key: string]: string | number; // Recharts'ın dinamik veri okuması için şart knk
}

export interface CategoryItem {
  name: string;
  value: number;
  [key: string]: string | number; // 'Index signature missing' hatasını bu satır çözer
}

export interface DashboardData {
  revenue: number;
  pendingCount: number;
  deliveredCount: number;
  cancelledCount: number;
  ordersCount: number;
  usersCount: number;
  productsSoldCount: number;
  salesData: SalesItem[];
  categoryData: CategoryItem[];
  recentOrders: Order[];
  availableYears: number[];
}

// Merkezi tipleri import ediyoruz knk

// --- SABİTLER ---
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Bekliyor",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargolandı",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

const STATUS_CLASSES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];

interface DashboardClientProps {
  data: DashboardData;
}

export default function DashboardClient({ data }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSalesYear = searchParams.get("salesYear") || "";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(value);
  };

  const currentMonthName = new Date().toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (year) {
      params.set("salesYear", year);
    } else {
      params.delete("salesYear");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const stats = [
    {
      title: "Aylık Ciro",
      value: formatCurrency(data.revenue),
      subText: "Bu ayki toplam kazanç",
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Bekleyen Siparişler",
      value: data.pendingCount.toString(),
      subText: "Bu ay işleme alınanlar",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Teslim Edilenler",
      value: data.deliveredCount.toString(),
      subText: "Bu ay teslim edilenler",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "İptal Edilenler",
      value: data.cancelledCount.toString(),
      subText: "Bu ay iptal/iade edilenler",
      icon: XCircle,
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 p-8 text-left">
      {/* ÜST BAŞLIK VE RAPOR BUTONU */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Yönetim Paneli
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              KervanPazar Mağaza İstatistikleri -{" "}
              <span className="text-indigo-600">Hoş geldiniz!</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => router.push("/admin/reports")}
              className="group flex items-center gap-3 bg-white hover:bg-indigo-600 text-gray-700 hover:text-white px-6 py-3 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 active:scale-95"
            >
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <BarChart3 size={20} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">Rapor Al</span>
                <span className="text-[10px] opacity-70 italic">
                  Tüm verileri incele
                </span>
              </div>
              <ArrowRight
                size={16}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
              />
            </button>

            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-bold text-gray-700 capitalize">
                {currentMonthName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-${stat.color}-50 text-${stat.color}-600`}
              >
                <Icon size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-xs text-gray-400 mt-3 font-semibold">
                  {stat.subText}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grafik Alanları */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 tracking-tight italic">
              Satış Performansı
            </h2>
            <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
              <Filter size={14} className="text-gray-400 ml-2" />
              <select
                value={currentSalesYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="text-xs bg-transparent font-bold text-gray-600 outline-none pr-2 cursor-pointer"
              >
                <option value="">Son 6 Ay</option>
                {data.availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year} Yılı
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.salesData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="income"
                  fill="#4f46e5"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 tracking-tight mb-8 italic">
            Kategori Dağılımı
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  // 🔥 HATAYI BİTİREN KISIM BURASI 🔥
                  label={({ name, percent }: PieLabelRenderProps) =>
                    `${name} %${((percent as number) * 100).toFixed(0)}`
                  }
                >
                  {data.categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Son Siparişler Tablosu */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h2 className="text-xl font-black text-gray-900 tracking-tight italic">
            Son Siparişler (Bu Ay)
          </h2>
          <button
            onClick={() => router.push("/admin/orders")}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Hepsini Gör
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="py-5 px-8">Sipariş No</th>
                <th className="py-5 px-8">Müşteri</th>
                <th className="py-5 px-8">Tutar</th>
                <th className="py-5 px-8">Durum</th>
                <th className="py-5 px-8">Tarih</th>
                <th className="py-5 px-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="group hover:bg-gray-50/80 transition-all"
                >
                  <td className="py-6 px-8 font-mono text-xs font-bold text-indigo-500">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-6 px-8 font-bold text-gray-900">
                    {order.customer}
                  </td>
                  <td className="py-6 px-8 font-black text-gray-900">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="py-6 px-8">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${STATUS_CLASSES[order.status] || "bg-gray-100"}`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-xs font-bold text-gray-400">
                    {order.date}
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="p-2 text-gray-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
