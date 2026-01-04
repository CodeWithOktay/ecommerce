import { prisma } from "@/lib/db";
import { Facebook, Instagram, Twitter, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * Yardımcı Fonksiyon: Sosyal Medya Linki
 */
function getSocialUrl(baseUrl: string, input: string | null) {
  if (!input) return "";
  if (input.startsWith("http://") || input.startsWith("https://")) {
    return input;
  }
  const cleanHandle = input.startsWith("@") ? input.substring(1) : input;
  return `${baseUrl}${cleanHandle}`;
}

/**
 * Web Sitesi Alt Bilgisi (Footer)
 * 
 * Veritabanından dinamik site ayarlarını (Logo, Sosyal Medya vb.) çeker.
 * 
 * Server Component olduğu için veritabanına doğrudan erişir.
 */
export default async function Footer() {
  const settings = await prisma.settings.findUnique({
    where: { id: "general_settings" },
  });

  const data = settings || {
    siteTitle: "KervanPazar",
    description: "İpek Yolu'nun dijital hali.",
    facebook: "",
    instagram: "",
    twitter: "",
  };

  return (
    <footer className="bg-gradient-to-br from-white to-gray-200 border-t border-gray-300 mt-16">
      <div className="container max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-center md:text-left">
          {/* 1. Sütun - Logo & Sosyal Medya */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-4">
              <Link href="/">
                <Image
                  src="/kervanpazar-logo.png"
                  alt={data.siteTitle}
                  width={180}
                  height={60}
                  className="object-contain hover:opacity-80 transition-opacity"
                  priority
                />
              </Link>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4 max-w-[250px] text-sm">
              {data.description}
            </p>

            <div className="flex gap-3">
              {data.facebook && (
                <Link
                  href={getSocialUrl("https://facebook.com/", data.facebook)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                >
                  <Facebook size={18} />
                </Link>
              )}
              {data.instagram && (
                <Link
                  href={getSocialUrl("https://instagram.com/", data.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                >
                  <Instagram size={18} />
                </Link>
              )}
              {data.twitter && (
                <Link
                  href={getSocialUrl("https://twitter.com/", data.twitter)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                >
                  <Twitter size={18} />
                </Link>
              )}
            </div>
          </div>

          {/* 2. Sütun */}
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h3 className="font-bold text-gray-900">Kurumsal</h3>
            <FooterLink href="/about">Hakkımızda</FooterLink>
            <FooterLink href="/contact">İletişim</FooterLink>
            <FooterLink href="/terms">Güvenli Alışveriş</FooterLink>
          </div>

          {/* 3. Sütun */}
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h3 className="font-bold text-gray-900">Destek</h3>
            <FooterLink href="/faq">Sıkça Sorulan Sorular</FooterLink>
            <FooterLink href="/shipping-returns">Kargo & İade</FooterLink>
            <FooterLink href="/privacy">Gizlilik Politikası</FooterLink>
          </div>

          {/* 4. Sütun - GÜVENLİ ÖDEME (GÜNCELLENDİ) */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-center md:text-left">
              Güvenli Ödeme
            </h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed text-center md:text-left">
              Tüm ödemeleriniz 256-bit SSL ile şifrelenir.
            </p>

            {/* Ödeme Logoları - Next/Image ile Cam Gibi Net */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
              {/* VISA */}
              <div className="bg-white border border-gray-200 rounded-md p-1 w-14 h-9 flex items-center justify-center shadow-sm transition-transform hover:scale-105">
                <Image
                  src="/images/payment/visa.svg"
                  alt="Visa"
                  width={50}
                  height={30}
                  className="h-full w-auto object-contain"
                />
              </div>

              {/* MASTERCARD */}
              <div className="bg-white border border-gray-200 rounded-md p-1 w-14 h-9 flex items-center justify-center shadow-sm transition-transform hover:scale-105">
                <Image
                  src="/images/payment/mastercard.svg"
                  alt="Mastercard"
                  width={50}
                  height={30}
                  className="h-full w-auto object-contain"
                />
              </div>

              {/* TROY */}
              <div className="bg-white border border-gray-200 rounded-md p-1 w-14 h-9 flex items-center justify-center shadow-sm transition-transform hover:scale-105">
                <Image
                  src="/images/payment/troy.svg"
                  alt="Troy"
                  width={50}
                  height={30}
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>

            {/* Güvenlik Rozeti */}
            <div className="flex items-center justify-center md:justify-start gap-2 bg-green-200 border border-green-200 rounded-lg p-2 max-w-[200px] mx-auto md:mx-0">
              <div className="bg-green-300 p-1.5 rounded-full flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-semibold leading-tight">
                  GÜVENLİ ÖDEME
                </span>
                <span className="text-xs text-gray-900 font-bold leading-tight">
                  256 Bit SSL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Kısım */}
        <div className="border-t border-gray-200 pt-6 text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            © {new Date().getFullYear()} {data.siteTitle}. Tüm hakları
            saklıdır.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-indigo-600">
              KVKK
            </Link>
            <Link href="/user-agreement" className="hover:text-indigo-600">
              Üyelik Sözleşmesi
            </Link>
            <Link href="/cookies" className="hover:text-indigo-600">
              Çerezler
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-gray-600 hover:text-indigo-600 transition-colors text-sm"
    >
      {children}
    </Link>
  );
}
