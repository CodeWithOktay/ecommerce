/**
 * Veritabanı Tohumlama (Seeding) Betiği
 * 
 * Bu script, geliştirme ve test ortamları için gerekli başlangıç verilerini oluşturur:
 * - Admin kullanıcısı
 * - Kategoriler (Hiyerarşik: Ana ve Alt kategoriler)
 * - Ürün Özellikleri (Attributes)
 * 
 * NOT: Sahte ürün verileri temizlenmiştir.
 */

import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";
import slugify from "slugify";

const prisma = new PrismaClient();

// Türkçe karakter destekli slug oluşturucu yardımcı fonksiyon
const createSlug = (text: string) =>
  slugify(text, { lower: true, strict: true, locale: "tr" });

// 🛠️ ÖRNEK VERİ SETİ (Sadece Kategori ve Özellikler)
const categoriesData = [
  {
    name: "Elektronik",
    children: [
      {
        name: "Bilgisayar",
        attributes: [
          "İşlemci",
          "RAM",
          "Ekran Kartı",
          "Depolama",
          "Ekran Boyutu",
          "İşletim Sistemi",
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
      },
      {
        name: "TV & Ses Sistemleri",
        attributes: ["Ekran Boyutu", "Çözünürlük", "Smart TV", "Panel Tipi"],
      },
      {
        name: "Beyaz Eşya",
        attributes: ["Enerji Sınıfı", "Kapasite", "Program Sayısı", "Renk"],
      },
      {
        name: "Elektrikli Ev Aletleri",
        attributes: ["Güç", "Kullanım Tipi", "Şarjlı"],
      },
    ],
  },
  {
    name: "Moda",
    children: [
      {
        name: "Kadın Giyim",
        attributes: ["Beden", "Renk", "Kumaş Tipi", "Kalıp"],
      },
      {
        name: "Erkek Giyim",
        attributes: ["Beden", "Renk", "Kumaş Tipi", "Yaka Tipi"],
      },
      {
        name: "Ayakkabı & Çanta",
        attributes: ["Numara", "Materyal", "Kullanım Alanı"],
      },
      {
        name: "Spor Giyim",
        attributes: ["Beden", "Spor Dalı", "Teknoloji"],
      },
    ],
  },
  {
    name: "Ev, Yaşam, Kırtasiye, Ofis",
    children: [
      {
        name: "Mobilya",
        attributes: ["Malzeme", "Renk", "Genişlik", "Yükseklik"],
      },
      {
        name: "Ev Tekstili",
        attributes: ["Kumaş", "Boyut", "Parça Sayısı"],
      },
      {
        name: "Ofis & Kırtasiye",
        attributes: ["Tür", "Renk"],
      },
    ],
  },
  {
    name: "Anne, Bebek, Oyuncak",
    children: [
      {
        name: "Anne Bebek Ürünleri",
        attributes: ["Yaş Aralığı", "Malzeme", "Kapasite"],
      },
      {
        name: "Bebek Arabaları",
        attributes: ["Taşıma Kapasitesi", "Tekerlek Sayısı", "Katlanabilir"],
      },
      {
        name: "Oyuncaklar",
        attributes: ["Yaş Grubu", "Tür", "Parça Sayısı"],
      },
    ],
  },
  {
    name: "Oto, Bahçe, Yapı Market",
    children: [
      {
        name: "Oto Aksesuar",
        attributes: ["Uyumlu Model", "Materyal"],
      },
      {
        name: "Yapı Market",
        attributes: ["Güç", "Akü Voltajı", "Mandren Çapı"],
      },
    ],
  },
  {
    name: "Spor, Outdoor",
    children: [
      {
        name: "Spor Aletleri",
        attributes: ["Ağırlık", "Fonksiyon"],
      },
      {
        name: "Kamp Malzemeleri",
        attributes: ["Kişi Sayısı", "Mevsim", "Su Geçirmezlik"],
      },
    ],
  },
  {
    name: "Kozmetik, Kişisel Bakım",
    children: [
      {
        name: "Kozmetik",
        attributes: ["Cilt Tipi", "Hacim", "Etki"],
      },
      {
        name: "Kişisel Bakım",
        attributes: ["Cihaz Tipi", "Başlık Sayısı"],
      },
    ],
  },
  {
    name: "Kitap, Müzik, Hobi",
    children: [
      {
        name: "Kitap",
        attributes: ["Yazar", "Sayfa Sayısı", "Basım Dili"],
      },
      {
        name: "Hobi & Oyun",
        attributes: ["Tür", "Oyuncu Sayısı"],
      },
    ],
  },
];

async function main() {
  console.log("🌱 Tohumlama Başlatılıyor (Ürünler Hariç)...");

  // 1. ADMIN USER
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
  const password = await hash(adminPassword, 12);
  
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

  // 2. KATEGORİ - ÖZELLİK DÖNGÜSÜ
  for (const parentCat of categoriesData) {
    // --- Ana Kategori ---
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

      const childCategory = await prisma.category.upsert({
        where: { slug: childSlug },
        update: { parentId: parentCategory.id },
        create: {
          name: childCat.name,
          slug: childSlug,
          parentId: parentCategory.id,
        },
      });

      // --- Özellikleri Oluştur ---
      if (childCat.attributes) {
        for (const attrName of childCat.attributes) {
          const existingAttr = await prisma.attribute.findFirst({
            where: {
              name: attrName,
              categoryId: childCategory.id,
            },
          });

          if (!existingAttr) {
            await prisma.attribute.create({
              data: {
                name: attrName,
                categoryId: childCategory.id,
              },
            });
          }
        }
      }
      console.log(`   └─ ✅ Alt Kategori Hazır: ${childCat.name}`);
    }
  }

  console.log(
    "🚀 SİSTEM KURULDU! Kategoriler ve admin kullanıcısı hazır. (Ürün eklenmedi)"
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
