import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 🔍 Debug (prod'da kaldır)
  console.log(
    `[Middleware] Path: ${pathname} | Auth: ${!!token} | Role: ${token?.role}`
  );

  const isAdminPath = pathname.startsWith("/admin");
  const isAccountPath = pathname.startsWith("/account");
  const isAuthPath =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // 🔐 Login / Register → girişliyse yönlendir
  if (isAuthPath && token) {
    return NextResponse.redirect(
      new URL(token.role === "ADMIN" ? "/admin/dashboard" : "/", req.url)
    );
  }

  // 🛡️ ADMIN KORUMASI
  if (isAdminPath) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 👤 ACCOUNT KORUMASI
  if (isAccountPath && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(png|svg|jpg|jpeg|webp)).*)",
  ],
};
