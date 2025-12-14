import { prisma } from "@/lib/prisma-client";
import {
  CheckCircle2,
  Home,
  Package,
  ShoppingBag,
  Truck,
  Calendar,
  ArrowRight,
  Printer,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function OrderSuccessPage({ params }: PageProps) {
  // 1. Siparişi ve İçindeki Ürünleri Çek
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true, // Ürün resmini göstermek için
            },
          },
        },
      },
    },
  });

  // Sipariş bulunamazsa 404 ver
  if (!order) {
    notFound();
  }

  // Tarih Formatlama
  const date = new Date(order.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* --- BAŞARI KARTI --- */}
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-500">
          {/* Üst Kısım: Yeşil/Gradient Onay */}
          <div className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] p-10 text-center text-white relative overflow-hidden">
            {/* Arka plan süsleri */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -ml-10 -mt-10"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mb-10"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 animate-bounce-slow">
                <CheckCircle2
                  size={48}
                  className="text-[#667EEA]"
                  strokeWidth={3}
                />
              </div>
              <h1 className="text-3xl font-black mb-2 tracking-tight">
                Siparişiniz Alındı! 🚀
              </h1>
              <p className="text-indigo-100 text-lg">
                Teşekkürler, ödemeniz başarıyla gerçekleşti.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium border border-white/30">
                <Package size={16} />
                <span>
                  Sipariş No:{" "}
                  <span className="font-mono font-bold tracking-wide">
                    {order.id.slice(0, 8).toUpperCase()}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Alt Kısım: Detaylar */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* SOL: Sipariş Özeti (Ürünler) */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-gray-400" />
                  Alınan Ürünler
                </h3>

                <div className="space-y-4 pr-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {order.items.map((item) => {
                    // Ana resmi bul
                    const mainImage =
                      item.product.images.find((img) => img.isMain) ||
                      item.product.images[0];
                    const imageUrl = mainImage?.url || "/placeholder.png";

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors bg-white shadow-sm"
                      >
                        <div className="relative w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                          <Image
                            src={imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="font-bold text-gray-900 text-sm line-clamp-1">
                            {item.product.name}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                              x{item.quantity} Adet
                            </span>
                            <span className="font-bold text-sm text-[#764BA2]">
                              {Number(item.price).toLocaleString("tr-TR", {
                                minimumFractionDigits: 2,
                              })}{" "}
                              ₺
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">Ödenen Tutar</span>
                    <span className="text-2xl font-black bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
                      {Number(order.total).toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      ₺
                    </span>
                  </div>
                </div>
              </div>

              {/* SAĞ: Bilgi ve Adres */}
              <div className="space-y-8">
                {/* Teslimat Bilgisi */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <Truck size={16} /> Teslimat Bilgileri
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1">
                        ALICI
                      </p>
                      <p className="font-medium text-gray-800">
                        {order.customerName}
                      </p>
                    </div>

                    {/* Eğer veritabanında adres kolonu varsa göster (Şimdilik statik bir placeholder gibi duruyor) */}
                    {/* NOT: Veritabanında 'address' kolonu eklediysen order.address kullan */}
                    {/* <div>
                        <p className="text-xs text-gray-400 font-bold mb-1">ADRES</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {order.address || "Adres bilgisi alınamadı."}
                        </p>
                      </div> */}

                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1">
                        SİPARİŞ TARİHİ
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        {date}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aksiyon Butonları */}
                <div className="flex flex-col gap-3">
                  <Link
                    href="/account/orders"
                    className="w-full bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-4 rounded-xl font-bold text-center hover:shadow-lg hover:shadow-[#667EEA]/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                  >
                    <ShoppingBag size={18} />
                    Siparişlerime Git
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>

                  <Link
                    href="/"
                    className="w-full bg-white text-gray-700 border border-gray-200 py-4 rounded-xl font-bold text-center hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Home size={18} />
                    Alışverişe Devam Et
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Alt Footer Şerit */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
            <span>Sipariş ID: {order.id}</span>
            <button className="flex items-center gap-1 hover:text-gray-600 transition-colors">
              <Printer size={14} /> Yazdır
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
