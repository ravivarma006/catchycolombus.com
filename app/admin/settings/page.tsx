import { createClient } from "@/lib/supabase/server";
import BrandSettings from "./BrandSettings";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Brand Settings" };

export default async function AdminSettingsPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("primary_color, accent_color")
    .eq("id", 1)
    .single();

  const primaryColor = data?.primary_color ?? "#0F4C5C";
  const accentColor  = data?.accent_color  ?? "#F5A800";

  return (
    <div className="px-4 py-6 md:px-8 md:py-10 max-w-3xl">
      <div className="mb-8">
        <h1
          className="text-3xl font-black text-white mb-1"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Brand Colors
        </h1>
        <p className="text-white/40 text-sm">
          Change primary and accent colors — updates the entire site instantly for all visitors.
        </p>
      </div>
      <BrandSettings primaryColor={primaryColor} accentColor={accentColor} />
    </div>
  );
}
