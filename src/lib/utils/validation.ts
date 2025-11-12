import { z } from 'zod';

/**
 * Kullanıcı giriş formu validasyon şeması
 * Zod kütüphanesi kullanılarak type-safe form validasyonu sağlar
 */
export const LoginSchema = z.object({
  /**
   * Email alanı validasyonu
   * - String olmalı
   * - Geçerli email formatında olmalı
   * - Hata mesajı: 'Lütfen geçerli bir e-posta adresi giriniz.'
   */
  email: z.string().email({
    message: 'Lütfen geçerli bir e-posta adresi giriniz.',
  }),

  /**
   * Şifre alanı validasyonu
   * - String olmalı
   * - Minimum 8 karakter uzunluğunda olmalı
   * - Hata mesajı: 'Şifre alanı boş bırakılamaz.'
   *
   * NOT: Minimum 8 karakter gereksinimi olmasına rağmen hata mesajı
   * "boş bırakılamaz" şeklindedir. Bu tutarsızlık düzeltilebilir.
   */
  password: z.string().min(8, {
    message: 'Şifre alanı boş bırakılamaz.',
  }),
});

// Şema türünü export et (TypeScript için)
export type LoginFormData = z.infer<typeof LoginSchema>;
