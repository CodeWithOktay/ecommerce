import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Lütfen geçerli bir e-posta adresi giriniz.',
  }),
  password: z.string().min(8, {
    message: 'Şifre alanı boş bırakılamaz.',
  }),
});
