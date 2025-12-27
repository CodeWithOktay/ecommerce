import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db"; // Prisma client'ın olduğu yer

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  // Token 1 saat geçerli olsun
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // Varsa eski tokeni sil ki çöp oluşmasın
  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
