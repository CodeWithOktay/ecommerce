import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma-client";

/**
 * NextAuth Yapılandırma Seçenekleri
 *
 * Kimlik doğrulama sistemi için gerekli ayarlar ve provider'lar
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" }, // Email alanı
        password: { label: "Password", type: "password" }, // Şifre alanı
      },
      // Kullanıcı doğrulama fonksiyonu
      async authorize(credentials) {
        // Email ve şifre kontrolü
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Veritabanından kullanıcıyı bul
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Kullanıcı veya şifre hash'i yoksa
        if (!user || !user.passwordHash) {
          return null; // Yetkilendirme başarısız
        }

        // Şifre doğrulama - bcrypt ile hash karşılaştırma
        const isPasswordValid = await compare(
          credentials.password,
          user.passwordHash
        );

        // Şifre yanlışsa
        if (!isPasswordValid) {
          return null; // Yetkilendirme başarısız
        }

        // Başarılı giriş - kullanıcı bilgilerini döndür
        return {
          id: user.id,
          email: user.email,
          name: user.firstName
            ? `${user.firstName} ${user.lastName}`
            : user.email,
          role: user.role,
        };
      },
    }),
  ],
  // Auth callback'leri - token ve session özelleştirme
  callbacks: {
    // JWT token callback - token oluşturulurken/güncellenirken
    async jwt({ token, user }) {
      // İlk girişte kullanıcı bilgilerini token'a ekle
      if (user) {
        token.id = user.id; // Kullanıcı ID'si
        token.role = user.role; // Kullanıcı rolü
      }
      return token;
    },
    // Session callback - session oluşturulurken
    async session({ session, token }) {
      // Token'daki bilgileri session'a ekle
      if (session.user) {
        session.user.id = token.id; // Kullanıcı ID'si
        session.user.role = token.role; // Kullanıcı rolü
      }
      return session;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
