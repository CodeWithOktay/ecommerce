import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/utils/mail";

/**
 * İletişim Formu (API Route)
 * 
 * Ziyaretçilerin gönderdiği iletişim mesajlarını işler.
 * - Form verilerini doğrular.
 * - Admin'e e-posta olarak iletir.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Basit sunucu tarafı doğrulaması
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurun." },
        { status: 400 }
      );
    }

    // Mail gönder
    await sendContactEmail({ name, email, subject, message });

    return NextResponse.json({ success: true, message: "Mesaj gönderildi." });
  } catch (error) {
    console.error("İletişim Formu Hatası:", error);
    return NextResponse.json(
      { error: "Mesaj gönderilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
