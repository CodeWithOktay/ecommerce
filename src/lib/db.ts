import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton Pattern
 *
 * Bu dosya, Prisma Client'ın global bir instance'ını oluşturur ve
 * development ortamında hot reload sırasında yeni bağlantıların
 * oluşmasını önler. Bu pattern sayesinde "too many connections"
 * hatasının önüne geçilir.
 */

// Global scope'u TypeScript için tanımla
// Bu, development sırasında Prisma instance'ını globalde saklamamızı sağlar
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined; // Prisma instance'ı veya undefined
};

/**
 * Prisma Client Instance'ı
 *
 * Eğer globalde bir Prisma instance'ı varsa onu kullan,
 * yoksa yeni bir tane oluştur.
 *
 * Log seviyeleri:
 * - Development: query, error, warn (detaylı loglama)
 * - Production: error (sadece hataları logla)
 *
 * Bu pattern sayesinde:
 * - Development: Hot reload sırasında aynı instance kullanılır
 * - Production: Her seferinde yeni instance oluşmaz
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Ortama göre log seviyelerini ayarla
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

/**
 * Development Ortamı Kontrolü
 *
 * Eğer production ortamında değilsek (development):
 * - Prisma instance'ını global scope'a kaydet
 * - Bu, hot reload sırasında yeni database bağlantılarının
 *   oluşmasını engeller ve "too many connections" hatasını önler
 */
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
