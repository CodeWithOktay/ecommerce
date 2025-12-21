import { z } from "zod";

/**
 * LOGIN ŞEMASI
 * Giriş yaparken kullanıcıyı çok darlamadan,
 * veriyi sunucuya göndermeden önce temizler ve formatı kontrol eder.
 */
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "E-posta alanı zorunludur." }) // Boş kontrolü
    .email({ message: "Geçerli bir e-posta adresi giriniz." }) // Format kontrolü
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, { message: "Şifre alanı boş bırakılamaz." }) // Önce boş mu diye bakar
    .min(6, { message: "Şifre en az 6 karakter olmalıdır." }), // Sonra uzunluk (Genelde min 6 idealdir)
  // NOT: Login işleminde .trim() KULLANILMAZ. Bazı şifreler boşluk içerebilir.
});

/**
 * REGISTER (KAYIT) ŞEMASI
 */
export const RegisterSchema = z
  .object({
    firstName: z.string().min(3, "İsim en az 3 karakter olmalıdır.").trim(),

    lastName: z.string().min(3, "Soyisim en az 3 karakter olmalıdır.").trim(),

    email: z
      .string()
      .min(1, "E-posta zorunludur.")
      .email("Geçerli bir e-posta giriniz.")
      .trim()
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır.")
      .regex(/[A-Z]/, "En az bir büyük harf içermelidir.")
      .regex(/[a-z]/, "En az bir küçük harf içermelidir.")
      .regex(/[0-9]/, "En az bir rakam içermelidir.")
      .regex(
        /[^A-Za-z0-9]/,
        "En az bir özel karakter (.,+,@, vb.) içermelidir."
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"], // Hatayı bu inputun altına basar
  });

// TypeScript Tiplerini Çıkaralım
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
