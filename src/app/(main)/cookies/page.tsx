import React from "react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Çerez Politikası
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            KervanPazar web sitesinde kullanılan çerezler ve gizlilik ayarlarınız hakkında bilgi edinin.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <p className="text-gray-700 leading-relaxed">
                KervanPazar, web sitesinde kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. 
                Çerezler, tarayıcınıza kaydedilen küçük veri dosyalarıdır.
              </p>
            </section>

            {/* Cookie Types */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Kullanılan Çerez Türleri
              </h2>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-900 mb-1">Zorunlu Çerezler</h3>
                  <p className="text-blue-800 text-sm">Sitenin temel işlevlerinin çalışması için gereklidir.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="font-semibold text-green-900 mb-1">Analitik Çerezler</h3>
                  <p className="text-green-800 text-sm">Site kullanım istatistiklerini ve performansını takip eder.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <h3 className="font-semibold text-purple-900 mb-1">Pazarlama Çerezleri</h3>
                  <p className="text-purple-800 text-sm">Kullanıcı ilgi alanlarına göre içerik gösterir.</p>
                </div>
              </div>
            </section>

            {/* Cookie Settings */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Çerez Ayarlarını Yönetme
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Tarayıcı ayarlarınızdan çerezleri yönetebilir, reddedebilir veya silebilirsiniz. 
                Ancak bazı çerezleri devre dışı bırakmak site deneyimini etkileyebilir.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Tarayıcı Ayarları:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                  <li>Firefox: Seçenekler → Gizlilik ve Güvenlik → Çerezler</li>
                  <li>Safari: Tercihler → Gizlilik → Çerezler ve site verileri</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                İletişim
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Çerez politikasıyla ilgili sorularınız için{" "}
                <a
                  href="mailto:info@kervanpazar.com"
                  className="text-blue-600 hover:text-blue-700 underline font-medium"
                >
                  info@kervanpazar.com
                </a>{" "}
                adresinden bizimle iletişime geçebilirsiniz.
              </p>
            </section>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Son güncelleme: {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}