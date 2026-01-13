"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileSpreadsheet, ArrowLeft, Mail, Phone, Search } from "lucide-react";
import ExcelJS from "exceljs";

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

/**
 * Raporlar Client Bileşeni
 *
 * Sipariş raporlarını tablo halinde görüntüler ve Excel'e dışa aktarma (Export) imkanı sunar.
 * - 'exceljs' kütüphanesi kullanarak tarayıcı tabanlı Excel dosyası oluşturur.
 * - Tabloda sipariş detaylarını, müşteri iletişim bilgilerini ve tutarları listeler.
 */
export default function ReportsClient({ data }: ReportsClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  // Filter orders based on search term
  const filteredOrders = data.recentOrders.filter(
    (order) =>
      order.shortId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SatisRaporu");

    worksheet.columns = [
      { header: "Sipariş No", key: "shortId", width: 15 },
      { header: "Müşteri", key: "customer", width: 25 },
      { header: "E-Posta", key: "email", width: 30 },
      { header: "Telefon", key: "phone", width: 20 },
      { header: "Durum", key: "status", width: 15 },
      { header: "Ürün Detayı", key: "details", width: 40 },
      { header: "Tarih", key: "date", width: 20 },
      { header: "Tutar", key: "amount", width: 15 },
    ];

    // Export only filtered (or visible) orders if search is active, otherwise all? 
    // Usually user expects "what I see is what I get".
    filteredOrders.forEach((order) => {
      worksheet.addRow({
        shortId: `#${order.shortId}`,
        customer: order.customer,
        email: order.email || "N/A",
        phone: formatPhone(order.phone),
        status: STATUS_LABELS[order.status] || order.status,
        details: order.details,
        date: order.date,
        amount: `${order.amount} TL`,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `Satis_Raporu_${new Date().toISOString().slice(0, 10)}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-left font-sans">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white rounded-xl border shadow-sm hover:bg-slate-50 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="relative flex-1 md:w-96">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <input 
                type="text" 
                placeholder="Sipariş no veya müşteri ismi ile ara..." 
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        <button
          onClick={downloadExcel}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg flex items-center gap-3 hover:bg-emerald-700 transition-all active:scale-95 whitespace-nowrap"
        >
          <FileSpreadsheet size={20} /> DETAYLI EXCEL İNDİR
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100">
                <th className="p-6 w-10">
                   <div className="flex items-center justify-center">
                     <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-lg border-2 border-gray-300 text-emerald-600 focus:ring-emerald-500 rounded cursor-pointer transition-all"
                        checked={filteredOrders.length > 0 && selectedIds.length === filteredOrders.length}
                        onChange={toggleSelectAll}
                     />
                   </div>
                </th>
                <th className="p-6">Sipariş No</th>
                <th className="p-6">Müşteri & İletişim</th>
                <th className="p-6">Durum</th>
                <th className="p-6">Ürünler</th>
                <th className="p-6">Tarih</th>
                <th className="p-6 text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`transition-all group ${selectedIds.includes(order.id) ? "bg-emerald-50/30 hover:bg-emerald-50/50" : "hover:bg-slate-50/50"}`}
                >
                  <td className="p-6">
                    <div className="flex items-center justify-center">
                         <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded-lg border-2 border-gray-300 text-emerald-600 focus:ring-emerald-500 rounded cursor-pointer transition-all"
                            checked={selectedIds.includes(order.id)}
                            onChange={() => toggleSelectOrder(order.id)}
                         />
                    </div>
                  </td>
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
              ))
             ) : (
                <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-400 font-medium">
                        Aradığınız kriterlere uygun sipariş bulunamadı.
                    </td>
                </tr>
             )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
