<div align="center">
  <h1 align="center">KervanPazar</h1>
  <p align="center"><strong>KOBİ'ler İçin Modern E-ticaret Platformu</strong></p>

  <div align="center">
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </div>
  <br />

  <img width="100%" alt="KervanPazar Dashboard" src="https://github.com/user-attachments/assets/daa11841-0f26-4e5a-bda5-384170746cd0" />
  <div style="display: flex; gap: 10px; margin-top: 10px;">
     <img width="49%" alt="Dashboard Dark" src="https://github.com/user-attachments/assets/3d7c7342-f78b-48e2-8766-a6977624e1c0" />
     <img width="49%" alt="Mobile View" src="https://github.com/user-attachments/assets/1aea320f-f86e-4237-bb70-0497c21564d7" />
  </div>

  <br />
  
  <p align="center">
    <a href="#-proje-hakkında">Proje Hakkında</a> •
    <a href="#-teknolojiler-ve-altyapı">Teknolojiler</a> •
    <a href="#-kurulum-ve-çalıştırma">Kurulum</a> •
    <a href="#-katkıda-bulunma">Katkıda Bulunma</a>
  </p>
</div>

---

> [!NOTE]
> **Yasal Uyarı:** Bu sitede yer alan marka adı, ürün isimleri ve içerikleri yalnızca demo ve görsel amaçlı kullanılmıştır. Logo ve tüm tasarımlar tarafıma aittir. Site ticari amaç taşımamaktadır ve marka sahibiyle herhangi bir bağlantı, ortaklık veya sponsorluk bulunmamaktadır.

## 🚀 Proje Hakkında

**KervanPazar**, küçük ve orta ölçekli işletmeler (KOBİ'ler) için tasarlanmış, **modern**, **performanslı** ve **ölçeklenebilir** bir e-ticaret platformudur. 

En güncel web teknolojileri kullanılarak geliştirilen bu proje, işletmelerin dijital dönüşüm süreçlerini hızlandırmayı, ürünlerini kolayca yönetmelerini ve güvenli bir alışveriş deneyimi sunmalarını amaçlar. Hem müşteriler hem de yöneticiler için sezgisel ve premium bir kullanıcı arayüzü sunar.

## 🛠️ Teknolojiler ve Altyapı

Bu proje, performans ve geliştirici deneyimini en üst düzeye çıkaran modern bir **Fullstack** yapısı üzerine kurulmuştur.

### 🎨 Frontend & Core
| Teknoloji | Açıklama |
| --- | --- |
| **[Next.js 15](https://nextjs.org/)** | App Router mimarisi ile güçlü SSR & SSG desteği. |
| **[TypeScript](https://www.typescriptlang.org/)** | Tip güvenliği ve geliştirilebilir kod tabanı. |
| **[Tailwind CSS](https://tailwindcss.com/)** | Hızlı ve modern UI tasarımı. |
| **[Zustand](https://github.com/pmndrs/zustand)** | Hafif global durum (state) yönetimi. |
| **[React Hook Form](https://react-hook-form.com/)** | Performanslı form yönetimi ve validasyon. |

### 🗄️ Backend & Veritabanı
| Teknoloji | Açıklama |
| --- | --- |
| **[Node.js](https://nodejs.org/)** | Sunucu tarafı çalışma zamanı. |
| **[Prisma ORM](https://www.prisma.io/)** | Type-safe veritabanı erişimi. |
| **[PostgreSQL](https://www.postgresql.org/)** | Güvenilir ve ilişkisel veritabanı. |
| **[NextAuth.js](https://next-auth.js.org/)** | Güvenli kimlik doğrulama (JWT, OAuth). |

## ✨ Öne Çıkan Özellikler

- **🔐 Güvenli Kimlik Doğrulama:** NextAuth.js ile rol tabanlı (Müşteri, Admin) giriş sistemi.
- **📦 Gelişmiş Ürün Yönetimi:** Stok takibi, varyantlar (renk/beden), resim galerisi.
- **🛒 Sepet ve Sipariş:** Kesintisiz alışveriş, sipariş takibi ve geçmişi.
- **⚙️ Admin Paneli:** 
  - Detaylı Dashboard ve satış analizleri.
  - Kategori, marka ve özellik yönetimi.
  - İade talepleri ve indirim kuponları.
  - Sistem logları (Audit Logs).
- **💅 Modern UI/UX:** Responsive tasarım, dark mode desteği.
- **🔍 SEO Optimize:** Arama motorları için optimize edilmiş yapı.

## 📂 Proje Yapısı

```bash
├── src
│   ├── app           # Next.js App Router sayfaları
│   ├── components    # Yeniden kullanılabilir UI bileşenleri
│   │   ├── ui        # Temel UI elemanları (Button, Input vb.)
│   │   └── features  # Özellik bazlı bileşenler (ProductCard vb.)
│   ├── lib           # Yardımcı fonksiyonlar ve yapılandırmalar
│   │   ├── connect   # Veritabanı bağlantısı
│   │   └── utils     # Genel yardımcı araçlar
│   ├── types         # TypeScript tip tanımları
│   └── store         # Zustand store'ları
├── prisma            # Veritabanı şeması ve seed dosyaları
├── public            # Statik dosyalar
└── logs              # Uygulama logları
```

## 🏁 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### Gereksinimler
- Node.js (v18+)
- PostgreSQL veritabanı

### 1. Kurulum

```bash
# Depoyu klonlayın
git clone https://github.com/CodeWithOktay/KervanPazar.git
cd KervanPazar

# Bağımlılıkları yükleyin
npm install
```

### 2. Yapılandırma

Kök dizinde `.env` dosyası oluşturun ve aşağıdaki değişkenleri tanımlayın:

```env
# Veritabanı
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/kervanpazar?schema=public"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="buraya-rastgele-bir-string-girin" 

# E-posta (Opsiyonel)
SMTP_HOST="smtp.provider.com"
SMTP_PORT=587
SMTP_USER="user@provider.com"
SMTP_PASS="password"
EMAIL_FROM="noreply@kervanpazar.com"
```

### 3. Veritabanı Hazırlığı

```bash
# Şemayı veritabanına uygula
npx prisma db push

# (Opsiyonel) Seed verilerini yükle
npx prisma db seed
```

### 4. Çalıştırma

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Lütfen bir Pull Request açmadan önce:
1.  Depoyu forklayın.
2.  Yeni bir dal (branch) oluşturun: `git checkout -b feature/YeniOzellik`
3.  Değişikliklerinizi yapın ve commit'leyin: `git commit -m 'feat: Yeni özellik eklendi'`
4.  Dalı push'layın: `git push origin feature/YeniOzellik`
5.  Bir Pull Request (PR) açın.

## 📄 Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakabilirsiniz.

---

<p align="center">
  <sub>CodeWithOktay tarafından ❤️ ile geliştirildi.</sub>
</p>
