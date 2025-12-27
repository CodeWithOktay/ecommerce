import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import path from "path";

// 1. .env.test dosyasını yüklüyoruz
config({ path: path.resolve(process.cwd(), ".env.test") });

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error("TEST_DATABASE_URL not found in .env.test!");
}

// 2. Global değişken (Development/Test ortamında connection limit patlamasın diye)
declare global {
  var __TEST_PRISMA__: PrismaClient | undefined;
}

// 3. Prisma Client'ı en sade haliyle başlatıyoruz
// Datasources url'i buradan ezebiliyoruz, böylece .env.test içindeki URL'i kesin kullandığına emin oluruz.
export const testPrisma =
  global.__TEST_PRISMA__ ||
  new PrismaClient({
    datasources: {
      db: {
        url: testDatabaseUrl,
      },
    },
    // İstersen sorguları görmek için:
    // log: ['query'],
  });

if (process.env.NODE_ENV !== "production") {
  global.__TEST_PRISMA__ = testPrisma;
}

// --- Helper Fonksiyonlar ---

export const connectPrisma = async () => {
  try {
    await testPrisma.$connect();
  } catch (error) {
    console.error("Prisma bağlantı hatası:", error);
    process.exit(1);
  }
};

export const disconnectPrisma = async () => {
  await testPrisma.$disconnect();
};

export const cleanupDatabase = async () => {
  // Buradaki mantık aynı kalıyor, SQL sorgusu olduğu için adapter'dan bağımsız.
  const tables = await testPrisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename::text FROM pg_tables WHERE schemaname='public'
  `;

  for (const { tablename } of tables) {
    if (tablename !== "_prisma_migrations") {
      try {
        await testPrisma.$executeRawUnsafe(
          `TRUNCATE TABLE "${tablename}" CASCADE;`
        );
      } catch (error) {
        console.error(`Tablo temizlenirken hata: ${tablename}`, error);
      }
    }
  }
};
