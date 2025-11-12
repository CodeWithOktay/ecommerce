import { Facebook, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Footer Bileşeni
 * 
 * E-ticaret sitesinin alt kısmında yer alan footer bölümü.
 * Marka bilgisi, hızlı linkler, destek ve bülten aboneliği içerir.
 * Responsive tasarım ile mobil ve desktop uyumludur.
 */
export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-white to-gray-200 border-t border-gray-300 mt-16">
      {/* Ana container */}
      <div className="container max-w-screen-xl mx-auto px-4 py-12">
        
        {/* Ana Footer İçeriği - 4 sütun grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-center md:text-left">
          
          {/* 1. Sütun: Marka Bilgisi ve Sosyal Medya */}
          <div className="flex flex-col items-center md:items-start">
            {/* Logo */}
            <div className="mb-4">
              <Image
                src="/kervanpazar-logo.png"
                alt="KervanPazar Logo"
                width={250}
                height={80}
                className="object-contain group-hover:scale-110 transition-transform duration-300 hover:drop-shadow-xl"
                priority // Öncelikli yükleme için
              />
            </div>

            {/* Açıklama metni */}
            <p className="text-gray-700 leading-relaxed mb-4 max-w-[250px]">
              İpek Yolu&apos;nun dijital hali. Uygun fiyatlı ve güvenli
              alışverişin adresi.
            </p>

            {/* Sosyal Medya İkonları */}
            <div className="flex gap-3">
              {/* Facebook */}
              <Link
                href="#"
                className="w-10 h-10 bg-gradient-to-br from-[#1877F2] to-[#3B5998] rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-transform duration-300"
                aria-label="Facebook'ta bizi takip edin"
              >
                <Facebook size={18} />
              </Link>

              {/* Instagram */}
              <Link
                href="#"
                className="w-10 h-10 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-transform duration-300"
                aria-label="Instagram'da bizi takip edin"
              >
                <Instagram size={18} />
              </Link>

              {/* X (Twitter) */}
              <Link
                href="#"
                className="w-10 h-10 bg-gradient-to-br from-black to-gray-900 rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-transform duration-300"
                aria-label="X'te bizi takip edin"
              >
                <Twitter size={18} />
              </Link>
            </div>
          </div>

          {/* 2. Sütun: Kurumsal Linkler */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="font-semibold mb-4 text-lg text-gray-900">
              Kurumsal
            </h1>
            {/* Kurumsal sayfa linkleri */}
            <Link
              href="/about"
              className="hover:text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transition-all duration-300"
            >
              Hakkımızda
            </Link>
            <Link
              href="/contact"
              className="hover:text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transition-all duration-300"
            >
              İletişim
            </Link>
            <Link
              href="/terms"
              className="hover:text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transition-all duration-300"
            >
              Güvenli Alışveriş Kılavuzu
            </Link>
          </div>

          {/* 3. Sütun: Müşteri Desteği Linkleri */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="font-semibold mb-4 text-lg text-gray-900">Destek</h1>
            {/* Destek sayfa linkleri */}
            <Link
              href="/faq"
              className="hover:text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transition-all duration-300"
            >
              Sıkça Sorulan Sorular
            </Link>
            <Link
              href="/shipping-returns"
              className="hover:text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transition-all duration-300"
            >
              Kargo & İade
            </Link>
            <Link
              href="/privacy"
              className="hover:text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transition-all duration-300"
            >
              Gizlilik Politikası
            </Link>
          </div>

          {/* 4. Sütun: E-bülten Aboneliği */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 text-center md:text-left">
              Bülten
            </h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed text-center md:text-left">
              Kampanyalardan haberdar olmak için e-posta adresinizi girin.
            </p>
            {/* E-bülten formu */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent text-sm placeholder-gray-400 bg-white shadow-sm"
                aria-label="E-posta adresinizi girin"
              />
              <button 
                className="bg-[#7C3AED] text-white px-6 py-3 rounded-lg hover:bg-[#6D28D9] hover:shadow-lg active:scale-95 transition-all duration-300 font-semibold text-sm whitespace-nowrap"
                aria-label="Bültene abone ol"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>

        {/* Alt Kısım: Telif Hakkı ve Yasal Linkler */}
        <div className="border-t border-gray-200 pt-6 text-gray-500 text-sm">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 flex-wrap">
            {/* Telif hakkı metni */}
            <div>
              © {new Date().getFullYear()} KervanPazar. Tüm hakları saklıdır.
            </div>
            
            {/* Yasal linkler */}
            <div className="flex gap-6">
              <Link
                href="/privacy-policy"
                className="hover:text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transition-all duration-300"
              >
                KVKK
              </Link>
              <Link
                href="/user-agreement"
                className="hover:text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transition-all duration-300"
              >
                Üyelik Sözleşmesi
              </Link>
              <Link
                href="/cookies"
                className="hover:text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transition-all duration-300"
              >
                Çerez Politikası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}