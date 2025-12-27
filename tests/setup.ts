import { beforeAll, afterAll, afterEach } from "vitest";
import { connectPrisma, disconnectPrisma, cleanupDatabase } from "../src/lib/test-utils/prisma";

// Tüm testlerden önce DB’ye bağlan
beforeAll(async () => {
  await connectPrisma();
});

// Her testten sonra DB’yi temizle
afterEach(async () => {
  await cleanupDatabase();
});

// Tüm testler bittikten sonra DB bağlantısını kapat
afterAll(async () => {
  await disconnectPrisma();
});
