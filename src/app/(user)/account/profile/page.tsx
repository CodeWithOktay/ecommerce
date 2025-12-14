import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/prisma-client";
import { redirect } from "next/navigation";
import Image from "next/image";
import ProfileForm from "@/app/(user)/account/profile/ProfileForm";
import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  User as UserIcon,
  Star,
} from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  // Kullanıcıyı, Adreslerini ve Sipariş Sayısını Çek
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: {
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
      _count: {
        select: { orders: true },
      },
    },
  });

  if (!user) return <div>Kullanıcı bulunamadı.</div>;

  const currentAddress = user.addresses[0];

  const joinDate = new Date(user.createdAt).toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* --- 1. HEADER KARTI --- */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white shadow-xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profil Resmi */}
            <div className="relative group">
              <div className="relative w-32 h-32 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden bg-white/10 backdrop-blur-sm">
                <Image
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`
                  }
                  alt="Profil"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Bilgiler */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  {user.role === "ADMIN" ? (
                    <ShieldCheck size={14} />
                  ) : (
                    <UserIcon size={14} />
                  )}
                  {user.role === "ADMIN" ? "Yönetici" : "Müşteri"}
                </span>
              </div>

              <p className="text-indigo-100 font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> {user.email}
              </p>

              <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <ShoppingBag size={18} className="text-indigo-200" />
                  <span className="font-bold">
                    {user._count.orders} Sipariş
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <Calendar size={18} className="text-indigo-200" />
                  <span className="font-bold">{joinDate} Üyeliği</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. ALT BÖLÜM --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SOL: Özet Bilgi */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                İletişim Bilgileri
              </h3>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      E-Posta
                    </p>
                    <p className="font-medium text-gray-900 truncate max-w-[200px]">
                      {user.email}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      Telefon
                    </p>
                    <p className="font-medium text-gray-900">
                      {user.phoneNumber || "Belirtilmemiş"}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      Konum
                    </p>
                    <p className="font-medium text-gray-900">
                      {currentAddress
                        ? `${currentAddress.city} / ${currentAddress.district}`
                        : "Adres Girilmemiş"}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* SAĞ: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  Profil Bilgilerini Düzenle
                </h2>
              </div>
              <div className="p-6 md:p-8">
                <ProfileForm user={user} address={currentAddress} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
