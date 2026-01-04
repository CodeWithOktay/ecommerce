import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/options"; // Ayarları buradan çekiyoruz

/**
 * NextAuth Yapılandırması
 * 
 * Tüm kimlik doğrulama işlemlerini (Giriş, Çıkış, Session vb.) yöneten ana API route.
 * - `authOptions` dosyasındaki kurallara göre çalışır.
 * - Hem GET hem POST isteklerini karşılar.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
