import { prisma } from "@/lib/prisma-client";
import { updateUser } from "@/lib/actions/user-actions";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Phone, MapPin, User, Save } from "lucide-react";

export default async function CustomerEditPage({
  params,
}: {
  params: { customerId: string };
}) {
  // 1. Kullanıcıyı ve Adreslerini Çekiyoruz
  const user = await prisma.user.findUnique({
    where: { id: params.customerId },
    include: {
      addresses: true, // Adresleri de getir
    },
  });

  if (!user || user.role !== "USER") {
    return (
      <div className="p-8 text-center text-gray-500">
        Müşteri bulunamadı veya yetkisiz erişim.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      {/* Üst Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/customers"
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Müşteri Detayı</h1>
          <p className="text-sm text-gray-500">
            Kullanıcı bilgilerini ve adreslerini yönet.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- SOL KOLON: Profil Özeti --- */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-4">
              <Image
                src={
                  user.image ||
                  `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
                }
                fill
                alt="Avatar"
                className="rounded-full object-cover border-4 border-gray-50"
              />
            </div>
            <h2 className="font-bold text-xl text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500 mb-4">{user.email}</p>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
              Müşteri Hesabı
            </span>
          </div>

          {/* Adres Listesi (Read-Only) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-gray-400" /> Kayıtlı Adresler
            </h3>

            {user.addresses.length > 0 ? (
              <div className="space-y-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-3 bg-gray-50 rounded-lg text-sm border border-gray-100"
                  >
                    <div className="font-semibold text-gray-900 mb-1">
                      {addr.title}
                    </div>
                    <p className="text-gray-600 leading-snug">
                      {addr.addressLine} <br />
                      {addr.district} / {addr.city}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                Henüz kayıtlı adres yok.
              </p>
            )}
          </div>
        </div>

        {/* --- SAĞ KOLON: Düzenleme Formu --- */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-6 pb-4 border-b border-gray-100">
              Hesap Bilgileri
            </h3>

            <form action={updateUser} className="space-y-6">
              <input type="hidden" name="id" value={user.id} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Ad
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      name="firstName"
                      defaultValue={user.firstName || ""}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Soyad
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      name="lastName"
                      defaultValue={user.lastName || ""}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    name="email"
                    defaultValue={user.email || ""}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* 🟢 YENİ: Telefon Numarası */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Telefon
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    name="phoneNumber"
                    type="tel"
                    defaultValue={user.phoneNumber || ""}
                    placeholder="05..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200"
                >
                  <Save size={18} />
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
