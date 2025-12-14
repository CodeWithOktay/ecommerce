// src/lib/utils.ts

// Dosyayı Base64 string'e çevirir
export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};


export function slugify(text: string): string {
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
    .replace(/[^a-z0-9\s-]/g, "") // Harf, rakam ve boşluk dışındakileri (virgül dahil) sil
    .replace(/\s+/g, "-") // Boşlukları tire yap
    .replace(/-+/g, "-"); // Üst üste tireleri tek tire yap
}
