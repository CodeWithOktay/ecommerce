export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-white to-gray-50 border-t border-gray-100 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-2xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent mb-4">
              TrendSepet
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Tek Sepet, Binlerce Trend. Uygun fiyatlı ve güvenli alışverişin
              adresi.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-gradient-to-r from-[#667EEA] to-[#764BA2] rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all"
              >
                📘
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gradient-to-r from-[#F093FB] to-[#F5576C] rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all"
              >
                📷
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all"
              >
                🐦
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">
              Hızlı Erişim
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#667EEA] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#667EEA] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Hakkımızda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#667EEA] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#667EEA] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  İletişim
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#667EEA] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#667EEA] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Kariyer
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Destek</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#667EEA] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#667EEA] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Sık Sorulan Sorular
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#667EEA] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#667EEA] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Kargo & İade
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#667EEA] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#667EEA] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Gizlilik Politikası
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Bülten</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Kampanyalardan haberdar olmak için e-posta adresinizi girin.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667EEA] focus:border-transparent text-sm"
              />
              <button className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium">
                Gönder
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-200 pt-8 mb-6">
          <h4 className="text-gray-800 font-medium mb-4 text-center">
            Güvenli Ödeme Yöntemleri
          </h4>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-lg">
              💳
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-lg">
              🏦
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-lg">
              📱
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-lg">
              🔒
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-lg">
              💰
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-center text-gray-500 py-6 text-sm border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              © {new Date().getFullYear()} TrendSepet. Tüm hakları saklıdır.
            </div>
            <div className="flex gap-6 text-xs">
              <a href="#" className="hover:text-[#667EEA] transition-colors">
                Çerez Politikası
              </a>
              <a href="#" className="hover:text-[#667EEA] transition-colors">
                KVKK
              </a>
              <a href="#" className="hover:text-[#667EEA] transition-colors">
                Üyelik Sözleşmesi
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
