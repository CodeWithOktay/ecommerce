import { describe, it, expect, beforeEach } from "vitest";
import { authenticateUser } from "../auth.service";
import { prisma } from "@/lib/test-utils/prisma";
import bcrypt from "bcrypt";

describe("authenticateUser", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();

    const hash = await bcrypt.hash("123456", 10);

    await prisma.user.create({
      data: {
        email: "test@test.com",
        passwordHash: hash,
        role: "USER",
      },
    });
  });

  it("doğru bilgilerle kullanıcıyı döndürür", async () => {
    const user = await authenticateUser("test@test.com", "123456");

    expect(user).not.toBeNull();
    expect(user?.email).toBe("test@test.com");
  });

  it("yanlış şifre ile null döner", async () => {
    const user = await authenticateUser("test@test.com", "yanlış");

    expect(user).toBeNull();
  });

  it("olmayan kullanıcı için null döner", async () => {
    const user = await authenticateUser("x@test.com", "123456");

    expect(user).toBeNull();
  });
});
