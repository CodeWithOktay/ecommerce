import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
// Az önce oluşturduğumuz formu import ediyoruz
import CustomerEditForm from "@/components/features/admin/customers/customer-edit-form";

interface PageProps {
  params: Promise<{ customerId: string }>;
}

export default async function CustomerEditPage({ params }: PageProps) {
  // 1. ID'yi al
  const { customerId } = await params;

  // 2. Kullanıcıyı ve Adreslerini Çek
  const user = await prisma.user.findUnique({
    where: { id: customerId },
    include: {
      addresses: true,
    },
  });

  if (!user) {
    notFound();
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
        {/* --- SOL KOLON: Profil Özeti (Read Only) --- */}
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
              {user.role === "ADMIN" ? "Yönetici" : "Müşteri Hesabı"}
            </span>
          </div>

          {/* Adres Listesi */}
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

        {/* --- SAĞ KOLON: Düzenleme Formu (Interactive) --- */}
        <div className="lg:col-span-2">
          {/* Formu buraya yerleştiriyoruz */}
          <CustomerEditForm user={user} />
        </div>
      </div>
    </div>
  );
}
