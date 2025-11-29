// prisma/seed.ts
// Veritabanı seed (tohumlama) dosyası - Başlangıç verilerini oluşturur

import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";

// Prisma Client instance'ı oluştur
const prisma = new PrismaClient();

// Ana seed fonksiyonu
async function main() {
  // Güvenli bir şifre belirleyip hash'liyoruz
  // 'admin12345' şifresini 12 round ile hash'liyoruz
  const password = await hash("admin12345", 12);

  // Veritabanında admin kullanıcısı var mı diye kontrol edip, yoksa oluşturuyoruz
  // upsert metodu: eğer kullanıcı varsa günceller, yoksa oluşturur
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@kervanpazar.com" }, // Benzersiz email ile kontrol
    update: {}, // Eğer kullanıcı varsa, herhangi bir güncelleme yapma (boş bırak)
    create: {
      email: "admin@kervanpazar.com", // Admin email adresi
      firstName: "Admin", // Admin kullanıcı adı
      passwordHash: password, // Hash'lenmiş şifre
      role: Role.ADMIN, // Rolünü ADMIN olarak atıyoruz
    },
  });

  console.log("Admin user has been created successfully:", adminUser);
}

// Seed işlemini başlat
main()
  .catch((e) => {
    // Hata durumunda logla ve process'i sonlandır
    console.error("Seed işlemi sırasında hata oluştu:", e);
    process.exit(1); // Hata kodu 1 ile çık
  })
  .finally(async () => {
    // İşlem tamamlandığında Prisma bağlantısını kapat
    await prisma.$disconnect();
  });
