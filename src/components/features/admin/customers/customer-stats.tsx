import { Users, UserPlus, UserCheck } from "lucide-react";

interface StatsProps {
  total: number;
  newThisMonth: number;
  active: number;
}

/**
 * Müşteri İstatistik Kartları
 * 
 * Yönetim panelinde müşteri özet verilerini gösterir:
 * - Toplam müşteri sayısı
 * - Bu ay eklenen yeni müşteriler
 * - Aktif kullanıcı sayısı
 */
export default function CustomerStats({ total, newThisMonth, active }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Customers */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
          <Users size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Toplam Müşteri</p>
          <h3 className="text-2xl font-black text-gray-900">{total}</h3>
        </div>
      </div>

      {/* New This Month */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
          <UserPlus size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Bu Ay Yeni Üye</p>
          <h3 className="text-2xl font-black text-gray-900">{newThisMonth}</h3>
        </div>
      </div>

      {/* Active Users (Mock/Real) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
          <UserCheck size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Aktif Kullanıcılar</p>
          <h3 className="text-2xl font-black text-gray-900">{active}</h3>
        </div>
      </div>
    </div>
  );
}
