"use client";

import { ChevronDown, ChevronUp, Mail, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

/**
 * SSS (Sıkça Sorulan Sorular) veri tipi
 */
type FAQ = {
  question: string;
  answer: string;
  category: string;
};

/**
 * SSS veri seti
 */
const faqs: FAQ[] = [
  {
    category: "Sipariş & Teslimat",
    question: "Siparişim ne zaman kargoya verilir?",
    answer:
      "Siparişleriniz genellikle 1-3 iş günü içinde kargoya teslim edilir. Stok durumu onaylanan ürünler aynı gün kargoya verilir. Resmî tatiller ve kampanya dönemlerinde bu süre 4-5 iş gününe kadar uzayabilir.",
  },
  {
    category: "Sipariş & Teslimat",
    question: "Kargo ücreti ne kadar?",
    answer:
      "299 TL ve üzeri alışverişlerde kargo ücretsizdir. Diğer siparişlerde sabit 49 TL kargo ücreti uygulanır. Kapıda ödeme seçeneğinde ekstra 10 TL işlem ücreti alınmaktadır.",
  },
  {
    category: "İade & Değişim",
    question: "Ürünü iade etmek istiyorum, nasıl yapabilirim?",
    answer:
      'Ürünü teslim aldıktan sonra 14 gün içinde iade talebinde bulunabilirsiniz. İade sürecini "Hesabım > Siparişlerim" bölümünden başlatabilirsiniz. Ürünün orijinal ambalajında olması gerekmektedir.',
  },
  {
    category: "Ödeme",
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer:
      "Kredi kartı (taksit seçenekleriyle), banka kartı, havale/EFT, kapıda ödeme ve dijital cüzdan seçeneklerini kullanabilirsiniz. 3D Secure ile tüm işlemleriniz güvence altındadır.",
  },
  {
    category: "Fatura & Belge",
    question: "Faturamı nasıl alabilirim?",
    answer:
      'Faturalar siparişiniz onaylandıktan sonra e-posta adresinize dijital olarak gönderilir. Ayrıca "Hesabım > Faturalarım" bölümünden tüm faturalarınıza erişebilirsiniz.',
  },
  {
    category: "Hesap & Üyelik",
    question: "Hesabımı nasıl silebilirim?",
    answer:
      'Hesap silme işlemini "Hesap Ayarları > Hesabı Kapat" bölümünden gerçekleştirebilirsiniz. Bu işlem geri alınamaz ve aktif siparişiniz olmamalıdır.',
  },
  {
    category: "Ürün & Stok",
    question: "Stokta olmayan ürünleri nasıl takip edebilirim?",
    answer:
      'Stokta olmayan ürünlerin sayfasında "Stok Gelince Haber Ver" butonunu kullanabilirsiniz. Ürün stoğa girdiğinde e-posta ile bilgilendirileceksiniz.',
  },
  {
    category: "Garanti & Destek",
    question: "Ürün garantisi ve teknik destek hizmetiniz var mı?",
    answer:
      "Tüm ürünlerimiz distribütör garantisi kapsamındadır. Garanti süreleri 1-3 yıl arasında değişmektedir. Teknik destek hafta içi 09:00-18:00 arasındadır.",
  },
];

/**
 * Kategori listesi
 */
const categories = [
  "Tüm Kategoriler",
  ...new Set(faqs.map((faq) => faq.category)),
];

export default function FAQPage() {
  // DÜZELTME: Index yerine sorunun kendisini (string) tutuyoruz.
  // Bu sayede filtreleme yapıldığında karışıklık olmaz.
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tüm Kategoriler");

  /**
   * Soruyu açma/kapama fonksiyonu
   * @param question - Tıklanan sorunun metni (Benzersiz ID niyetine)
   */
  const toggle = (question: string) => {
    setOpenQuestion(openQuestion === question ? null : question);
  };

  /**
   * Filtreleme Mantığı
   */
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
        {/* Başlık */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-4">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aklına takılan her şeyin cevabı burada. Bulamazsan biz buradayız!
          </p>
        </div>

        {/* Arama ve Filtre */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Arama Input */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Sorunuzu buraya yazın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Kategori Select */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none cursor-pointer outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Liste */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            // Boş Durum
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
              <Search className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Sonuç bulunamadı
              </h3>
              <p className="text-gray-600 mb-6">
                Farklı anahtar kelimelerle aramayı deneyebilirsin dostum.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Tüm Kategoriler");
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            // Dolu Liste
            filteredFaqs.map((faq) => {
              const isOpen = openQuestion === faq.question;

              return (
                <div
                  // KEY olarak index değil, unique olan soruyu kullandık
                  key={faq.question}
                  className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${
                    isOpen
                      ? "border-blue-200 ring-1 ring-blue-100"
                      : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => toggle(faq.question)}
                    className="w-full flex justify-between items-center text-left p-6 hover:bg-gray-50 transition-colors duration-200 rounded-2xl"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                          {faq.category}
                        </span>
                      </div>
                      <h3
                        className={`font-semibold text-lg pr-8 transition-colors ${isOpen ? "text-blue-700" : "text-gray-800"}`}
                      >
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {isOpen ? (
                        <ChevronUp className="text-blue-600" size={24} />
                      ) : (
                        <ChevronDown className="text-gray-400" size={24} />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                      <hr className="border-gray-100 mb-4" />
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* İletişim Alt Alanı */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mt-12 text-center shadow-sm">
          <Mail className="mx-auto text-gray-600 mb-4" size={40} />
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Hala sorun mu var?
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Merak etme, destek ekibimiz fişek gibi hazır bekliyor.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact">
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                İletişime Geç
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
