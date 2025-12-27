"use client";

import {
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Settings } from "@prisma/client";

interface ContactClientProps {
  settings: Settings | null;
}

export default function ContactClient({ settings }: ContactClientProps) {
  // 1. Telefon Numarası Formatlama
  const formatPhoneNumber = (phone: string | null | undefined) => {
    if (!phone) return "0 (555) 123 45 67";
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("90")) cleaned = cleaned.slice(2);
    if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
    if (cleaned.length === 10) {
      return `0 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
    }
    return phone;
  };

  // 2. Form State Yönetimi
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Input Değişikliklerini Yakalama
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Form Gönderme İşlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basit Validasyon
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Lütfen tüm zorunlu alanları doldurun!");
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Lütfen geçerli bir e-posta adresi girin!");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bir hata oluştu.");
      }

      toast.success("Mesajınız bize ulaştı! En kısa sürede dönüş yapacağız.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Mesaj gönderilemedi.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. İletişim Bilgileri Listesi
  const contactMethods = [
    {
      icon: <Mail size={24} />,
      title: "E-posta",
      content: settings?.contactEmail || "info@kervanpazar.com",
      description: "7/24 e-posta desteği",
      link: `mailto:${settings?.contactEmail || "info@kervanpazar.com"}`,
      color: "text-purple-600 bg-purple-100",
    },
    {
      icon: <Phone size={24} />,
      title: "Telefon",
      content: formatPhoneNumber(settings?.contactPhone),
      description: "Hafta içi 09:00-18:00",
      link: `tel:${settings?.contactPhone?.replace(/\D/g, "") || ""}`,
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: <MapPin size={24} />,
      title: "Adres",
      content: settings?.address || "İstanbul, Türkiye",
      description: "Merkez Ofis",
      link: null,
      color: "text-indigo-600 bg-indigo-100",
    },
    {
      icon: <Clock size={24} />,
      title: "Çalışma Saatleri",
      content: "Pazartesi - Cuma",
      description: "09:00 - 18:00",
      link: null,
      color: "text-cyan-600 bg-cyan-100",
    },
  ];

  return (
    // ✨ GÜNCEL: Arka Plan Gradient Geçişi
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 py-12 md:py-20 relative overflow-hidden">
      {/* Arka plan süslemeleri (Opsiyonel Blur Efektleri) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Başlık Bölümü */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {settings?.siteTitle
                ? `${settings.siteTitle} İle İletişime Geçin`
                : "İletişime Geçin"}
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {settings?.slogan ||
              "Sorularınız, görüşleriniz veya iş birliği teklifleriniz için aşağıdaki formu doldurarak veya iletişim kanallarımızı kullanarak bize ulaşabilirsiniz."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SOL TARAF: İletişim Kartları */}
          <div className="lg:col-span-1 space-y-8">
            {/* İletişim Bilgileri Kartı */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">
                İletişim Bilgileri
              </h2>
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100"
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${method.color} shadow-sm`}
                    >
                      {method.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {method.title}
                      </h3>
                      {method.link ? (
                        <a
                          href={method.link}
                          className="text-gray-600 hover:text-blue-600 transition-colors duration-200 block truncate font-medium"
                        >
                          {method.content}
                        </a>
                      ) : (
                        <p className="text-gray-600 whitespace-pre-line font-medium">
                          {method.content}
                        </p>
                      )}
                      <p className="text-sm text-gray-400 mt-1">
                        {method.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sosyal Medya */}
              {(settings?.instagram ||
                settings?.facebook ||
                settings?.twitter) && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 text-center">
                    Bizi Takip Edin
                  </h3>
                  <div className="flex justify-center gap-4">
                    {settings.instagram && (
                      <a
                        href={`https://instagram.com/${settings.instagram}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition shadow-md hover:scale-105 transform duration-200"
                      >
                        <Instagram size={20} />
                      </a>
                    )}
                    {settings.facebook && (
                      <a
                        href={settings.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md hover:scale-105 transform duration-200"
                      >
                        <Facebook size={20} />
                      </a>
                    )}
                    {settings.twitter && (
                      <a
                        href={`https://twitter.com/${settings.twitter}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition shadow-md hover:scale-105 transform duration-200"
                      >
                        <Twitter size={20} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SAĞ TARAF: Mesaj Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl text-white shadow-lg">
                  <MessageSquare size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Mesaj Gönderin
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Ad Soyad *
                    </label>
                    <div className="relative group">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                        size={20}
                      />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Adınız ve soyadınız"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      E-posta Adresi *
                    </label>
                    <div className="relative group">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                        size={20}
                      />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all duration-200"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Konu *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all duration-200"
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

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Mesajınız *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none resize-none transition-all duration-200"
                    placeholder="Mesajınızı detaylı bir şekilde yazın..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Mesajı Gönder
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* SSS Linki - Alt Bölüm */}
        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-8 max-w-2xl mx-auto shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Sıkça Sorulan Sorular
            </h3>
            <p className="text-gray-600 mb-6">
              Aklındaki sorulara hızlıca cevap bulmak ister misin? SSS sayfamız
              hazır.
            </p>
            <a
              href="/faq"
              className="inline-flex items-center gap-2 bg-white border-2 border-indigo-100 text-indigo-700 px-8 py-3 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 font-bold"
            >
              SSS Sayfasına Git
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
