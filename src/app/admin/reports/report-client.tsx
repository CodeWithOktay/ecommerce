"use client";

import { useRouter } from "next/navigation";
import { FileSpreadsheet, ArrowLeft, Mail, Phone } from "lucide-react";
import * as XLSX from "xlsx";

interface Order {
  id: string;
  shortId: string;
  customer: string;
  email: string | null;
  phone: string;
  details: string;
  date: string;
  amount: number;
  status: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Bekliyor",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargolandı",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
  REFUNDED: "İade Edildi",
};

interface ReportsClientProps {
  data: {
    revenue: number;
    recentOrders: Order[];
  };
}

export default function ReportsClient({ data }: ReportsClientProps) {
  const router = useRouter();

  const formatPhone = (phone: string) => {
    if (
      !phone ||
      ["Bilinmiyor", "Tanımsız", "-"].includes(phone.trim()) ||
      phone.trim() === ""
    ) {
      return "-";
    }
    return phone;
  };

  const downloadExcel = () => {
    const excelData = data.recentOrders.map((order) => ({
      "Sipariş No": `#${order.shortId}`,
      Müşteri: order.customer,
      "E-Posta": order.email || "N/A",
      Telefon: formatPhone(order.phone),
      Durum: STATUS_LABELS[order.status] || order.status,
      "Ürün Detayı": order.details,
      Tarih: order.date,
      Tutar: `${order.amount} TL`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SatisRaporu");
    XLSX.writeFile(
      workbook,
      `Satis_Raporu_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-left font-sans">
      <div className="mb-10 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="p-3 bg-white rounded-xl border shadow-sm hover:bg-slate-50 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={downloadExcel}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg flex items-center gap-3 hover:bg-emerald-700 transition-all active:scale-95"
        >
          <FileSpreadsheet size={20} /> DETAYLI EXCEL İNDİR
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                <th className="p-6">Sipariş No</th>
                <th className="p-6">Müşteri & İletişim</th>
                <th className="p-6">Durum</th>
                <th className="p-6">Ürünler</th>
                <th className="p-6">Tarih</th>
                <th className="p-6 text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-all group"
                >
                  <td className="p-6">
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg text-xs">
                      #{order.shortId}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-slate-900">
                      {order.customer}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <Mail size={10} /> {order.email || "N/A"}
                      <Phone size={10} className="ml-1" />{" "}
                      {formatPhone(order.phone)}
                    </div>
                  </td>
                  <td className="p-6">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                        order.status === "DELIVERED"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : order.status === "CANCELLED"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : "bg-blue-50 text-blue-700 border-blue-100"
                      }`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="p-6 text-xs italic text-slate-500 max-w-[200px] truncate">
                    {order.details}
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-400">
                    {order.date}
                  </td>
                  <td className="p-6 font-black text-slate-900 text-right">
                    {new Intl.NumberFormat("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    }).format(order.amount)}
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
