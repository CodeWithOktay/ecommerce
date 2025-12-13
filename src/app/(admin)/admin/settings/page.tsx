import { getSettings } from "@/lib/actions/settings-actions";
import SettingsClient from "@/components/admin/settings/SettingsClient";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return <SettingsClient initialData={settings} />;
}
