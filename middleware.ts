/**
 * Next.js Middleware
 * 
 * Bu dosya, tüm HTTP isteklerini karşılar ve yönlendirme kurallarını uygular:
 * - Kimlik doğrulama kontrolü (Oturum var mı?)
 * - Rol tabanlı erişim kontrolü (Admin mi?)
 * - Sayfa koruması (Giriş yapmamış kullanıcıyı login'e yönlendirme)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  const isAdminPath = pathname.startsWith("/admin");
  const isAccountPath = pathname.startsWith("/account");
  const isAuthPath = pathname.startsWith("/login") || pathname.startsWith("/register");

  // 1️⃣ GİRİŞ YAPMIŞ KULLANICI YÖNLENDİRMESİ
  if (isAuthPath && token) {
    const isAdminUser = token.role === "ADMIN" || token.role === "SUPER_ADMIN";
    return NextResponse.redirect(
      new URL(isAdminUser ? "/admin/dashboard" : "/", req.url)
    );
  }

  // 2️⃣ ADMIN PANELİ KORUMASI
  if (isAdminPath) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (token.role !== "ADMIN" && token.role !== "SUPER_ADMIN") {
       return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 3️⃣ HESAP SAYFALARI KORUMASI
  if (isAccountPath && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Statik dosyaları ve API rotalarını hariç tut
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(png|svg|jpg|jpeg|webp)).*)",
  ],
};
