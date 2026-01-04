/**
 * Veritabanı Tohumlama (Seeding) Betiği
 * 
 * Bu script, geliştirme ve test ortamları için gerekli başlangıç verilerini oluşturur:
 * - Admin kullanıcısı
 * - Kategoriler (Hiyerarşik: Ana ve Alt kategoriler)
 * - Ürün Özellikleri (Attributes)
 * - Örnek Ürünler (Özellik değerleri ile birlikte)
 * - Markalar
 */

import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";
import slugify from "slugify";

const prisma = new PrismaClient();

// Türkçe karakter destekli slug oluşturucu yardımcı fonksiyon
const createSlug = (text: string) =>
  slugify(text, { lower: true, strict: true, locale: "tr" });

// 🛠️ ÖRNEK VERİ SETİ
// Bu yapı, categories -> children (alt kategoriler) -> products (ürünler) hiyerarşisini içerir.
// Her alt kategori kendi özellik tanımlarına (attributes) sahiptir.
const categoriesData = [
  {
    name: "Elektronik",
    children: [
      {
        name: "Bilgisayar",
        // Bu kategoriye ait dinamik özellikler
        attributes: [
          "İşlemci",
          "RAM",
          "Ekran Kartı",
          "Depolama",
          "Ekran Boyutu",
          "İşletim Sistemi",
        ],
        // Bu kategorideki örnek ürünler
        products: [
          {
            name: "Asus ROG Strix G16",
            brand: "Asus",
            price: 48000,
            // Ürün özellik değerleri (Key-Value)
            specs: {
              İşlemci: "Intel Core i7",
              RAM: "32GB",
              "Ekran Kartı": "RTX 4060",
              Depolama: "1TB SSD",
              "Ekran Boyutu": "16 inç",
              "İşletim Sistemi": "Windows 11",
            },
          },
          {
            name: "MacBook Pro M3",
            brand: "Apple",
            price: 75000,
            specs: {
              İşlemci: "M3 Pro",
              RAM: "18GB",
              "Ekran Kartı": "M3 GPU",
              Depolama: "512GB SSD",
              "Ekran Boyutu": "14 inç",
              "İşletim Sistemi": "macOS",
            },
          },
        ],
      },
      {
        name: "Telefon & Aksesuarlar",
        attributes: [
          "Dahili Hafıza",
          "RAM",
          "Pil Gücü",
          "Kamera Çözünürlüğü",
          "Renk",
        ],
        products: [
          {
            name: "iPhone 15 Pro Max",
            brand: "Apple",
            price: 85000,
            specs: {
              "Dahili Hafıza": "256GB",
              RAM: "8GB",
              "Pil Gücü": "4422 mAh",
              "Kamera Çözünürlüğü": "48 MP",
              Renk: "Titanyum",
            },
          },
          {
            name: "Samsung Galaxy S24 Ultra",
            brand: "Samsung",
            price: 70000,
            specs: {
              "Dahili Hafıza": "512GB",
              RAM: "12GB",
              "Pil Gücü": "5000 mAh",
              "Kamera Çözünürlüğü": "200 MP",
              Renk: "Siyah",
            },
          },
        ],
      },
      {
        name: "TV & Ses Sistemleri",
        attributes: ["Ekran Boyutu", "Çözünürlük", "Smart TV", "Panel Tipi"],
        products: [
          {
            name: "LG OLED evo C3",
            brand: "LG",
            price: 42000,
            specs: {
              "Ekran Boyutu": "55 inç",
              Çözünürlük: "4K Ultra HD",
              "Smart TV": "Var",
              "Panel Tipi": "OLED",
            },
          },
        ],
      },
      {
        name: "Beyaz Eşya",
        attributes: ["Enerji Sınıfı", "Kapasite", "Program Sayısı", "Renk"],
        products: [
          {
            name: "Bosch Çamaşır Makinesi",
            brand: "Bosch",
            price: 24000,
            specs: {
              "Enerji Sınıfı": "A",
              Kapasite: "9 kg",
              "Program Sayısı": "14",
              Renk: "Beyaz",
            },
          },
        ],
      },
      {
        name: "Elektrikli Ev Aletleri",
        attributes: ["Güç", "Kullanım Tipi", "Şarjlı"],
        products: [
          {
            name: "Dyson V15 Detect",
            brand: "Dyson",
            price: 28000,
            specs: { Güç: "240 AW", "Kullanım Tipi": "Dikey", Şarjlı: "Evet" },
          },
        ],
      },
    ],
  },
  {
    name: "Moda",
    children: [
      {
        name: "Kadın Giyim",
        attributes: ["Beden", "Renk", "Kumaş Tipi", "Kalıp"],
        products: [
          {
            name: "Çiçekli Yazlık Elbise",
            brand: "Zara",
            price: 1200,
            specs: {
              Beden: "M",
              Renk: "Kırmızı",
              "Kumaş Tipi": "Viskon",
              Kalıp: "Rahat Kesim",
            },
          },
        ],
      },
      {
        name: "Erkek Giyim",
        attributes: ["Beden", "Renk", "Kumaş Tipi", "Yaka Tipi"],
        products: [
          {
            name: "Slim Fit Gömlek",
            brand: "Mavi",
            price: 900,
            specs: {
              Beden: "L",
              Renk: "Beyaz",
              "Kumaş Tipi": "Pamuk",
              "Yaka Tipi": "Klasik",
            },
          },
        ],
      },
      {
        name: "Ayakkabı & Çanta",
        attributes: ["Numara", "Materyal", "Kullanım Alanı"],
        products: [
          {
            name: "Air Jordan 1",
            brand: "Nike",
            price: 5500,
            specs: {
              Numara: "43",
              Materyal: "Deri",
              "Kullanım Alanı": "Günlük",
            },
          },
        ],
      },
      {
        name: "Spor Giyim",
        attributes: ["Beden", "Spor Dalı", "Teknoloji"],
        products: [
          {
            name: "Dri-Fit Tişört",
            brand: "Nike",
            price: 850,
            specs: {
              Beden: "M",
              "Spor Dalı": "Koşu",
              Teknoloji: "Nefes Alabilir",
            },
          },
        ],
      },
    ],
  },
  {
    name: "Ev, Yaşam, Kırtasiye, Ofis",
    children: [
      {
        name: "Mobilya",
        attributes: ["Malzeme", "Renk", "Genişlik", "Yükseklik"],
        products: [
          {
            name: "Modern Çalışma Masası",
            brand: "Ikea",
            price: 4500,
            specs: {
              Malzeme: "Ahşap",
              Renk: "Meşe",
              Genişlik: "120 cm",
              Yükseklik: "75 cm",
            },
          },
        ],
      },
      {
        name: "Ev Tekstili",
        attributes: ["Kumaş", "Boyut", "Parça Sayısı"],
        products: [
          {
            name: "Çift Kişilik Nevresim Takımı",
            brand: "Karaca Home",
            price: 1500,
            specs: {
              Kumaş: "Pamuk Saten",
              Boyut: "200x220",
              "Parça Sayısı": "4 Parça",
            },
          },
        ],
      },
      {
        name: "Ofis & Kırtasiye",
        attributes: ["Tür", "Renk"],
        products: [
          {
            name: "Ergonomik Ofis Koltuğu",
            brand: "Adore",
            price: 3200,
            specs: { Tür: "Yönetici Koltuğu", Renk: "Siyah" },
          },
        ],
      },
    ],
  },
  {
    name: "Anne, Bebek, Oyuncak",
    children: [
      {
        name: "Anne Bebek Ürünleri",
        attributes: ["Yaş Aralığı", "Malzeme", "Kapasite"],
        products: [
          {
            name: "Elektronik Göğüs Pompası",
            brand: "Philips Avent",
            price: 3500,
            specs: {
              "Yaş Aralığı": "0+ Ay",
              Malzeme: "BPA İçermez",
              Kapasite: "Tekli",
            },
          },
        ],
      },
      {
        name: "Bebek Arabaları",
        attributes: ["Taşıma Kapasitesi", "Tekerlek Sayısı", "Katlanabilir"],
        products: [
          {
            name: "Travel Sistem Bebek Arabası",
            brand: "Kraft",
            price: 15000,
            specs: {
              "Taşıma Kapasitesi": "20 kg",
              "Tekerlek Sayısı": "4",
              Katlanabilir: "Evet",
            },
          },
        ],
      },
      {
        name: "Oyuncaklar",
        attributes: ["Yaş Grubu", "Tür", "Parça Sayısı"],
        products: [
          {
            name: "Lego City Polis Merkezi",
            brand: "Lego",
            price: 2800,
            specs: {
              "Yaş Grubu": "6+ Yaş",
              Tür: "Yapı Seti",
              "Parça Sayısı": "500+",
            },
          },
        ],
      },
    ],
  },
  {
    name: "Oto, Bahçe, Yapı Market",
    children: [
      {
        name: "Oto Aksesuar",
        attributes: ["Uyumlu Model", "Materyal"],
        products: [
          {
            name: "3D Havuzlu Paspas",
            brand: "Kervan Auto",
            price: 1200,
            specs: { "Uyumlu Model": "Universal", Materyal: "Kauçuk" },
          },
        ],
      },
      {
        name: "Yapı Market",
        attributes: ["Güç", "Akü Voltajı", "Mandren Çapı"],
        products: [
          {
            name: "Akülü Vidalama",
            brand: "Bosch",
            price: 3500,
            specs: {
              Güç: "Kablosuz",
              "Akü Voltajı": "18V",
              "Mandren Çapı": "10mm",
            },
          },
        ],
      },
    ],
  },
  {
    name: "Spor, Outdoor",
    children: [
      {
        name: "Spor Aletleri",
        attributes: ["Ağırlık", "Fonksiyon"],
        products: [
          {
            name: "Ayarlanabilir Dambıl Seti",
            brand: "Kervan Sport",
            price: 1800,
            specs: { Ağırlık: "10 kg", Fonksiyon: "Kas Geliştirme" },
          },
        ],
      },
      {
        name: "Kamp Malzemeleri",
        attributes: ["Kişi Sayısı", "Mevsim", "Su Geçirmezlik"],
        products: [
          {
            name: "4 Kişilik Otomatik Çadır",
            brand: "Quechua",
            price: 4500,
            specs: {
              "Kişi Sayısı": "4",
              Mevsim: "3 Mevsim",
              "Su Geçirmezlik": "3000mm",
            },
          },
        ],
      },
    ],
  },
  {
    name: "Kozmetik, Kişisel Bakım",
    children: [
      {
        name: "Kozmetik",
        attributes: ["Cilt Tipi", "Hacim", "Etki"],
        products: [
          {
            name: "Nemlendirici Yüz Kremi",
            brand: "La Roche Posay",
            price: 650,
            specs: {
              "Cilt Tipi": "Hassas",
              Hacim: "50ml",
              Etki: "Yatıştırıcı",
            },
          },
        ],
      },
      {
        name: "Kişisel Bakım",
        attributes: ["Cihaz Tipi", "Başlık Sayısı"],
        products: [
          {
            name: "Tıraş Makinesi",
            brand: "Braun",
            price: 2200,
            specs: { "Cihaz Tipi": "Şarjlı", "Başlık Sayısı": "3" },
          },
        ],
      },
    ],
  },
  {
    name: "Kitap, Müzik, Hobi",
    children: [
      {
        name: "Kitap",
        attributes: ["Yazar", "Sayfa Sayısı", "Basım Dili"],
        products: [
          {
            name: "Suç ve Ceza",
            brand: "İş Bankası Yayınları",
            price: 180,
            specs: {
              Yazar: "Dostoyevski",
              "Sayfa Sayısı": "687",
              "Basım Dili": "Türkçe",
            },
          },
        ],
      },
      {
        name: "Hobi & Oyun",
        attributes: ["Tür", "Oyuncu Sayısı"],
        products: [
          {
            name: "Monopoly Emlak Ticareti Oyunu",
            brand: "Hasbro",
            price: 900,
            specs: { Tür: "Kutu Oyunu", "Oyuncu Sayısı": "2-6" },
          },
        ],
      },
    ],
  },
];

