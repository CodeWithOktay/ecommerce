import { getSettings } from "@/lib/actions/settings";
import SettingsClient from "@/components/features/admin/settings-client";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return <SettingsClient initialData={settings} />;
}
