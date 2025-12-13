import { NextResponse } from "next/server";

/**
 * Çıkış API Route'u
 *
 * Admin kullanıcısının güvenli çıkış işlemini yönetir.
 * Cookie'leri temizleyerek oturumu sonlandırır.
 */
export async function POST() {
  try {
    // Başarılı yanıt oluştur
    const response = NextResponse.json(
      { message: "çıkış başarılı" }, // Başarı mesajı
      { status: 200 } // HTTP 200 OK
    );

    /**
     * Admin Token Cookie'sini Temizle
     * - httpOnly: XSS saldırılarına karşı koruma
     * - secure: Production'da HTTPS gerektirir
     * - sameSite: CSRF saldırılarına karşı koruma
     * - maxAge: 0 - cookie'yi hemen sonlandır
     * - path: Sadece /admin/login path'inde geçerli
     */
    response.cookies.set("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/admin/login",
    });

    /**
     * Admin Session Cookie'sini Temizle
     * Aynı güvenlik ayarları ile ikinci cookie'yi de temizle
     */
    response.cookies.set("admin-session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/admin/login",
    });

    return response;
  } catch (error) {
    // Hata durumunda 500 Internal Server Error döndür
    return NextResponse.json(
      { error: "çıkış sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
