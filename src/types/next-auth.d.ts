import { Role } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
// 🟢 Sadece tip genişletmesi yapacağımız için DefaultJWT yeterli,
// 'JWT' importunu sildik çünkü kullanmıyoruz.
import { DefaultJWT } from "next-auth/jwt";

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
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
  }
}
