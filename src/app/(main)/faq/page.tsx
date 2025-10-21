"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, Mail } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
  category: string;
};

const faqs: FAQ[] = [
  {
    category: "Sipariş & Teslimat",
    question: "Siparişim ne zaman kargoya verilir?",
    answer:
      "Siparişleriniz genellikle 1-3 iş günü içinde kargoya teslim edilir. Stok durumu onaylanan ürünler aynı gün kargoya verilir. Resmî tatiller ve kampanya dönemlerinde bu süre 4-5 iş gününe kadar uzayabilir. Kargo takip numaranızı sipariş takip sayfanızdan görüntüleyebilirsiniz.",
  },
  {
    category: "Sipariş & Teslimat",
    question: "Kargo ücreti ne kadar?",
    answer:
      "1500 TL ve üzeri alışverişlerde kargo ücretsizdir. Diğer siparişlerde sabit 49 TL kargo ücreti uygulanır. Anlaşmalı olduğumuz kargo firmaları ile en uygun fiyat garantisi sunuyoruz. Kapıda ödeme seçeneğinde ekstra 10 TL işlem ücreti alınmaktadır.",
  },
  {
    category: "İade & Değişim",
    question: "Ürünü iade etmek istiyorum, nasıl yapabilirim?",
    answer:
      'Ürünü teslim aldıktan sonra 14 gün içinde iade talebinde bulunabilirsiniz. İade sürecini "Hesabım > Siparişlerim" bölümünden başlatabilirsiniz. Ürünün orijinal ambalajında ve etiketli olması gerekmektedir. İade onayı sonrası ödemeniz 3-5 iş günü içinde hesabınıza iade edilir.',
  },
  {
    category: "Ödeme",
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer:
      "Kredi kartı (taksit seçenekleriyle), banka kartı, havale/EFT, kapıda ödeme ve dijital cüzdan seçeneklerini kullanabilirsiniz. 3D Secure güvenlik sistemi ile tüm ödeme işlemleriniz güvence altındadır. Taksit seçenekleri bankaların kampanyalarına göre değişiklik gösterebilir.",
  },
  {
    category: "Fatura & Belge",
    question: "Faturamı nasıl alabilirim?",
    answer:
      'Faturalar siparişiniz onaylandıktan sonra e-posta adresinize dijital olarak gönderilir. Ayrıca "Hesabım > Faturalarım" bölümünden tüm faturalarınıza erişebilirsiniz. Kurumsal alımlarda e-fatura seçeneğimiz bulunmaktadır. Fatura düzenleme talepleriniz için müşteri hizmetlerimizle iletişime geçebilirsiniz.',
  },
  {
    category: "Hesap & Üyelik",
    question: "Hesabımı nasıl silebilirim?",
    answer:
      'Hesap silme işlemini "Hesap Ayarları > Hesabı Kapat" bölümünden gerçekleştirebilirsiniz. Hesap silme işlemi öncesinde aktif siparişlerinizin ve iade süreçlerinizin tamamlanmış olması gerekmektedir. Hesap silme işlemi geri alınamaz.',
  },
  {
    category: "Ürün & Stok",
    question: "Stokta olmayan ürünleri nasıl takip edebilirim?",
    answer:
      'Stokta olmayan ürünlerin sayfasında "Stok Gelince Haber Ver" butonunu kullanabilirsiniz. Ürün stoğa girdiğinde e-posta ile bilgilendirileceksiniz. Ayrıca ürün sayfasında tahmini stok geliş tarihini görebilirsiniz.',
  },
  {
    category: "Garanti & Destek",
    question: "Ürün garantisi ve teknik destek hizmetiniz var mı?",
    answer:
      "Tüm ürünlerimiz distribütör garantisi kapsamındadır. Garanti süreleri ürün kategorisine göre 1-3 yıl arasında değişmektedir. Teknik destek ve garanti işlemleri için müşteri hizmetlerimiz hafta içi 09:00-18:00 saatleri arasında hizmet vermektedir.",
  },
];

const categories = [
  "Tüm Kategoriler",
  ...new Set(faqs.map((faq) => faq.category)),
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tüm Kategoriler");

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tüm Kategoriler" ||
      faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-4">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aradığınız cevapları hızlıca bulun. Soramadığınız sorular için
            destek ekibimiz size yardımcı olmaya hazır.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Sorunuzu yazın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
              <Search className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Sonuç bulunamadı
              </h3>
              <p className="text-gray-600 mb-6">
                Arama kriterlerinize uygun soru bulunamadı.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Tüm Kategoriler");
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Tüm Soruları Gör
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex justify-between items-center text-left p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg pr-8">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {openIndex === index ? (
                      <ChevronUp className="text-blue-600" size={24} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={24} />
                    )}
                  </div>
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mt-12 text-center">
          <Mail className="mx-auto text-gray-600 mb-4" size={40} />
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Yardıma mı ihtiyacınız var?
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Sorularınız için destek ekibimiz burada. Size yardımcı olmaktan
            mutluluk duyarız.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:destek@kervanpazar.com"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              E-posta Gönder
            </a>
            <a
              href="/contact"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-400 transition-colors duration-200 font-medium"
            >
              İletişim Formu
            </a>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {faqs.length}+
            </div>
            <div className="text-sm text-gray-600">Soru</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600 mb-1">7/24</div>
            <div className="text-sm text-gray-600">Destek</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">15 dk</div>
            <div className="text-sm text-gray-600">Ort. Yanıt</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-orange-600 mb-1">%98</div>
            <div className="text-sm text-gray-600">Memnuniyet</div>
          </div>
        </div>
      </div>
    </main>
  );
}
