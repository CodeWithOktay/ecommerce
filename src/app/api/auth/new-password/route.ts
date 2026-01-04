import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

/**
 * Yeni Şifre Belirleme (API Route)
 * 
 * Şifre sıfırlama sürecinin son adımıdır.
 * - Token'in geçerliliğini ve süresini kontrol eder.
 * - Geçerliyse kullanıcının şifresini hashleyerek günceller.
 * - Güvenlik için kullanılan token'i veritabanından siler.
 */
export async function POST(req: Request) {
  try {
    const { password, token } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Eksik bilgi!" }, { status: 400 });
    }

    // 1. Token var mı?
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.json({ error: "Geçersiz token!" }, { status: 400 });
    }

    // 2. Süresi dolmuş mu?
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return NextResponse.json(
        { error: "Linkin süresi dolmuş!" },
        { status: 400 }
      );
    }

    // 3. Kullanıcı var mı?
    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Kullanıcı yok!" }, { status: 404 });
    }

    // 4. Şifreyi hashle ve güncelle
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { passwordHash: hashedPassword },
    });

    // 5. Tokeni sil (tek kullanımlık olsun)
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return NextResponse.json({ success: "Şifre başarıyla güncellendi!" });
  } catch {
    return NextResponse.json(
      { error: "Bir şeyler ters gitti." },
      { status: 500 }
    );
  }
}
