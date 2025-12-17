// src/app/hakkimizda/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda | KervanPazar",
  description:
    "KervanPazar'ın misyonu, vizyonu ve değerleri. Güven ve kalite üzerine kurulu e-ticaret yolculuğumuzu keşfedin.",
};

const AboutPage = () => {
  return (
    <main className="bg-gray-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Ana Başlık ve Giriş */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            KervanPazar: Güven ve Kalitenin Buluştuğu Dijital Pazar Yeri
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Tarihin en köklü ticaret yollarından aldığımız ilhamla, günümüz
            teknolojisini birleştirerek sizlere sadece bir ürün değil, güvene
            dayalı bir alışveriş deneyimi sunuyoruz.
          </p>
        </section>

        {/* Hikayemiz */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Hikayemiz
            </h2>
            <p className="text-gray-700 leading-relaxed">
              KervanPazar&apos;ın temelleri, binlerce yıldır medeniyetleri
              birbirine bağlayan, farklı kültürlerin zenginliklerini uzak
              diyarlara taşıyan kervanların o sarsılmaz ruhu üzerine
              kurulmuştur. Bir kervanın en değerli varlığı, taşıdığı yük kadar,
              o yükü zamanında ve eksiksiz teslim etme sözüdür. Biz de bu
              felsefeyi dijital çağa taşıdık. 2025 yılında, e-ticaretin hız ve
              kolaylığını, geleneksel ticaretin güven ve samimiyetiyle
              birleştirme hedefiyle yola çıktık. Amacımız, Türkiye&apos;nin dört
              bir yanındaki kaliteli üreticileri ve seçkin markaları, siz
              değerli müşterilerimizle en güvenilir yoldan buluşturmaktır.
            </p>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Misyonumuz */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Misyonumuz
            </h2>
            <p className="text-gray-700 leading-relaxed">
              En kaliteli ürünleri, geniş bir yelpazede ve ulaşılabilir
              fiyatlarla sunarak, müşteri memnuniyetini her şeyin üzerinde
              tutmaktır. Teknolojik altyapımızı sürekli geliştirerek, A&apos;dan
              Z&apos;ye sorunsuz, hızlı ve şeffaf bir alışveriş süreci sağlamak
              en temel görevimizdir.
            </p>
          </div>

          {/* Vizyonumuz */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Vizyonumuz
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Türkiye&apos;nin lider e-ticaret platformlarından biri olmak ve
              KervanPazar adını kalite, güven ve yenilikçilik ile
              özdeşleştirmektir. Müşterilerimizin ve iş ortaklarımızın ilk
              tercihi olarak, sektörde standartları belirleyen bir marka olmayı
              hedefliyoruz.
            </p>
          </div>
        </div>

        {/* Değerlerimiz */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">
            Bizi Biz Yapan Değerler
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Müşteri Odaklılık
              </h3>
              <p className="text-gray-600">
                Her kararımızın merkezinde müşterilerimizin mutluluğu ve
                memnuniyeti yer alır.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Güvenilirlik ve Şeffaflık
              </h3>
              <p className="text-gray-600">
                Açık iletişim kurar, tüm süreçlerimizde dürüstlüğü ve şeffaflığı
                esas alırız.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Kalite Garantisi
              </h3>
              <p className="text-gray-600">
                Platformumuzda yer alan her ürünün ve hizmetin kalitesinin
                arkasında dururuz.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Sürekli Gelişim
              </h3>
              <p className="text-gray-600">
                Yenilikleri takip eder, teknolojiyi ve süreçlerimizi daima daha
                iyiye taşımak için çalışırız.
              </p>
            </div>
          </div>
        </section>

        {/* Kapanış */}
        <section className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Bu Yolculukta Bize Katılın
          </h2>
          <p className="text-lg text-gray-600">
            KervanPazar ailesi olarak, bu güven ve kalite yolculuğunda sizleri
            de aramızda görmekten büyük mutluluk duyarız. Alışverişin en
            güvenilir haliyle tanışmak için doğru yerdesiniz.
          </p>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;
