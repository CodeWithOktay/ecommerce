/**
 * KVKK (Kişisel Verilerin Korunması Kanunu) Aydınlatma Metni Sayfası
 *
 * 6698 sayılı KVKK kapsamında kullanıcıları kişisel veri işleme süreçleri
 * hakkında bilgilendiren yasal zorunluluk sayfası.
 */
export default function KVKK() {
  /**
   * KVKK bölümleri ve maddeleri
   * Her bölüm başlık ve detaylı madde listesi içerir
   */
  const sections = [
    {
      title: 'Toplanan Kişisel Veriler',
      items: [
        'Ad, soyad, e-posta ve iletişim bilgileri',
        'Kullanıcı hesap bilgileri ve tercihleri',
        'Sitemizdeki etkileşim ve alışveriş geçmişi',
        'Teknik veriler (IP adresi, tarayıcı bilgileri)',
      ],
    },
    {
      title: 'Verilerin Kullanım Amaçları',
      items: [
        'Hizmetlerin sunulması ve iyileştirilmesi',
        'Kampanya, duyuru ve bilgilendirme gönderimi',
        'Müşteri memnuniyeti ve destek hizmetleri',
        'Yasal yükümlülüklerin yerine getirilmesi',
        'Kişiselleştirilmiş alışveriş deneyimi sunulması',
      ],
    },
    {
      title: 'Veri Paylaşımı ve Saklama',
      items: [
        'Yalnızca yasal zorunluluklar ve hizmet sağlama kapsamında paylaşılır',
        'Ödeme işlemleri için güvenli ödeme kuruluşlarıyla paylaşılır',
        'Kargo ve teslimat hizmetleri için gerekli bilgiler paylaşılır',
        'Veriler yasal saklama süreleri boyunca muhafaza edilir',
      ],
    },
    {
      title: 'Kullanıcı Hakları',
      items: [
        'Kişisel verilerinize erişim ve bilgi edinme hakkı',
        'Verilerinizin düzeltilmesini veya güncellenmesini talep etme hakkı',
        'Verilerinizin silinmesini talep etme hakkı',
        'İşleme faaliyetine itiraz etme hakkı',
        'Verilerinizin aktarılmasını talep etme hakkı',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ✅ Başlık Bölümü */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            KVKK Aydınlatma Metni
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            KervanPazar olarak, kişisel verilerinizin güvenliği ve gizliliği
            bizim için önceliklidir. Bu metin, 6698 sayılı Kişisel Verilerin
            Korunması Kanunu kapsamında haklarınızı ve veri işleme süreçlerimizi
            açıklamaktadır.
          </p>
        </div>

        {/* ✅ İçerik Bölümleri */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <section
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              {/* Bölüm Başlığı */}
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              {/* Madde Listesi */}
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* ✅ Veri Güvenliği Bölümü */}
        <section className="bg-blue-50 rounded-lg border border-blue-200 p-6 mt-8">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Veri Güvenliği
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">
                Teknik Önlemler
              </h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• SSL sertifikası ile şifreli veri iletişimi</li>
                <li>• Güncel güvenlik duvarları ve koruma sistemleri</li>
                <li>• Düzenli güvenlik denetimleri ve testleri</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">
                İdari Önlemler
              </h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Personel gizlilik eğitimleri</li>
                <li>• Veri işleme politikaları ve prosedürler</li>
                <li>• Erişim yetki ve kısıtlamaları</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ✅ İletişim ve Hak Kullanımı Bölümü */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Haklarınızı Kullanma
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 mb-4">
              KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki iletişim
              kanallarından bize ulaşabilirsiniz:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* E-posta İletişim Butonu */}
              <a
                href="mailto:info@kervanpazar.com"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                📧 info@kervanpazar.com
              </a>
              <span className="text-gray-500 text-sm">
                Talepleriniz en geç 30 gün içinde yanıtlanacaktır.
              </span>
            </div>
          </div>
        </section>

        {/* ✅ Alt Bilgi (Footer) */}
        <div className="text-center mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Son güncelleme: {new Date().getFullYear()} |
          </p>
        </div>
      </div>
    </div>
  );
}
