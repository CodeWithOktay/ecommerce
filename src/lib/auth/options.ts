import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/db";
import { authenticateUser } from "./auth.service";
import { Role } from "@prisma/client";

import { createLog } from "@/lib/logger";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET, // .env dosyasında olduğundan emin ol!
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  pages: {
    signIn: "/login",
    error: "/login", // Hata durumunda login sayfasına at
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Basit validasyon
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Lütfen e-posta ve şifrenizi girin.");
        }

        // 2. Servis üzerinden kullanıcıyı doğrula
        // (Servisin null veya user objesi döndüğünden emin ol)
        const user = await authenticateUser(
          credentials.email,
          credentials.password
        );

        if (!user) {
          // LOG: Başarısız Giriş Denemesi
          await createLog({
            action: "LOGIN_FAILED",
            details: `Hatalı şifre veya e-posta denemesi: ${credentials.email}`,
            success: false,
            role: "UNKNOWN",
            email: credentials.email,
            metadata: { email: credentials.email, reason: "Invalid Credentials" }
          });
          
          // Buradaki hata mesajı login sayfasında ?error=CredentialsSignin olarak görünür
          throw new Error("E-posta veya şifre hatalı.");
        }

        // 3. Kullanıcı Pasif mi? (Ekstra Güvenlik)
        if (user.isActive === false) {
           // LOG: Engelli Kullanıcı Giriş Denemesi
           await createLog({
            action: "LOGIN_BLOCKED",
            details: `Engellenmiş hesap giriş denemesi: ${credentials.email}`,
            success: false,
            role: user.role,
            email: user.email || undefined,
            userId: user.id,
            metadata: { email: credentials.email, userId: user.id }
          });
          throw new Error("Hesabınız devre dışı bırakılmıştır.");
        }

        // 4. Başarılı dönüş (User objesi oluşturuyoruz)
        return {
          id: user.id,
          email: user.email,
          name: user.firstName
            ? `${user.firstName} ${user.lastName}`
            : user.email,
          role: user.role as Role, // Rolü burada açıkça belirtiyoruz
          image: user.image, // Varsa resmi de ekle
        };
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      if (user) {
        // LOG: Başarılı Giriş
        await createLog({
          action: "LOGIN_SUCCESS",
          details: `${user.email} sisteme giriş yaptı.`,
          success: true,
          role: (user as { role?: string }).role || "USER",
          metadata: { userId: user.id, email: user.email }
        });
      }
    },
    async signOut({ session, token }) {
       // LOG: Çıkış
       // Not: session veya token burada undefined olabilir, kontrol etmek gerekir
       const email = session?.user?.email || token?.email;
       const id = session?.user?.id || token?.sub;
       
       if (email) {
          await createLog({
            action: "LOGOUT",
            details: `${email} çıkış yaptı.`,
            success: true,
            role: "USER", 
            email: email,
            userId: id || undefined, // null check
          });
       }
    },
    async createUser({ user }) {
      // LOG: Yeni Üye Kaydı
      await createLog({
        action: "REGISTER_SUCCESS",
        details: `Yeni kullanıcı kaydoldu: ${user.email}`,
        success: true,
        role: "USER",
        email: user.email || undefined,
        userId: user.id,
      });
    }
  },
  // 🔄 JWT Callback: Giriş anında çalışır, user verisini token'a yazar
  callbacks: {
    async jwt({ token, user }) {
      // Login anında çalışır
      if (user) {
        // console.log("🔥 [JWT Callback] User Rolü:", user.role); // Debug kaldırıldı
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("🔥 [Session Callback] Token Rolü:", token.role); // Debug kaldırıldı
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
