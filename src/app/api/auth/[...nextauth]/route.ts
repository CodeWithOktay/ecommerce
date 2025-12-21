import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/options"; // Ayarları buradan çekiyoruz

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
