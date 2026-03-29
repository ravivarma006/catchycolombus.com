import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import ThingsToDoSection from "@/components/home/ThingsToDoSection";
import AnnouncementsSection from "@/components/home/AnnouncementsSection";
import EventsCalendarSection from "@/components/home/EventsCalendarSection";
import SubscribeForm from "@/components/SubscribeForm";
import BannersSection from "@/components/home/BannersSection";

export default async function Home() {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const [{ data: banners }, { data: announcements }, { data: featuredActivities }, { data: heroSlides }, { data: heroStats }] = await Promise.all([
    supabase
      .from("banners")
      .select("id, title, image_url, link_url, display_order")
      .eq("is_active", true)
      .or(`start_date.is.null,start_date.lte.${today}`)
      .or(`end_date.is.null,end_date.gte.${today}`)
      .order("display_order", { ascending: true }),
    supabase
      .from("announcements")
      .select("id, title, content, image_url, is_pinned, published_at")
      .eq("is_active", true)
      .order("is_pinned", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(3),
    supabase
      .from("activities")
      .select("id, name, slug, description, image_url, neighborhood, price_range, category:activity_categories!category_id(name, slug)")
      .eq("is_active", true)
      .eq("is_featured", true)
      .limit(6),
    supabase
      .from("hero_slides")
      .select("image_url, thumb_url, location, tag, headline, subtitle, overlay_from, overlay_to")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("hero_stats")
      .select("value, label")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
  ]);

  return (
    <>
      <HeroSection
        slides={(heroSlides ?? []).map((row: any, i: number) => ({
          id: i,
          image: row.image_url,
          thumb: row.thumb_url,
          location: row.location,
          tag: row.tag,
          headline: row.headline,
          sub: row.subtitle,
          overlayFrom: row.overlay_from,
          overlayTo: row.overlay_to,
        }))}
        stats={(heroStats ?? []).map((s: any) => ({ value: s.value, label: s.label }))}
      />
      <CategoriesSection />
      <ThingsToDoSection activities={(featuredActivities ?? []).map((a: any) => ({
        ...a,
        category: Array.isArray(a.category) ? a.category[0] ?? null : a.category ?? null,
      }))} />
      <AnnouncementsSection announcements={announcements ?? []} />
      <EventsCalendarSection />
      <SubscribeForm />
      <BannersSection banners={banners ?? []} />
    </>
  );
}
