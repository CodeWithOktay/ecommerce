import { prisma } from "@/lib/db"; // Prisma client'ının olduğu yer
import ContactClient from "./contact-client";

export const metadata = {
  title: "İletişim | KervanPazar",
  description: "Bizimle iletişime geçin.",
};

export default async function ContactPage() {
  // Veritabanından ilk ayar kaydını çek
  const settings = await prisma.settings.findFirst();

  // Veriyi Client Component'e gönder
  return <ContactClient settings={settings} />;
}
