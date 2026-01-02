"use client";

import { updateSettings } from "@/lib/actions/settings";
import { Settings } from "@prisma/client";
import {
  Save,
  Globe,
  Phone,
  Link as LinkIcon,
  Loader2,
  Settings as SettingsIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import GeneralSettingsForm from "./general-settings-form";
import ContactSettingsForm from "./contact-settings-form";
import SocialSettingsForm from "./social-settings-form";

type Tab = "general" | "contact" | "social";

export default function SettingsTabs({
  initialData,
}: {
  initialData: Settings;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const res = await updateSettings(formData);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error("Hata: " + res.message);
    }

    setLoading(false);
  }

  const tabs = [
    { id: "general", label: "Genel", icon: Globe },
    { id: "contact", label: "İletişim", icon: Phone },
    { id: "social", label: "Sosyal Medya", icon: LinkIcon },
  ];

  return (
    <form action={handleSubmit} className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-8 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-200">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
             <div className="p-2 bg-gray-900 rounded-lg text-white">
                <SettingsIcon size={24} />
             </div>
             Sistem Ayarları
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Mağazanızın temel yapılandırmasını yönetin.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black hover:shadow-xl hover:shadow-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 group"
        >
          {loading ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <Save size={22} className="group-hover:scale-110 transition-transform" />
          )}
          <span>{loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</span>
        </button>
      </div>

      {/* --- TABS --- */}
      <div className="flex flex-col md:flex-row gap-8">
         {/* SIDEBAR NAVIGATION */}
         <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:w-64 shrink-0">
            {tabs.map((tab) => {
               const Icon = tab.icon;
               const isActive = activeTab === tab.id;
               return (
                 <button
                   key={tab.id}
                   type="button"
                   onClick={() => setActiveTab(tab.id as Tab)}
                   className={`
                      flex items-center gap-3 px-5 py-4 rounded-xl font-medium transition-all text-sm md:text-base whitespace-nowrap
                      ${isActive 
                        ? "bg-white text-gray-900 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] ring-1 ring-gray-200" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                      }
                   `}
                 >
                    <Icon size={20} className={isActive ? "text-indigo-600" : "text-gray-400"} />
                    {tab.label}
                 </button>
               )
            })}
         </nav>

         {/* CONTENT AREA */}
         <div className="flex-1 min-h-[500px]">
            <div className={activeTab === "general" ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
               <GeneralSettingsForm initialData={initialData} />
            </div>
            
            <div className={activeTab === "contact" ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
               <ContactSettingsForm initialData={initialData} />
            </div>

            <div className={activeTab === "social" ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
               <SocialSettingsForm initialData={initialData} />
            </div>
         </div>
      </div>
    </form>
  );
}
