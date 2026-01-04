/**
 * NextAuth Yapılandırması
 * 
 * Bu dosya, uygulamanın kimlik doğrulama sistemini yönetir.
 * - Rol tabanlı erişim kontrolü (ADMIN/USER)
 * - Şifre doğrulama ve güvenlik
 * - Denetim günlüğü (audit log) entegrasyonu
 * - JWT token yönetimi
 */

import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../db";
import { createLog } from "@/lib/logger"; 

/**
 * NextAuth Yapılandırma Seçenekleri
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login Type", type: "text" }, // "USER" veya "ADMIN"
      },
      /**
       * Kullanıcı Kimlik Doğrulama Fonksiyonu
       * 
       * Giriş bilgilerini doğrular ve güvenlik kontrollerini yapar:
       * 1. Kullanıcı var mı kontrol eder
       * 2. Admin/User portal ayrımını kontrol eder
       * 3. Şifre doğrulaması yapar
       * 4. Tüm işlemleri audit log'a kaydeder
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-posta ve şifre gereklidir.");
        }

        const email = credentials.email.toLowerCase().trim();

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          // 1. Kullanıcı Bulunamadı Kontrolü
          if (!user || !user.passwordHash) {
            await createLog({
              action: "LOGIN_FAILED",
              details: `Kullanıcı bulunamadı: ${email}`,
              success: false,
            });
            throw new Error("Kullanıcı bulunamadı.");
          }

          // 2. Admin Gizliliği Kontrolü
          // Admin kullanıcılar müşteri portalından giriş yapamaz
          if (credentials.loginType === "USER") {
            if (user.role === "ADMIN") {
              await createLog({
                action: "WRONG_PORTAL",
                details: `Admin hesabı (${email}) müşteri panelinden girmeye çalıştı.`,
                success: false,
              });
              throw new Error("Kullanıcı bulunamadı."); // Güvenlik için genel hata
            }
          }

          // 3. Yetkisiz Erişim Kontrolü
          // Normal kullanıcılar admin paneline erişemez
          if (credentials.loginType === "ADMIN") {
            if (user.role !== "ADMIN") {
              await createLog({
                action: "UNAUTHORIZED_ACCESS",
                details: `Yetkisiz Admin Paneli Erişimi Denemesi: ${email}`,
                success: false,
              });
              throw new Error("Bu alana erişim yetkiniz yok.");
            }
          }

          // 4. Şifre Doğrulama
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isPasswordValid) {
            await createLog({
              action: "LOGIN_FAILED",
              details: `Hatalı şifre denemesi: ${email}`,
              success: false,
            });
            throw new Error("Geçersiz şifre.");
          }

          // Giriş Başarılı - Kullanıcı bilgilerini döndür
          return {
            id: user.id,
            email: user.email,
            name:
              [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              user.email?.split("@")[0] ||
              "User",
            role: user.role,
            image: user.image || null,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
          };
        } catch (error) {
          // Hataları NextAuth'a ilet
          throw error;
        }
      },
    }),
  ],

  /**
   * NextAuth Olayları (Events)
   * Başarılı giriş/çıkış işlemlerini audit log'a kaydeder
   */
  events: {
    /**
     * Giriş Başarılı Olayı
     * Kullanıcı başarıyla giriş yaptığında tetiklenir
     */
    async signIn({ user }) {
      const role = user.role;
      const action = role === "ADMIN" ? "ADMIN_LOGIN" : "USER_LOGIN";

      await createLog({
        action: action,
        details: `${user.email} başarıyla giriş yaptı.`,
        success: true,
      });
    },
    /**
     * Çıkış Olayı
     * Kullanıcı çıkış yaptığında tetiklenir
     */
    async signOut({ token }) {
      await createLog({
        action: "LOGOUT",
        details: `Kullanıcı (${token?.email || "Bilinmiyor"}) çıkış yaptı.`,
        success: true,
      });
    },
  },

  /**
   * NextAuth Callback Fonksiyonları
   * JWT token ve session yönetimi
   */
  callbacks: {
    /**
     * JWT Callback
     * Token oluşturulurken kullanıcı bilgilerini token'a ekler
     */
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },

    /**
     * Session Callback
     * Client tarafında kullanılacak session nesnesini oluşturur
     */
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.name = token.name as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    },
  },

  /**
   * Özel Sayfa Yönlendirmeleri
   */
  pages: {
    signIn: "/login",      // Giriş sayfası
    error: "/login",       // Hata sayfası
  },

  /**
   * Session Yapılandırması
   * JWT stratejisi kullanılır (veritabanı session'ı yerine)
   */
  session: {
    strategy: "jwt",
  },

  /**
   * NextAuth Gizli Anahtarı
   * Token şifreleme için kullanılır
   */
  secret: process.env.NEXTAUTH_SECRET,
};
