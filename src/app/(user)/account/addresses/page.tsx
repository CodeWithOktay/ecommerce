import { prisma } from "@/lib/prisma-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import AddAddressForm from "@/components/account/AddAddressForm";
import DeleteAddressBtn from "@/components/account/DeleteAddressBtn";
import SetDefaultBtn from "@/components/account/SetDefaultBtn"; // 👈 Yeni buton
import { MapPin, Phone, User } from "lucide-react";

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/login");

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [
      { isDefault: "desc" }, // 🟢 Önce varsayılanlar (true) gelsin
      { createdAt: "desc" }, // Sonra en yeniler
    ],
  });

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Adreslerim</h1>
      <p className="text-gray-500 mb-8">
        Siparişlerinizde kullanmak üzere teslimat adreslerinizi buradan
        yönetebilirsiniz.
      </p>

      {/* Üst Kısım: Yeni Ekleme Formu */}
      <div className="mb-8">
        <AddAddressForm />
      </div>

      {/* Alt Kısım: Adres Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`group relative bg-white border rounded-2xl p-6 transition-all duration-300
              ${
                addr.isDefault
                  ? "border-green-200 shadow-md shadow-green-50 ring-1 ring-green-100"
                  : "border-gray-200 hover:shadow-lg hover:border-[#667EEA]/50"
              }
            `}
          >
            {/* Başlık ve Butonlar */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-lg ${addr.isDefault ? "bg-green-100 text-green-600" : "bg-indigo-50 text-[#667EEA]"}`}
                >
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-none">
                    {addr.title}
                  </h3>
                  {/* 🟢 VARSAYILAN BUTONU BURADA */}
                  <div className="mt-1">
                    <SetDefaultBtn id={addr.id} isDefault={addr.isDefault} />
                  </div>
                </div>
              </div>

              {/* Sadece varsayılan olmayanlar silinebilsin (Opsiyonel güvenlik) */}
              {!addr.isDefault && <DeleteAddressBtn id={addr.id} />}
            </div>

            {/* Detaylar */}
            <div className="space-y-3 text-sm text-gray-600 mt-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <span className="font-medium text-gray-900">
                  {addr.firstName} {addr.lastName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <span>{addr.phone}</span>
              </div>

              <div className="pt-2 border-t border-gray-50 mt-2">
                <p className="leading-relaxed">{addr.addressLine}</p>
                <p className="font-semibold text-gray-900 mt-1">
                  {addr.district} / {addr.city}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Adres Yoksa */}
        {addresses.length === 0 && (
          <div className="hidden md:flex items-center justify-center p-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-2xl">
            Henüz kayıtlı adresiniz yok. Yukarıdan ekleyebilirsiniz.
          </div>
        )}
      </div>
    </div>
  );
}
