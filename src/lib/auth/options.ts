import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../prisma-client";
import { createLog } from "@/lib/logger"; // 👈 Log fonksiyonumuz

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-posta ve şifre gereklidir.");
        }

        const email = credentials.email.toLowerCase().trim();

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          // 🚨 1. KULLANICI BULUNAMADI
          if (!user || !user.passwordHash) {
            await createLog({
              action: "LOGIN_FAILED",
              details: `Kullanıcı bulunamadı: ${email}`,
              success: false,
            });
            throw new Error("Kullanıcı bulunamadı.");
          }

          // 🚨 2. ADMIN GİZLİLİĞİ (Admin, Müşteri Girişinden Giremesin)
          if (credentials.loginType === "USER") {
            if (user.role === "ADMIN") {
              // Admin müşteri kapısından girmeye çalışırsa logla ama kullanıcıya belli etme
              await createLog({
                action: "WRONG_PORTAL",
                details: `Admin hesabı (${email}) müşteri panelinden girmeye çalıştı.`,
                success: false,
              });
              throw new Error("Kullanıcı bulunamadı."); // Güvenlik için genel hata
            }
          }

          // 🚨 3. YETKİSİZ GİRİŞ (Müşteri, Admin Paneline Giremesin)
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

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          // 🚨 4. HATALI ŞİFRE
          if (!isPasswordValid) {
            await createLog({
              action: "LOGIN_FAILED",
              details: `Hatalı şifre denemesi: ${email}`,
              success: false,
            });
            throw new Error("Geçersiz şifre.");
          }

          // Giriş Başarılı (Burada loglamıyoruz, events kısmında logluyoruz)
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
          // Hataları olduğu gibi fırlat (NextAuth yakalasın diye)
          throw error;
        }
      },
    }),
  ],

  // ✅ EVENTLER: Başarılı işlemler burada loglanır (Token oluştuğunda)
  events: {
    async signIn({ user }) {
      const role = user.role;
      const action = role === "ADMIN" ? "ADMIN_LOGIN" : "USER_LOGIN";

      await createLog({
        action: action,
        details: `${user.email} başarıyla giriş yaptı.`,
        success: true,
      });
    },
    async signOut({ token }) {
      await createLog({
        action: "LOGOUT",
        details: `Kullanıcı (${token?.email || "Bilinmiyor"}) çıkış yaptı.`,
        success: true,
      });
    },
  },

  callbacks: {
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

    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
