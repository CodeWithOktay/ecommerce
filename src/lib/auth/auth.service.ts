import prisma from "@/lib/db";
import { compare } from "bcrypt";
import { User } from "@prisma/client";

export async function authenticateUser(
  email: string,
  password: string
): Promise<Omit<User, "passwordHash"> | null> {
  if (!email || !password) return null;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return null;

  const isPasswordValid = await compare(password, user.passwordHash);
  if (!isPasswordValid) return null;

  // passwordHash'i döndürmüyoruz
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
