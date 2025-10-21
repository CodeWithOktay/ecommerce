'use client';

import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Lock,
  Shield,
  Truck,
} from 'lucide-react';
import Link from 'next/link';

export default function SafeShoppingGuide() {
  const securityFeatures = [
    {
      icon: <Lock size={32} />,
      title: 'SSL Sertifikası',
      description: '256-bit SSL şifreleme ile tüm veri transferiniz güvende',
    },
    {
      icon: <Shield size={32} />,
      title: '3D Secure',
      description: 'Tüm kredi kartı işlemleriniz 3D Secure ile korunur',
    },
    {
      icon: <CreditCard size={32} />,
      title: 'Güvenli Ödeme',
      description: 'Ödeme bilgileriniz asla sistemimizde saklanmaz',
    },
    {
      icon: <Truck size={32} />,
      title: 'Güvenli Teslimat',
      description: 'Teslimat süreciniz anlık takip edilebilir',
    },
  ];

  const safetyTips = [
    {
      title: 'Güçlü Şifre Kullanın',
      tips: [
        'En az 8 karakterli şifre oluşturun',
        'Büyük/küçük harf, rakam ve özel karakter kullanın',
        'Farklı sitelerde aynı şifreyi kullanmayın',
      ],
    },
    {
      title: 'Ödeme Güvenliği',
      tips: [
        'Sadece SSL sertifikalı sitelerde alışveriş yapın',
        'Ödeme sayfasında site adresinin https:// ile başladığından emin olun',
        'SMS onaylı 3D Secure ödemeleri tercih edin',
      ],
    },
    {
      title: 'Hesap Güvenliği',
      tips: [
        'Hesap aktivitelerinizi düzenli kontrol edin',
        'Şüpheli etkinlikleri derhal bildirin',
        'Herkese açık Wi-Fi ağlarında alışveriş yapmayın',
      ],
    },
    {
      title: 'Ürün ve Satıcı Kontrolü',
      tips: [
        'Satıcı değerlendirmelerini okuyun',
        'Gerçekçi olmayan fiyat tekliflerine dikkat edin',
        'Ürün açıklamalarını dikkatlice inceleyin',
      ],
    },
  ];

  const warningSigns = [
    {
      icon: <AlertCircle size={24} className="text-red-500" />,
      text: 'Gerçekçi olmayan indirim oranları (%90+ indirim)',
    },
    {
      icon: <AlertCircle size={24} className="text-red-500" />,
      text: 'Resmi olmayan ödeme yöntemleri talep edilmesi',
    },
    {
      icon: <AlertCircle size={24} className="text-red-500" />,
      text: 'İletişim bilgilerinin eksik veya gizli olması',
    },
    {
      icon: <AlertCircle size={24} className="text-red-500" />,
      text: 'Ürün açıklamalarının yetersiz veya kopya olması',
    },
  ];

  const steps = [
    {
      step: 1,
      title: 'Güvenli Giriş',
      description: 'Hesabınıza güvenli bir şekilde giriş yapın',
    },
    {
      step: 2,
      title: 'Ürün Seçimi',
      description: 'Güvenilir satıcılardan ürün seçin',
    },
    {
      step: 3,
      title: 'Güvenli Ödeme',
      description: 'SSL korumalı ödeme sayfasında işleminizi tamamlayın',
    },
    {
      step: 4,
      title: 'Teslimat Takibi',
      description: 'Siparişinizi anlık takip edin',
    },
    {
      step: 5,
      title: 'Güvenli Teslimat',
      description: 'Ürününüz güvenle kapınıza gelsin',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center">
              <Shield className="text-green-600" size={40} />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-green-600 bg-clip-text text-transparent mb-4">
            Güvenli Alışveriş Kılavuzu
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            KervanPazar&apos;da güvenli alışveriş yapmanız için hazırladığımız
            kapsamlı rehber. Kişisel bilgilerinizin ve ödeme işlemlerinizin
            güvenliği bizim için önceliklidir.
          </p>
        </div>

        {/* Security Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Güvenlik Özelliklerimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center"
              >
                <div className="text-green-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Tips */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Güvenli Alışveriş İpuçları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safetyTips.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={24} />
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Warning Signs */}
        <section className="mb-16">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-900 mb-6 text-center">
              ⚠️ Dikkat Edilmesi Gereken İşaretler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warningSigns.map((warning, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-100"
                >
                  {warning.icon}
                  <span className="text-red-800 text-sm font-medium">
                    {warning.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step by Step Guide */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Güvenli Alışveriş Adımları
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />

            {steps.map((step, index) => (
              <div
                key={index}
                className="relative z-10 flex flex-col items-center text-center mb-8 md:mb-0"
              >
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg">
                  {step.step}
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 max-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-xs">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Sıkça Sorulan Sorular
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Ödeme Güvenliği
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Ödeme bilgilerim güvende mi?
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  3D Secure nedir?
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  SSL sertifikası ne işe yarar?
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Hesap Güvenliği
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Hesabımı nasıl korurum?
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Şifremi unutursam ne yapmalıyım?
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Şüpheli aktivite nasıl bildirilir?
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <div className="text-center mt-12">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-green-900 mb-3">
              Güvenle Alışverişe Başlayın
            </h3>
            <p className="text-green-800 mb-6">
              Tüm güvenlik önlemlerimizle, alışveriş deneyiminizi en güvenli
              şekilde sunuyoruz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
              >
                Alışverişe Başla
              </Link>
              <a
                href="/contact"
                className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-200 font-semibold"
              >
                Soru Sor
              </a>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Son güncelleme: {new Date().getFullYear()} |
            <a
              href="/privacy"
              className="text-green-600 hover:text-green-700 ml-2"
            >
              Gizlilik Politikası
            </a>
            •
            <a
              href="/kvkk"
              className="text-green-600 hover:text-green-700 mx-2"
            >
              KVKK
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
