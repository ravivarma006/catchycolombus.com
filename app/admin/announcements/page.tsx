import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import AnnouncementsManager from "./AnnouncementsManager";

export const metadata: Metadata = { title: "Announcements" };

export default async function AdminAnnouncementsPage() {
  const supabase = createClient();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false });

  return (
    <div className="px-4 py-6 md:px-8 md:py-10 max-w-4xl">
      <div className="mb-10">
        <h1
          className="text-4xl font-black text-white mb-2"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Announcements
        </h1>
        <p className="text-white/40 text-sm">
          Create and manage city announcements visible to all visitors.
        </p>
      </div>

      <AnnouncementsManager announcements={announcements ?? []} />
    </div>
  );
}
