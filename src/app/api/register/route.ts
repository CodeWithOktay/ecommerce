// src/app/api/register/route.ts
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
// Prisma client'ını lib klasöründen import et (varsayılan yol)
import prisma from '@/lib/prisma-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, password } = body;

    if (!email || !password || !firstName || !lastName) {
      return new NextResponse('Tüm alanlar doldurulmalı', { status: 400 });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return new NextResponse('Bu e-posta zaten kullanımda', { status: 409 });
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 12);

    // Yeni kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash: hashedPassword,
      },
    });

    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('[REGISTER_POST_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
