import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/db";
import { authenticateUser } from "./auth.service";
import { Role } from "@prisma/client";

import { createLog } from "@/lib/logger";

// ... existing imports ...
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Lütfen e-posta ve şifrenizi girin.");
        }

        const user = await authenticateUser(
          credentials.email,
          credentials.password
        );

        if (!user) {
          await createLog({
            action: "LOGIN_FAILED",
            details: `Hatalı şifre veya e-posta denemesi: ${credentials.email}`,
            success: false,
            role: "UNKNOWN",
            email: credentials.email,
            metadata: { email: credentials.email, reason: "Invalid Credentials" }
          });
          throw new Error("E-posta veya şifre hatalı.");
        }

        if (user.isActive === false) {
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

        return {
          id: user.id,
          email: user.email,
          name: user.firstName
            ? `${user.firstName} ${user.lastName}`
            : user.email,
          role: user.role as Role,
          image: user.image,
        };
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (user) {
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
       const email = session?.user?.email || token?.email;
       const id = session?.user?.id || token?.sub;
       
       if (email) {
          await createLog({
            action: "LOGOUT",
            details: `${email} çıkış yaptı.`,
            success: true,
            role: "USER", 
            email: email,
            userId: id || undefined,
          });
       }
    },
    async createUser({ user }) {
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
  debug: process.env.NODE_ENV === "development",
};
