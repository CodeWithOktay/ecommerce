import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, User, ShieldCheck, Mail, Calendar, Package } from "lucide-react";
import CustomerEditForm from "@/components/features/admin/customers/customer-edit-form";

interface PageProps {
  params: Promise<{ customerId: string }>;
}

/**
 * Müşteri Düzenleme Sayfası
 * 
 * Belirli bir müşterinin admin tarafından düzenlenmesini sağlar.
 * - Kullanıcının profil bilgilerini ve kayıtlı adreslerini getirir.
 * - `CustomerEditForm` bileşenini kullanarak güncelleme imkanı sunar.
 * - Sol panelde özet profil (Avatar, İletişim, Adresler) gösterir.
 */
export default async function CustomerEditPage({ params }: PageProps) {
  const { customerId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: customerId },
    include: {
      addresses: true,
      // orders: {
      //   orderBy: { createdAt: 'desc' },
      //   take: 5
      // }
      // Assuming we might want to show recent orders in future, placeholder for now
    },
  });

  if (!user) {
    notFound();
  }

  // Format date safely
  const joinedDate = new Date(user.createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <Link
          href="/admin/customers"
          className="group p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <ArrowLeft size={20} className="text-gray-500 group-hover:text-gray-700" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Müşteri Detayı
            <span className={`text-xs px-2.5 py-1 rounded-full border ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                {user.role === 'ADMIN' ? 'Yönetici' : 'Müşteri'}
            </span>
          </h1>
          <p className="text-gray-500 mt-1">
            Kullanıcı bilgilerini görüntüleyin ve düzenleyin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Profile Summary */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
             <div className="px-6 pb-6 relative">
                 <div className="relative -mt-12 mb-4 w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto">
                    <Image
                        src={
                        user.image ||
                        `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
                        }
                        fill
                        alt="Avatar"
                        className="rounded-full object-cover"
                    />
                 </div>
                 
                 <div className="text-center space-y-1 mb-6">
                     <h2 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                     <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5">
                        <Mail size={12} /> {user.email}
                     </p>
                 </div>

                 <div className="space-y-3 pt-6 border-t border-gray-50">
                     <div className="flex items-center justify-between text-sm">
                         <span className="text-gray-500 flex items-center gap-2">
                             <Calendar size={14} /> Üyelik Tarihi
                         </span>
                         <span className="font-medium text-gray-900">{joinedDate}</span>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                         <span className="text-gray-500 flex items-center gap-2">
                             <Package size={14} /> Toplam Sipariş
                         </span>
                         <span className="font-medium text-gray-900">-</span>
                     </div>
                 </div>
             </div>
          </div>

          {/* Addresses Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <MapPin size={16} className="text-indigo-500" /> Kayıtlı Adresler
            </h3>

            {user.addresses.length > 0 ? (
              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-3 bg-gray-50 rounded-xl text-sm border border-gray-100 hover:border-gray-200 transition-colors group"
                  >
                    <div className="font-semibold text-gray-900 mb-1 flex justify-between">
                      {addr.title}
                    </div>
                    <p className="text-gray-600 leading-relaxed text-xs">
                      {addr.addressLine} <br />
                      <span className="font-medium text-gray-700">{addr.district} / {addr.city}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                  <MapPin size={24} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400">Henüz kayıtlı adres yok.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Edit Form */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
             <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                 <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <User size={20} />
                 </div>
                 <div>
                     <h3 className="text-lg font-bold text-gray-900">Hesap Bilgilerini Düzenle</h3>
                     <p className="text-sm text-gray-500">Müşterinin kişisel bilgilerini buradan güncelleyebilirsiniz.</p>
                 </div>
             </div>
             
             {/* The form component handles its own layout, but we wrap it nicely */}
             <CustomerEditForm user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
