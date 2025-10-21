import React from "react";

export default function MembershipAgreement() {
  const sections = [
    {
      title: "Üyelik Koşulları",
      items: [
        "Üye, gerçek kişi olduğunu ve verdiği bilgilerin doğru olduğunu kabul eder",
        "18 yaşından küçükler veli veya vasi onayı ile üye olabilir",
        "Hesap güvenliği ve şifre gizliliği tamamen üyeye aittir",
        "Bir kişi yalnızca bir üyelik hesabı açabilir",
        "Yanlış veya eksik bilgi verilmesi durumunda üyelik iptal edilebilir",
      ],
    },
    {
      title: "Üyelik Sorumlulukları",
      items: [
        "Hesap bilgilerini üçüncü kişilerle paylaşmamak",
        "Hukuka ve ahlaka aykırı içerik paylaşmamak",
        "Sistemi teknik açıklardan yararlanarak kullanmamak",
        "Diğer kullanıcıları rahatsız edici davranışlarda bulunmamak",
        "Telif hakkı bulunan içerikleri izinsiz paylaşmamak",
        "Ticari amaçla spam veya reklam içerikli mesajlar göndermemek",
      ],
    },
    {
      title: "Hesap Güvenliği ve Yönetimi",
      items: [
        "Şifrenizi düzenli olarak güncellemeniz önerilir",
        "Hesabınızı başka cihazlarda kullandıktan sonra çıkış yapın",
        "Şüpheli hesap aktivitelerini derhal bildirin",
        "Hesap bilgilerinizin güncel olduğundan emin olun",
        "Üçüncü parti uygulamalara hesap erişimi vermeyin",
      ],
    },
    {
      title: "Hizmet Kullanım Kuralları",
      items: [
        "Platformu yasa dışı faaliyetler için kullanmak yasaktır",
        "Sahte veya yanıltıcı ürün/listeleme oluşturulamaz",
        "Diğer kullanıcıların kişisel bilgileri izinsiz kullanılamaz",
        "Sistem performansını etkileyecek otomatik işlemler yapılamaz",
        "Rekabete aykırı davranışlar ve fiyat manipülasyonu yasaktır",
      ],
    },
    {
      title: "Sözleşmenin Feshi ve Hesap Kapatma",
      items: [
        "Üye hesabını dilediği zaman kapatabilir",
        "KervanPazar, şartlara uymayan hesapları uyarı vermeden kapatabilir",
        "Hesap kapatıldığında kişisel veriler yasal süreler boyunca saklanır",
        "Aktif işlemleri bulunan hesaplar kapatılamaz",
        "Hesap kapatma işlemi geri alınamaz",
      ],
    },
    {
      title: "Değişiklik ve Güncellemeler",
      items: [
        "KervanPazar sözleşme şartlarını dilediği zaman değiştirebilir",
        "Değişiklikler 30 gün önceden duyurulur",
        "Değişiklikleri kabul etmeyen üyeler hesabını kapatabilir",
        "Değişikliklerden sonra platformu kullanmak kabul anlamına gelir",
        "Önemli değişiklikler e-posta ile bildirilir",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Üyelik Sözleşmesi
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            İşbu sözleşme, KervanPazar platformunu kullanan üyeler ile
            KervanPazar arasında geçerli olan tüm hak ve yükümlülükleri
            belirler. Platformu kullanarak bu sözleşmeyi kabul etmiş
            sayılırsınız.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <span className="text-yellow-600 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">
                Önemli Uyarı
              </h3>
              <p className="text-yellow-700 text-sm leading-relaxed">
                Lütfen bu sözleşmeyi dikkatlice okuyunuz. Üyelik işlemi
                tamamlandığında bu sözleşmenin tüm maddelerini kabul etmiş
                sayılırsınız. Anlaşılmayan maddeler için iletişime
                geçebilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <section
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Legal Section */}
        <section className="bg-gray-50 rounded-lg border border-gray-200 p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Yasal Hükümler
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Uygulanacak Hukuk
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Bu sözleşme Türkiye Cumhuriyeti yasalarına tabidir. Sözleşmeden
                doğabilecek ihtilafların çözümünde İstanbul Mahkemeleri ve İcra
                Daireleri yetkilidir.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">İletişim</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Sözleşme ile ilgili sorularınız için:
                <a
                  href="mailto:info@kervanpazar.com"
                  className="text-green-600 hover:text-green-700 font-medium ml-1"
                >
                  info@kervanpazar.com
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Agreement Acceptance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Sözleşme Kabulü
              </h3>
              <p className="text-gray-600 text-sm">
                Platformu kullanmaya devam ederek bu sözleşmeyi kabul etmiş
                sayılırsınız.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Son güncelleme</p>
              <p className="font-semibold text-gray-700">
                {new Date().toLocaleDateString("tr-TR")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
