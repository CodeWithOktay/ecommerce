import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt"; // veya "bcryptjs"

const prisma = new PrismaClient();

async function main() {
  const email = "admin@kervanpazar.com";
  const passwordInput = "12345";

  console.log(`\n🔍 DETECTIVE MODU AÇILDI: ${email} aranıyor...`);

  // 1. Kullanıcıyı bul
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(
      "❌ HATA: Kullanıcı veritabanında HİÇ YOK! Seed komutunu çalıştırmamışsın veya hata vermiş."
    );
    return;
  }

  console.log("✅ Kullanıcı Veritabanında Mevcut.");
  console.log("📄 Kullanıcı Bilgileri (Şifre hariç):", {
    id: user.id,
    email: user.email,
    role: (user as any).role,
  });

  // 2. Şifre Alanını Kontrol Et
  // Senin modelinde 'password' mu yoksa 'passwordHash' mi var bakalım
  const userAny = user as any;
  const dbPassword = userAny.password || userAny.passwordHash;
  const fieldName = userAny.password
    ? "password"
    : userAny.passwordHash
      ? "passwordHash"
      : "YOK";

  console.log(`\n🔑 Şifre Alanı Tespiti: '${fieldName}'`);

  if (!dbPassword) {
    console.error("❌ HATA: Veritabanında şifre sütunu BOŞ veya ismi yanlış!");
    return;
  }

  // 3. Şifreyi Karşılaştır
  console.log("🔐 Şifre Doğrulanıyor ('12345' vs DB Hash)...");
  const isValid = await compare(passwordInput, dbPassword);

  if (isValid) {
    console.log("\n✅✅✅ MÜJDE! Şifre ve Hash %100 UYUŞUYOR!");
    console.log(
      "👉 SORUN BURADA DEĞİL: Sorun NextAuth ayarlarında (src/lib/auth.ts)."
    );
    console.log(
      "👉 NextAuth, veritabanındaki şifre alanının adını yanlış biliyor olabilir."
    );
  } else {
    console.log("\n❌❌❌ HATA: Şifre Uyuşmuyor!");
    console.log("👉 Veritabanındaki şifre '12345' değil.");
    console.log("👉 ÇÖZÜM: 'npx tsx prisma/seed.ts' komutunu tekrar çalıştır.");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
