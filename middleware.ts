import type { Role } from '@prisma/client';
import type { JWT } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as (JWT & { role: Role }) | null;
    const isAdmin = token?.role === 'ADMIN';

    // ✅ MEVCUT YAPINIZA GÖRE ADMIN ROUTE'LARI
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }

      // Admin rol kontrolü
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // ✅ MEVCUT YAPINIZA GÖRE
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*', // ✅ MEVCUT YAPINIZA GÖRE
    '/api/admin/:path*',
  ],
};
