import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generatePasswordResetToken } from "@/lib/utils/tokens";
import { sendPasswordResetEmail } from "@/lib/utils/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      // Güvenlik için "Böyle biri yok" demek yerine "Mail gönderildi" diyebilirsin
      // ama şimdilik net olalım.
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı!" },
        { status: 404 }
      );
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token
    );

    return NextResponse.json({ success: "Sıfırlama maili gönderildi!" });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
