import { prisma } from "@/lib/db";
import { compare } from "bcryptjs"; // 🟢 bcrypt yerine bcryptjs kullanmanı öneririm (uyumluluk için)

export const authenticateUser = async (
  emailInput: string,
  passwordInput: string
) => {
  try {
    // 1. 🟢 KRİTİK: Email'i normalize et (Küçük harf yap ve boşlukları at)
    const normalizedEmail = emailInput.toLowerCase().trim();

    // 2. Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // 3. Kullanıcı yoksa veya şifresi atanmamışsa (Google ile kayıt olmuş olabilir)
    if (!user || !user.passwordHash) {
      console.log(`❌ Kullanıcı bulunamadı veya şifresiz: ${normalizedEmail}`);
      return null;
    }

    // 4. Kullanıcı aktif mi kontrolü (Şemanda isActive var, kullanmalısın kral)
    if (!user.isActive) {
      console.log(`🚫 Pasif kullanıcı giriş denemesi: ${normalizedEmail}`);
      return null;
    }

    // 5. Şifreyi Kontrol Et
    const isPasswordValid = await compare(passwordInput, user.passwordHash);

    if (!isPasswordValid) {
      console.log(`🔑 Hatalı şifre denemesi: ${normalizedEmail}`);
      return null;
    }

    // 6. Başarılı! Şifreyi silip kullanıcıyı döndür
    const { passwordHash, ...userWithoutPassword } = user;

    console.log(`✅ Giriş Başarılı: ${user.email} (Rol: ${user.role})`);
    return userWithoutPassword;
  } catch (error) {
    console.error("🔥 Kimlik doğrulama servisi hatası:", error);
    return null;
  }
};
