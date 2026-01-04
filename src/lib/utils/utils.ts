/**
 * Yardımcı Fonksiyonlar
 * 
 * Bu modül, uygulama genelinde kullanılan yardımcı fonksiyonları içerir.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * CSS Sınıflarını Birleştirir
 * 
 * Tailwind CSS sınıflarını akıllıca birleştirir ve çakışmaları önler.
 * clsx ile koşullu sınıfları yönetir, twMerge ile Tailwind çakışmalarını çözer.
 * 
 * @param inputs - CSS sınıfları (string, array, object vb.)
 * @returns Birleştirilmiş CSS sınıf string'i
 * 
 * @example
 * cn("px-4 py-2", condition && "bg-blue-500", { "text-white": isActive })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Dosyayı Base64 String'e Çevirir
 * 
 * File nesnesini Base64 formatına dönüştürür.
 * Resim yüklemelerinde önizleme göstermek için kullanılır.
 * 
 * @param file - Dönüştürülecek dosya
 * @returns Base64 formatında string (Promise)
 */
export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Türkçe Karakterleri Destekleyen Slug Oluşturucu
 * 
 * Metni URL-dostu slug formatına dönüştürür.
 * Türkçe karakterleri İngilizce karşılıklarına çevirir (ç->c, ş->s, vb.)
 * 
 * @param text - Slug'a dönüştürülecek metin
 * @returns URL-dostu slug string'i
 * 
 * @example
 * slugify("Çiçek Bahçesi") // "cicek-bahcesi"
 */
export function slugify(text: string): string {
  // Türkçe karakter eşleştirme tablosu
  const trMap: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
    ı: "i",
    I: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
  };

  return text
    .split("")
    .map((char) => trMap[char] || char) // Türkçe karakterleri değiştir
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Harf, rakam ve boşluk dışındakileri sil
    .replace(/\s+/g, "-") // Boşlukları tire yap
    .replace(/-+/g, "-"); // Üst üste tireleri tek tire yap
}
