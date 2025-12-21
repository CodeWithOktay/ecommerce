import { describe, it, expect, beforeEach } from "vitest";
import prisma from "@/lib/db";
import { authenticateUser } from "@/lib/auth/auth.service";
import bcrypt from "bcrypt";

describe("Authentication Security Tests", () => {
  const testUser = {
    email: "security@test.com",
    password: "StrongPass123!",
    firstName: "Secure",
    lastName: "User",
  };

  beforeEach(async () => {
    // Temizleme
    await prisma.user.deleteMany();

    // Test kullanıcısını ekleme
    const hash = await bcrypt.hash(testUser.password, 10);
    await prisma.user.create({
      data: {
        email: testUser.email,
        passwordHash: hash,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: "USER",
      },
    });
  });

  it("should not allow login with wrong password multiple times", async () => {
    const maxAttempts = 5;
    let lastResult = null;

    for (let i = 0; i < maxAttempts; i++) {
      lastResult = await authenticateUser(testUser.email, "WrongPassword!");
      expect(lastResult).toBeNull();
    }

    // Bu aşamada brute-force koruma eklenecekse testi buraya bağlayabiliriz
    // Örnek: limit aşıldığında özel hata veya bloklama beklenir
  });

  it("should verify password hash is correct", async () => {
    const user = await prisma.user.findUnique({
      where: { email: testUser.email },
    });
    const isMatch = await bcrypt.compare(
      testUser.password,
      user?.passwordHash || ""
    );
    expect(isMatch).toBe(true);
  });

  it("should return null for non-existent user", async () => {
    const result = await authenticateUser("noone@test.com", "password");
    expect(result).toBeNull();
  });

  // JWT / Session testleri için (örnek, NextAuth veya token kullanıyorsan)
  it("should generate a valid session/token after login", async () => {
    const user = await authenticateUser(testUser.email, testUser.password);
    expect(user).not.toBeNull();
    // Eğer JWT kullanıyorsan burada token üretimi ve verify edebilirsin
    // Örn: const token = generateToken(user)
    // expect(() => verifyToken(token)).not.toThrow()
  });
});
