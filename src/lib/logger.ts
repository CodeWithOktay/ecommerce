import { prisma } from "@/lib/prisma-client";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

interface LogParams {
  action: string;
  details?: string;
  success?: boolean;
}

export async function createLog({
  action,
  details,
  success = true,
}: LogParams) {
  try {
    const session = await getServerSession(authOptions);
    const headersList = await headers();

    // IP Adresini Yakala
    const ip = headersList.get("x-forwarded-for") || "Bilinmiyor";
    const userAgent = headersList.get("user-agent") || "Bilinmiyor";

    await prisma.auditLog.create({
      data: {
        action: action,
        details: `${success ? "[BAŞARILI]" : "[BAŞARISIZ]"} ${details || ""}`,
        adminId: session?.user?.id || null, // Oturum varsa ID'yi al
        adminEmail: session?.user?.email || "Anonim/Sistem",
        ipAddress: ip,
        userAgent: userAgent,
      },
    });
  } catch (error) {
    // Loglama sistemi hatası ana akışı bozmamalı, sadece konsola bas
    console.error("Loglama hatası:", error);
  }
}
