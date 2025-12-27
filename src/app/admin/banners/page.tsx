import { prisma } from "@/lib/db";
import BannerClient from "./client";

export default async function AdminBannersPage() {
  // Bannerları sıra numarasına (order) göre çekelim
  const banners = await prisma.banner.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Yönetimi</h1>
          <p className="text-gray-500 text-sm">
            Ana sayfadaki slayt alanını buradan yönet.
          </p>
        </div>
      </div>

      {/* Client Component'e veriyi atıyoruz */}
      <BannerClient initialBanners={banners} />
    </div>
  );
}
