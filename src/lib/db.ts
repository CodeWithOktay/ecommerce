/**
 * Prisma Veritabanı İstemcisi
 * 
 * Bu dosya, uygulama genelinde kullanılacak Prisma Client'ın singleton instance'ını oluşturur.
 * Hot-reload sırasında birden fazla instance oluşmasını önlemek için global değişken kullanır.
 */

import { PrismaClient } from "@prisma/client";

// Global değişken tanımlaması (Next.js hot-reload için)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prisma Client Instance
 * 
 * Development ortamında query, error ve warn logları aktif
 * Production ortamında sadece error logları aktif
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Development ortamında global değişkene kaydet (hot-reload için)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
