// src/app/(admin)/admin/users/page.tsx

// Veritabanı ve Auth importları
import { prisma } from '@/lib/prisma-client'; // Kendi prisma-client yolunu kullan
import { authOptions } from '@/lib/auth/options'; // authOptions dosyanızın yolu
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

// İkonlar
import { Users, Shield, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns'; // Tarihleri güzelleştirmek için
import { tr } from 'date-fns/locale'; // Tarihleri Türkçeleştirmek için

// Admin yetki kontrolü (Aynen kalıyor)
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/unauthorized');
  }
}

// Bu bir Async Server Component
export default async function AdminUsersPage() {
  // 1. Yetki Kontrolü
  await checkAdminAuth();

  // 2. Veritabanından Kullanıcıları Çekme (GÜNCELLENDİ)
  const users = await prisma.user.findMany({
    select: {
      id: true,
      // 'name: true' yerine:
      firstName: true,
      lastName: true,
      email: true,
      emailVerified: true,
      role: true,
      image: true,
      createdAt: true, // Bu alanı eklemiştik
    },
    orderBy: {
      createdAt: 'desc', // En yeni üye en üstte
    },
  });

  // 3. Veriyi Tailwind CSS ile Render Etme
  return (
    <div className="p-6">
      {/* Sayfa Başlığı */}
      <div className="flex items-center mb-6">
        <Users className="w-8 h-8 mr-3 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
      </div>

      {/* Kullanıcı Listesi Tablosu */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Tablo Başlığı (Aynı) */}
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Kullanıcı
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Rol
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Kayıt Tarihi
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Durum
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  İşlemler
                </th>
              </tr>
            </thead>
            
            {/* Tablo İçeriği (GÜNCELLENDİ) */}
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Kullanıcı Bilgisi (İsim, Email, Resim) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {/* Avatar için 'name' yerine 'firstName' ve 'lastName' kullan */}
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.image || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                          alt={`${user.firstName} ${user.lastName}` || 'Kullanıcı'}
                        />
                      </div>
                      <div className="ml-4">
                        {/* 'user.name' yerine 'firstName' ve 'lastName' göster */}
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Rol Bilgisi (Aynı) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === 'ADMIN' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <ShieldCheck className="w-4 h-4 mr-1.5" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Shield className="w-4 h-4 mr-1.5" />
                        User
                      </span>
                    )}
                  </td>

                  {/* Kayıt Tarihi (Aynı) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(user.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                  </td>

                  {/* Durum (Aynı) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.emailVerified ? (
                       <span className="text-green-600 font-medium">Onaylı</span>
                    ) : (
                       <span className="text-gray-400">Onaysız</span>
                    )}
                  </td>
                  
                  {/* İşlem Butonları (Aynı) */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Rolü Değiştir
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Tablo Alt Bilgisi (Aynı) */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Toplam <span className="font-bold text-gray-700">{users.length}</span> kullanıcı bulundu.
          </p>
        </div>
      </div>
    </div>
  );
}