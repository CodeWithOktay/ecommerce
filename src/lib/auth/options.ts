// src/lib/auth/options.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import prisma from "@/lib/db";
import { authenticateUser } from "./auth.service"; // Güvenli servis
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
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
          throw new Error("Lütfen tüm alanları doldurun.");
        }

        const user = await authenticateUser(
          credentials.email,
          credentials.password
        );

        if (!user) {
          throw new Error("Geçersiz e-posta veya şifre"); // Genel mesaj
        }

        // NextAuth tipleriyle uyumlu
        return {
          id: user.id,
          email: user.email ?? "",
          name: user.firstName
            ? `${user.firstName} ${user.lastName}`
            : (user.email ?? ""),
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Kullanıcı sadece girişte gelir, token’a işliyoruz
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
  debug: process.env.NODE_ENV === "development",
};
