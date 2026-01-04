/**
 * Token Yönetimi
 * 
 * Bu modül, güvenlik token'larının oluşturulmasını ve yönetimini sağlar.
 * Şifre sıfırlama gibi işlemler için benzersiz token'lar üretir.
 */

import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db";

/**
 * Şifre Sıfırlama Token'ı Oluşturur
 * 
 * Kullanıcı için benzersiz bir şifre sıfırlama token'ı oluşturur.
 * Token 1 saat geçerlidir ve her kullanıcı için sadece bir aktif token bulunur.
 * 
 * @param email - Token oluşturulacak kullanıcının e-posta adresi
 * @returns Oluşturulan token bilgisi
 */
export const generatePasswordResetToken = async (email: string) => {
  // Benzersiz UUID token oluştur
  const token = uuidv4();
  
  // Token'ın geçerlilik süresi (1 saat)
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // Eski token varsa sil (her kullanıcı için tek aktif token)
  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  // Yeni token'ı veritabanına kaydet
  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
