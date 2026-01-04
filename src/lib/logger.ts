/**
 * Denetim Günlüğü (Audit Log) Yönetimi
 * 
 * Bu modül, admin panelindeki tüm önemli işlemlerin kaydını tutar.
 * Her işlem için kullanıcı bilgisi, IP adresi ve işlem detayları saklanır.
 */

import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/actions/auth";

/**
 * Log Parametreleri
 */
interface LogParams {
  action: string;      // İşlem adı (örn: "Ürün Eklendi", "Kategori Silindi")
  details?: string;    // İşlem detayları
  success?: boolean;   // İşlem başarılı mı?
  role?: string;       // Kullanıcı rolü (ADMIN, USER)
  metadata?: Record<string, unknown>; // Ekstra veriler
  ip?: string;         // IP adresi (Opsiyonel, verilmezse header'dan alınır)
  userAgent?: string;  // User Agent (Opsiyonel)
  email?: string;      // İşlemi yapan email (Session yoksa manuel verilir)
  userId?: string;     // İşlemi yapan ID (Session yoksa manuel verilir)
}

/**
 * Denetim Günlüğü Oluşturur
 * 
 * Admin panelindeki önemli işlemleri veritabanına kaydeder.
 * Kullanıcı bilgisi, IP adresi, user agent ve işlem detaylarını saklar.
 * 
 * @param action - İşlem adı
 * @param details - İşlem detayları (opsiyonel)
 * @param success - İşlem başarılı mı? (varsayılan: true)
 * @param role - Kullanıcı rolü (Varsayılan: "ADMIN")
 * @param metadata - Ekstra JSON veri
 */
export async function createLog({
  action,
  details,
  success = true,
  role = "ADMIN",
  metadata,
  ip: providedIp,
  userAgent: providedUserAgent,
  email,
  userId,
}: LogParams) {
  try {
    // Mevcut kullanıcı oturumunu al (Eğer explicit email/id yoksa)
    let session = null;
    if (!email && !userId) {
       try {
         session = await getServerSession(authOptions);
       } catch (e) {
         // Session alınamazsa yoksay
       }
    }
    
    let headersList: { get: (key: string) => string | null } = { get: () => null };
    try {
      headersList = await headers();
    } catch (e) {
      // Headers alınamazsa yoksay
    }

    // İstek bilgilerini topla
    const ip = providedIp || headersList.get("x-forwarded-for") || "Bilinmiyor";
    const userAgent = providedUserAgent || headersList.get("user-agent") || "Bilinmiyor";

    // Veritabanına log kaydı oluştur
    await prisma.auditLog.create({
      data: {
        action: action,
        details: `${success ? "[BAŞARILI]" : "[BAŞARISIZ]"} ${details || ""}`,
        adminId: userId || session?.user?.id || null,
        adminEmail: email || session?.user?.email || "Anonim/Sistem",
        role: role, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: metadata ? (metadata as any) : undefined,
        ipAddress: ip,
        userAgent: userAgent,
      },
    });
  } catch (error) {
    // Loglama hatası ana akışı bozmamalı, sadece konsola yazdır
    console.error("Loglama hatası:", error);
  }
}
