// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Güvenli bir şifre belirleyip hash'liyoruz
  const password = await hash('admin12345', 12);

  // Veritabanında admin kullanıcısı var mı diye kontrol edip, yoksa oluşturuyoruz
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@kervanpazar.com' },
    update: {},
    create: {
      email: 'admin@kervanpazar.com',
      name: 'Admin',
      passwordHash: password,
      role: Role.ADMIN, // Rolünü ADMIN olarak atıyoruz
    },
  });
  console.log('Admin user has been created successfully:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
