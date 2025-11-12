import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Prisma client instance'ı oluştur
const prisma = new PrismaClient();

/**
 * NextAuth Yapılandırma Seçenekleri
 * 
 * Kimlik doğrulama sistemi için gerekli ayarlar ve provider'lar
 */
export const authOptions: NextAuthOptions = {
  // Prisma adapter - veritabanı işlemleri için
  adapter: PrismaAdapter(prisma),
  // Güvenlik secret'ı - environment variable'dan alınır
  secret: process.env.NEXTAUTH_SECRET,
  // Session stratejisi - JWT tabanlı
  session: {
    strategy: 'jwt',
  },
  // Özel sayfa yolları
  pages: {
    signIn: '/admin/login', // Özel giriş sayfası
  },
  // Kimlik doğrulama provider'ları
  providers: [
    // Email/şifre ile giriş provider'ı
    CredentialsProvider({
      name: 'Credentials', // Provider adı
      credentials: {
        email: { label: 'Email', type: 'email' }, // Email alanı
        password: { label: 'Password', type: 'password' }, // Şifre alanı
      },
      // Kullanıcı doğrulama fonksiyonu
      async authorize(credentials) {
        // Email ve şifre kontrolü
        if (!credentials?.email || !credentials.password) {
          return null; // Eksik bilgi
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
          name: user.name,
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
    // Yönlendirme callback - giriş sonrası yönlendirme
    async redirect({ url, baseUrl }) {
      // Admin dashboard'a yönlendir
      return `${baseUrl}/admin/dashboard`;
    },
  },
};

// NextAuth handler'ını oluştur ve export et
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };