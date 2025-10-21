export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white text-gray-800 rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Gizlilik Politikası
        </h1>

        <p className="mb-6">
          KervanPazar olarak, kullanıcılarımızın gizliliği ve kişisel
          verilerinin güvenliği bizim için önceliklidir. Bu gizlilik politikası,
          hangi verileri topladığımızı, nasıl kullandığımızı ve kullanıcı
          haklarını açıklamaktadır.
        </p>

        <h2 className="text-xl font-semibold mb-2">1. Toplanan Veriler</h2>
        <ul className="list-disc list-inside mb-6">
          <li>Kullanıcı kayıt bilgileri (ad, soyad, e-posta, telefon)</li>
          <li>Hesap ve işlem bilgileri</li>
          <li>Site içi etkileşimler ve alışveriş geçmişi</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">
          2. Verilerin Kullanım Amaçları
        </h2>
        <ul className="list-disc list-inside mb-6">
          <li>Hizmetlerin sağlanması ve iyileştirilmesi</li>
          <li>Kampanya ve bilgilendirme amaçlı iletişim</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">3. Veri Güvenliği</h2>
        <p className="mb-6">
          Kişisel verilerinizin güvenliği için uygun teknik ve idari önlemler
          alınmaktadır. Veriler, yetkisiz erişime ve kötüye kullanıma karşı
          korunmaktadır.
        </p>

        <h2 className="text-xl font-semibold mb-2">4. Verilerin Paylaşımı</h2>
        <p className="mb-6">
          Kişisel verileriniz, yalnızca hizmetin sağlanması ve yasal
          gereklilikler kapsamında üçüncü kişilerle paylaşılabilir.
        </p>

        <h2 className="text-xl font-semibold mb-2">5. Kullanıcı Hakları</h2>
        <p>
          KVKK ve ilgili mevzuat kapsamında kullanıcılar, verilerine erişim,
          düzeltme, silme ve işleme itiraz etme haklarına sahiptir.
          Taleplerinizi iletişim formu veya{' '}
          <a
            href="mailto:info@kervanpazar.com"
            className="text-indigo-600 underline"
          >
            info@kervanpazar.com
          </a>{' '}
          üzerinden iletebilirsiniz.
        </p>
      </div>
    </div>
  );
}
