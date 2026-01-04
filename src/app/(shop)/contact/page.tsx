import { prisma } from "@/lib/db"; // Prisma client'ının olduğu yer
import ContactClient from "./contact-client";

export const metadata = {
  title: "İletişim | KervanPazar",
  description: "Bizimle iletişime geçin.",
};

/**
 * İletişim Sayfası (Server Component)
 * 
 * Veritabanından site ayarlarını (telefon, adres, email) çeker 
 * ve bunları ContactClient bileşenine iletir.
 */
export default async function ContactPage() {
  // Veritabanından ilk ayar kaydını çek
  const settings = await prisma.settings.findFirst();

  // Veriyi Client Component'e gönder
  return <ContactClient settings={settings} />;
}
