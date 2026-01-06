<h1 align="center">KervanPazar: KOBİ'ler İçin Modern E-ticaret Platformu</h1>

<div align="center">
  <img width="1830" height="896" alt="KervanPazar Ekran Görüntüsü" src="https://github.com/user-attachments/assets/c1aa26d6-3f14-4f95-b9c6-9116e08eb303" />
</div>

<br>

## 🚀 Proje Hakkında

**KervanPazar**, küçük ve orta ölçekli işletmeler (KOBİ'ler) için tasarlanmış, **modern**, **performanslı** ve **ölçeklenebilir** bir e-ticaret platformudur. 

En güncel web teknolojileri kullanılarak geliştirilen bu proje, işletmelerin dijital dönüşüm süreçlerini hızlandırmayı, ürünlerini kolayca yönetmelerini ve güvenli bir alışveriş deneyimi sunmalarını amaçlar. Hem müşteriler hem de yöneticiler için sezgisel ve premium bir kullanıcı arayüzü sunar.

## 🛠️ Teknolojiler ve Altyapı

Bu proje, performans ve geliştirici deneyimini en üst düzeye çıkaran modern bir **Fullstack** yapısı üzerine kurulmuştur:

### Frontend & Core
*   **[Next.js 15 (App Router)](https://nextjs.org/):** React tabanlı, sunucu taraflı işleme (SSR) ve statik site oluşturma (SSG) özellikleriyle güçlendirilmiş framework.
*   **[TypeScript](https://www.typescriptlang.org/):** Tip güvenliği ve daha iyi kod kalitesi için.
*   **[Tailwind CSS](https://tailwindcss.com/):** Hızlı, esnek ve modern UI tasarımı için utility-first CSS framework'ü.
*   **[Zustand](https://github.com/pmndrs/zustand):** Hafif ve basit global durum (state) yönetimi.
*   **[React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/):** Güçlü form yönetimi ve şema doğrulama.

### Backend & Veritabanı
*   **[Node.js](https://nodejs.org/) & Next.js API Routes:** Sunucu tarafı mantığı ve API endpoint'leri için.
*   **[Prisma ORM](https://www.prisma.io/):** Type-safe veritabanı erişimi ve şema yönetimi.
*   **[PostgreSQL](https://www.postgresql.org/):** Güvenilir, açık kaynaklı ilişkisel veritabanı.

### Diğer Araçlar & Servisler
*   **[NextAuth.js](https://next-auth.js.org/):** Güvenli kimlik doğrulama (JWT, OAuth) yönetimi.
*   **bcryptjs:** Şifreleme işlemleri.
*   **Nodemailer:** E-posta gönderim servisi.
*   **React Hot Toast / React Toastify:** Kullanıcı bildirimleri.

## ✨ Öne Çıkan Özellikler

*   **🔐 Güvenli Kimlik Doğrulama:** NextAuth.js ile rol tabanlı (Müşteri, Admin) giriş sistemi.
*   **📦 Gelişmiş Ürün Yönetimi:** Stok takibi, varyantlar (renk/beden), resim galerisi ve detaylı açıklamalar.
*   **🛒 Sepet ve Sipariş:** Kesintisiz alışveriş deneyimi, sipariş takibi ve geçmişi.
*   **⚙️ Admin Paneli:** 
    *   Dashboard ve analizler.
    *   Kategori, marka ve özellik yönetimi.
    *   Kullanıcı ve sipariş yönetimi.
    *   İade ve değişim talepleri takibi.
    *   İndirim kuponları ve kampanya yönetimi.
    *   Sistem logları (Audit Logs).
*   **💅 Modern UI/UX:** Responsive tasarım, dark mode uyumluluğu ve premium bileşenler.
*   **🔍 SEO Dostu:** Next.js sayesinde arama motorları için optimize edilmiş yapı.

## 🏁 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### Gereksinimler
*   Node.js (LTS sürümü önerilir)
*   PostgreSQL veritabanı

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/CodeWithOktay/KervanPazar.git
cd KervanPazar
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevresel Değişkenleri Ayarlayın
Kök dizinde `.env` dosyası oluşturun ve aşağıdaki örnekteki gibi yapılandırın:

```env
# Veritabanı Bağlantısı
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/kervanpazar?schema=public"

# NextAuth Ayarları
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-gizli-rastgele-bir-string" # openssl rand -base64 32 ile üretebilirsiniz

# E-posta Ayarları (Opsiyonel - Şifre sıfırlama vb. için)
SMTP_HOST="smtp.ornek.com"
SMTP_PORT=587
SMTP_USER="user@ornek.com"
SMTP_PASS="sifreniz"
EMAIL_FROM="destek@kervanpazar.com"
```

### 4. Veritabanını Hazırlayın
Prisma şemasını veritabanına uygulayın ve seed verilerini (varsa) yükleyin:

```bash
# Veritabanı tablolarını oluştur
npx prisma db push

# (Opsiyonel) Client'ı yeniden oluştur
npx prisma generate

# (Opsiyonel) Başlangıç verilerini yükle
npx prisma db seed
```

### 5. Uygulamayı Başlatın
Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek uygulamayı görüntüleyebilirsiniz.

## 🤝 Katkıda Bulunma

1.  Depoyu forklayın.
2.  Yeni bir feature branch oluşturun (`git checkout -b feature/YeniOzellik`).
3.  Değişikliklerinizi commit'leyin (`git commit -m 'feat: Yeni özellik eklendi'`).
4.  Branch'inizi push'layın (`git push origin feature/YeniOzellik`).
5.  Bir Pull Request oluşturun.

## 📄 Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır.
