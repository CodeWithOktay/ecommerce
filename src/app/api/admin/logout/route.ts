import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'çıkış başarılı' },
      { status: 200 }
    );

    response.cookies.set('admin-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/admin/login',
    });

    response.cookies.set('admin-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/admin/login',
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'çıkış sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
