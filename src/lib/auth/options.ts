// src/lib/auth/options.ts (veya senin dosya yolun)

import { Role, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// 'prisma' import yolunu kendi projenize göre (örn: '@/lib/prisma-client') ayarlayın
import { prisma } from '../prisma-client';

// NextAuth yapılandırma ayarları
export const authOptions: NextAuthOptions = {
  // Kimlik doğrulama sağlayıcıları
  providers: [
    // Credentials (email/şifre) sağlayıcısı
    CredentialsProvider({
      name: 'credentials', // Sağlayıcı adı
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // Kullanıcı doğrulama fonksiyonu
      async authorize(credentials) {
        // Email ve şifre kontrolü
        if (!credentials?.email || !credentials?.password) {
          return null; // Eksik bilgi durumunda null döndür
        }

        try {
          // Veritabanından kullanıcıyı bulma
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase().trim() },
          });

          // Kullanıcı veya şifre hash'i yoksa
          if (!user || !user.passwordHash) {
            return null; // Yetkilendirme başarısız
          }

          // Şifre doğrulama
          const isPasswordValid = await bcrypt.compare(
            credentials.password, // Giriş yapılan şifre
            user.passwordHash // Veritabanındaki hash'lenmiş şifre
          );

          // Şifre doğruysa kullanıcı bilgilerini döndür
          if (isPasswordValid) {
            // --- GÜNCELLEME BURADA ---
            // 'name' alanı artık veritabanında yok.
            // Onu 'firstName' ve 'lastName' alanlarından bizim oluşturmamız gerekiyor.
            return {
              id: user.id,
              email: user.email,
              // name: user.name, // <-- ESKİSİ
              name: `${user.firstName} ${user.lastName}`, // <-- YENİSİ
              role: user.role,
              image: user.image, // image'ı da ekleyelim
            };
          }

          return null; // Şifre yanlışsa null döndür
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],

  // Auth callback'leri
  callbacks: {
    // JWT token callback'i - token oluşturulurken/güncellenirken çalışır
    jwt: async ({ token, user }) => {
      // İlk girişte (user objesi varken) kullanıcı bilgilerini token'a ekle
      if (user) {
        token.role = (user as User).role; // 'user' tipini User olarak cast et
        token.id = user.id;
        // --- GÜNCELLEME BURADA ---
        // 'name' alanını da token'a ekleyelim ki session'a aktarılabilsin
        token.name = user.name;
      }
      return token; // Güncellenmiş token'ı döndür
    },

    // Session callback'i - session oluşturulurken çalışır
    session: async ({ session, token }) => {
      // Token'daki bilgileri session'a ekle
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        // --- GÜNCELLEME BURADA ---
        // NextAuth varsayılan olarak 'name'i token'dan alır,
        // ama biz yine de garantileyelim.
        if (token.name) {
          session.user.name = token.name;
        }
      }
      return session; // Güncellenmiş session'ı döndür
    },
  },

  // Özel sayfa yolları
  pages: {
    signIn: '/admin/login', // Özel admin giriş sayfası yolu
    // Normal kullanıcı girişi '/login' olacak (NextAuth varsayılanı)
  },

  // Session stratejisi
  session: {
    strategy: 'jwt', // JWT tabanlı session kullan
  },
};
