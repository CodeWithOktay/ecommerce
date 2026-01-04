import { Role } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
// 🟢 Sadece tip genişletmesi yapacağımız için DefaultJWT yeterli,
// 'JWT' importunu sildik çünkü kullanmıyoruz.
import { DefaultJWT } from "next-auth/jwt";

/**
 * NextAuth Tip Genişletmesi
 * 
 * Varsayılan NextAuth session ve user tiplerini genişleterek
 * projemize özgü alanları (role, id, firstName vb.) ekler.
 * Böylece `useSession` hook'u ile bu verilere type-safe erişebiliriz.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      firstName?: string | null;
      lastName?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: Role;
    firstName?: string | null;
    lastName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
  }
}