async function main() {
  console.log("🌱 Tohumlama Başlatılıyor...");

  // 1. ADMIN USER
  // Varsayılan admin kullanıcısını oluşturur.
  const password = await hash("admin12345", 12);
  await prisma.user.upsert({
    where: { email: "admin@kervanpazar.com" },
    update: {},
    create: {
      email: "admin@kervanpazar.com",
      firstName: "Admin",
      lastName: "User",
      passwordHash: password,
      role: Role.ADMIN,
    },
  });
  console.log("👤 Admin Kullanıcısı Hazır.");

  // 2. KATEGORİ - ÖZELLİK - MARKA - ÜRÜN DÖNGÜSÜ
  // categoriesData dizisindeki tüm verileri sırayla işler
  for (const parentCat of categoriesData) {
    // --- Ana Kategori Oluştur ---
    const parentSlug = createSlug(parentCat.name);
    const parentCategory = await prisma.category.upsert({
      where: { slug: parentSlug },
      update: {},
      create: { name: parentCat.name, slug: parentSlug },
    });
    console.log(`📂 Ana Kategori: ${parentCat.name}`);

    // --- Alt Kategorileri Dön ---
    for (const childCat of parentCat.children) {
      const childSlug = createSlug(childCat.name);

      // Alt Kategoriyi Oluştur (Parent ID ile bağla)
      const childCategory = await prisma.category.upsert({
        where: { slug: childSlug },
        update: { parentId: parentCategory.id },
        create: {
          name: childCat.name,
          slug: childSlug,
          parentId: parentCategory.id,
        },
      });

      // --- Özellikleri (Attributes) Oluştur ve ID'lerini Sakla ---
      const createdAttributes: Record<string, string> = {};

      if (childCat.attributes) {
        for (const attrName of childCat.attributes) {
          // Bu kategoride bu özellik zaten var mı?
          const existingAttr = await prisma.attribute.findFirst({
            where: {
              name: attrName,
              categoryId: childCategory.id,
            },
          });

          let attrId = existingAttr?.id;

          if (!attrId) {
            const newAttr = await prisma.attribute.create({
              data: {
                name: attrName,
                categoryId: childCategory.id, // Özelliği alt kategoriye bağlıyoruz
              },
            });
            attrId = newAttr.id;
          }
          createdAttributes[attrName] = attrId;
        }
      }

      // --- Ürünleri Ekle ---
      if (childCat.products) {
        for (const prod of childCat.products) {
          // 1. Markayı Oluştur/Bul
          const brandSlug = createSlug(prod.brand);
          const brand = await prisma.brand.upsert({
            where: { slug: brandSlug },
            update: {},
            create: { name: prod.brand, slug: brandSlug },
          });

          // 2. Ürünü Oluştur
          // Slug çakışmasını önlemek için rastgele sayı ekliyoruz
          const productSlug = createSlug(
            `${prod.name}-${Math.floor(Math.random() * 10000)}`
          );

          const createdProduct = await prisma.product.create({
            data: {
              name: prod.name,
              id: productSlug,
              description: `${prod.name} - ${prod.brand} kalitesiyle ${childCat.name} kategorisinde.`,
              price: prod.price,
              stock: 50,
              isActive: true,
              categoryId: childCategory.id,
              brandId: brand.id,
              // Görsel zorunlu olduğu için placeholder kullanıyoruz
              images: {
                create: [{ url: "/uploads/placeholder.jpg", isMain: true }],
              },
              // Varsayılan bir varyant ekliyoruz
              variants: {
                create: [{ name: "Standart", stock: 50, price: prod.price }],
              },
            },
          });

          // 3. Ürün Özellik Değerlerini (Specs) Gir
          if (prod.specs) {
            for (const [key, value] of Object.entries(prod.specs)) {
              const attributeId = createdAttributes[key];

              if (attributeId) {
                await prisma.productAttributeValue.create({
                  data: {
                    productId: createdProduct.id,
                    attributeId: attributeId,
                    value: value,
                  },
                });
              }
            }
          }
        }
      }
      console.log(`   └─ ✅ Alt Kategori Hazır: ${childCat.name}`);
    }
  }

  console.log(
    "🚀 TÜM SİSTEM KURULDU! Dükkanın rafları, etiketleri ve ürünleri hazır."
  );
}

main()
  .catch((e) => {
    console.error("❌ Hata oluştu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
