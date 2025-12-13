import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/prisma-client";
import { redirect } from "next/navigation";
import Image from "next/image";
import ProfileForm from "@/app/(user)/account/profile/ProfileForm"; // Formu import et

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return <div>Kullanıcı bulunamadı.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      
      {/* Header Alanı */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 pb-10 border-b">
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <Image 
            src={user.image || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff`} 
            alt="Profil"
            fill
            className="rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
          <p className="text-gray-500 mt-1">{user.email}</p>
          <span className="inline-block mt-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Kayıtlı Müşteri
          </span>
        </div>
      </div>

      {/* Form Alanı */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}