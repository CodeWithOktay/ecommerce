import { getSettings } from "@/lib/actions/settings";
import SettingsClient from "@/components/features/admin/settings-client";

/**
 * Ayarlar Sayfası (Server Component)
 * 
 * Site genel ayarlarını (başlık, logo, iletişim bilgileri vb.) yönetir.
 * - `getSettings` action'ı ile veritabanından mevcut konfigürasyonu çeker.
 * - Ayarları düzenlemek üzere `SettingsClient` bileşenine iletir.
 */
export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return <SettingsClient initialData={settings} />;
}
