import { createClient } from "@/lib/supabase/server";
import HeroManager from "@/components/admin/HeroManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hero Slides" };

export default async function AdminHeroPage() {
  const supabase = createClient();

  const [{ data: slidesData }, { data: statsData }] = await Promise.all([
    supabase
      .from("hero_slides")
      .select("id, image_url, thumb_url, location, tag, headline, subtitle, overlay_from, overlay_to, is_active, display_order")
      .order("display_order", { ascending: true }),
    supabase
      .from("hero_stats")
      .select("id, value, label, display_order, is_active")
      .order("display_order", { ascending: true }),
  ]);

  const slides = (slidesData ?? []) as Array<{
    id: string; image_url: string; thumb_url: string; location: string;
    tag: string; headline: string[]; subtitle: string; overlay_from: string;
    overlay_to: string; is_active: boolean; display_order: number;
  }>;

  const stats = (statsData ?? []) as Array<{
    id: string; value: string; label: string; display_order: number; is_active: boolean;
  }>;

  return (
    <div className="px-4 py-6 md:px-8 md:py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Hero Slides
        </h1>
        <p className="text-white/40 text-sm">
          {slides.filter(s => s.is_active).length} active slides · {stats.filter(s => s.is_active).length} active stats
        </p>
      </div>
      <HeroManager slides={slides} stats={stats} />
    </div>
  );
}
