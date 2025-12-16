<h1 align="center">KervanPazar: KOBİ'ler İçin Modern E-ticaret Platformu</h1>

<img width="1830" height="896" alt="resim" src="https://github.com/user-attachments/assets/c1aa26d6-3f14-4f95-b9c6-9116e08eb303" />

  <br>
  <em></em>
</p>

##  Proje Hakkında

**KervanPazar**, küçük ve orta ölçekli işletmeler (KOBİ'ler) için tasarlanmış, **SEO dostu** ve **ölçeklenebilir** bir e-ticaret platformudur. İşletmelerin dijital dünyaya kolayca adım atmalarını ve ürünlerini geniş kitlelere ulaştırmalarını sağlamayı hedefler. Modern web teknolojileriyle geliştirilmiş olup, hem kullanıcı dostu bir arayüz hem de güçlü bir altyapı sunar.

##  Teknolojiler

Bu proje, modern JavaScript ekosisteminin güçlü araçlarıyla geliştirilmiştir:

**Frontend:**
* **React / Next.js:** Hızlı ve dinamik kullanıcı arayüzleri için.
* **Tailwind CSS:** Hızlı ve esnek UI geliştirme için Utility-First CSS framework'ü.
* **JavaScript (ES6+)**: Frontend mantığı ve etkileşimler için.

**Backend:**
* **Node.js / Express.js:** Güçlü, ölçeklenebilir ve hızlı API servisleri için.
* **MongoDB (Mongoose ile):** NoSQL veritabanı, esnek şema yapısı ve yüksek performans için.
    * *(Alternatif olarak: **PostgreSQL (Sequelize/Prisma ile):** İlişkisel veriler için güçlü ve güvenilir bir seçenek.)*

**Diğer:**
* **Git / GitHub:** Versiyon kontrolü ve takım çalışması için.
* **Stripe / Iyzico:** Güvenli ödeme entegrasyonları için.
* **JWT (JSON Web Tokens):** Kullanıcı kimlik doğrulama ve yetkilendirme için.
* **Cloudinary / AWS S3:** Güvenli ve ölçeklenebilir dosya (ürün görselleri vb.) depolama için.
* **NPM / Yarn:** Paket yönetimi için.

##  Mevcut Durum & Özellikler (Beta Geliştirmesinde)

Proje aktif olarak geliştirme aşamasındadır. Şu anki temel özellikler ve üzerinde çalıştığım alanlar:

* **Kullanıcı Kimlik Doğrulama:** JWT ile güvenli kayıt ve giriş sistemi.
* **Ürün Yönetimi:** Ürün ekleme, güncelleme, silme ve listeleme (admin paneli).
* **Kategori Yönetimi:** Ürünlerin kategorilere ayrılması.
* **Sepet & Sipariş Sistemi:** Kullanıcıların sepetine ürün ekleyip sipariş oluşturabilmesi.
* **Güvenli Ödeme Entegrasyonu:** (Stripe/Iyzico entegrasyonu devam ediyor.)
* **Arama & Filtreleme:** Kullanıcıların ürünleri kolayca bulabilmesi için.
* **Responsive Tasarım:** Tüm cihazlarda sorunsuz bir kullanıcı deneyimi.
* **Durum Yönetimi:** Redux Toolkit / React Context API ile merkezi state yönetimi.
* **API Endpointleri:** Ürün, kullanıcı, sipariş yönetimi için RESTful API'ler.

##  Yerel Ortamda Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edin:

1.  **Depoyu Klonlayın:**
    ```bash
    git clone [https://github.com/CodeWithOktay/KervanPazar.git](https://github.com/CodeWithOktay/KervanPazar.git)
    cd KervanPazar
    ```
2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install  # veya yarn install
    ```
3.  **Ortam Değişkenlerini Ayarlayın:**
    * `.env.example` dosyasını `backend/.env` (veya projenin root'unda) olarak kopyalayın.
    * Gerekli API anahtarlarını, veritabanı bağlantı bilgilerini vb. kendi değerlerinizle doldurun.
        ```
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        # ... diğer değişkenler ...
        ```
4.  **Uygulamayı Başlatın:**
    * Backend için ayrı bir terminalde:
        ```bash
        cd backend
        npm start # veya node server.js
        ```
    * Frontend için ayrı bir terminalde:
        ```bash
        cd frontend
        npm start # veya npm run dev (Next.js ise)
        ```
    Proje genellikle `http://localhost:3000` (frontend) ve `http://localhost:5000` (backend) adreslerinde çalışacaktır.

##  Katkıda Bulunma

Açık kaynak projelerine katkıda bulunmaya her zaman açığım! Eğer bu projeye katkıda bulunmak isterseniz:

1.  Depoyu forklayın.
2.  Yeni bir dal (branch) oluşturun: `git checkout -b feature/YeniOzellik`
3.  Değişikliklerinizi yapın ve commit'leyin: `git commit -m 'feat: Yeni özellik eklendi'`
4.  Dalı push'layın: `git push origin feature/YeniOzellik`
5.  Bir Pull Request (PR) açın.

##  İletişim

Sorularınız veya işbirliği teklifleriniz için bana ulaşmaktan çekinmeyin:

* **E-posta:** Oktayyorulmaz89@gmail.com
## Lisans
Bu proje **MIT** Lisansı ile lisanslanmıştır.
