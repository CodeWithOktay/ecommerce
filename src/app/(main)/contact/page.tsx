'use client';

import {
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
} from 'lucide-react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

/**
 * İletişim Sayfası Bileşeni
 *
 * Kullanıcıların şirketle iletişime geçebileceği form ve iletişim bilgilerini içeren sayfa.
 * Form validasyonu, toast bildirimleri ve responsive tasarım içerir.
 */
export default function ContactPage() {
  // Form verilerini tutan state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Form gönderim durumu state'i
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Form input değişikliklerini yöneten fonksiyon
   * @param e - Input change event'i
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  /**
   * Form submit işleyicisi
   * @param e - Form event'i
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Form validasyonu
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error('Lütfen tüm zorunlu alanları doldurun!');
      setIsSubmitting(false);
      return;
    }

    // E-posta format validasyonu
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Lütfen geçerli bir e-posta adresi girin!');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simüle edilmiş API çağrısı - gerçek uygulamada fetch/axios kullanılır
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Başarılı gönderim bildirimi
      toast.success(
        'Mesajınız başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz.'
      );

      // Formu temizle
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      //Hata durumu bildirimi
      toast.error(
        'Mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * İletişim yöntemleri listesi
   * Her yöntem için ikon, başlık, içerik, açıklama ve link bilgisi
   */
  const contactMethods = [
    {
      icon: <Mail size={24} />,
      title: 'E-posta',
      content: 'info@kervanpazar.com',
      description: '7/24 e-posta desteği',
      link: 'mailto:info@kervanpazar.com',
    },
    {
      icon: <Phone size={24} />,
      title: 'Telefon',
      content: '+90 (555) 123 45 67',
      description: 'Pzt-Cuma 09:00-18:00',
      link: 'tel:+905551234567',
    },
    {
      icon: <MapPin size={24} />,
      title: 'Adres',
      content: 'İstanbul, Türkiye',
      description: 'Merkez ofis',
      link: 'https://maps.google.com',
    },
    {
      icon: <Clock size={24} />,
      title: 'Çalışma Saatleri',
      content: 'Pazartesi - Cuma',
      description: '09:00 - 18:00',
      link: null, // Link yok
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12">
      {/* Toast Bildirimleri */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ✅ Başlık Bölümü */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-4">
            İletişime Geçin
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Sorularınız, görüşleriniz veya iş birliği teklifleriniz için bizimle
            iletişime geçin. Uzman ekibimiz size en kısa sürede dönüş
            yapacaktır.
          </p>
        </div>

        {/* ✅ Ana İçerik Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ✅ İletişim Bilgileri Bölümü */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                İletişim Bilgileri
              </h2>

              {/* İletişim Yöntemleri Listesi */}
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    {/* İkon Container */}
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      {method.icon}
                    </div>
                    {/* İçerik */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {method.title}
                      </h3>
                      {/* Link varsa tıklanabilir, yoksa normal metin */}
                      {method.link ? (
                        <a
                          href={method.link}
                          className="text-gray-600 hover:text-blue-600 transition-colors duration-200 block truncate"
                        >
                          {method.content}
                        </a>
                      ) : (
                        <p className="text-gray-600">{method.content}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {method.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ✅ Ek Bilgiler - Yanıt Süreleri */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Hızlı Yanıt Garantisi
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• E-posta: 24 saat içinde yanıt</p>
                  <p>• Telefon: Aynı gün içinde dönüş</p>
                  <p>• Acil durumlar: 2 saat içinde</p>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ İletişim Formu Bölümü */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              {/* Form Başlığı */}
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="text-blue-600" size={24} />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Mesaj Gönderin
                </h2>
              </div>

              {/* İletişim Formu */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Ad Soyad ve E-posta - Yan yana grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ad Soyad Input'u */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Ad Soyad *
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Adınız ve soyadınız"
                        required
                      />
                    </div>
                  </div>

                  {/* E-posta Input'u */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      E-posta Adresi *
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Konu Seçimi */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Konu *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    required
                  >
                    <option value="">Konu seçin</option>
                    <option value="genel-soru">Genel Soru</option>
                    <option value="teknik-destek">Teknik Destek</option>
                    <option value="is-birligi">İş Birliği</option>
                    <option value="sikayet">Şikayet</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>

                {/* Mesaj Textarea */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mesajınız *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-vertical"
                    placeholder="Mesajınızı detaylı bir şekilde yazın..."
                    required
                  />
                </div>

                {/* Gönder Butonu */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    // Yükleme durumu
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    // Normal durum
                    <>
                      <Send size={20} />
                      Mesajı Gönder
                    </>
                  )}
                </button>

                {/* Form Açıklama */}
                <p className="text-xs text-gray-500 text-center">
                  * İşaretli alanlar zorunludur. Mesajınız en kısa sürede
                  değerlendirilecektir.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* ✅ SSS (Sıkça Sorulan Sorular) Yönlendirme */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Sıkça Sorulan Sorular
            </h3>
            <p className="text-gray-600 mb-6">
              Hızlı cevap bulmak için SSS sayfamızı ziyaret edin.
            </p>
            <a
              href="/faq"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-400 transition-colors duration-200 font-medium"
            >
              SSS Sayfasına Git
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
