import type { Role } from "@prisma/client";
import type { JWT } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Next.js middleware fonksiyonu - her request'ten önce çalışır
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as (JWT & { role: Role }) | null;
    const isAdmin = token?.role === "ADMIN";

    // ✅ ADMIN ROUTE KONTROLÜ - /admin ile başlayan tüm route'lar
    if (req.nextUrl.pathname.startsWith("/admin")) {
      // Token yoksa (kullanıcı giriş yapmamışsa) login sayfasına yönlendir
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      // Kullanıcı ADMIN değilse yetkisiz sayfasına yönlendir
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
      }
    }

    // Tüm kontroller başarılıysa request'i devam ettir
    return NextResponse.next();
  },
  {
    // Yetkilendirme callback'i - withAuth için gerekli
    callbacks: {
      authorized: ({ token, req }) => {
        // ✅ ADMIN ROUTE YETKİLENDİRMESİ
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token;
        }
        // Diğer tüm route'lar için erişime izin ver
        return true;
      },
    },
  }
);

// Middleware'in çalışacağı route pattern'larını belirle
export const config = {
  matcher: [
    "/admin/:path*", // ✅ /admin ve altındaki tüm route'lar
    "/user/profile:path*",
    "/user/orders:path*",
    "/api/admin/:path*", // ✅ /api/admin ve altındaki tüm API route'ları
  ],
};
