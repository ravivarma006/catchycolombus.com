import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import ThingsToDoSection from "@/components/home/ThingsToDoSection";
import AnnouncementsSection from "@/components/home/AnnouncementsSection";
import EventsCalendarSection from "@/components/home/EventsCalendarSection";
import TrustSection from "@/components/home/TrustSection";
import SubscribeForm from "@/components/SubscribeForm";
import BannersSection from "@/components/home/BannersSection";
import type { FeaturedDeal } from "@/components/home/FeaturedDealsSection";

export default async function Home() {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const [
    { data: banners },
    { data: announcements },
    { data: featuredActivities },
    { data: heroSlides },
    { data: heroStats },
    { data: dealCoupons },
    { data: dealEvents },
  ] = await Promise.all([
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
    supabase
      .from("coupons")
      .select(`id, product_service_name, description, coupon_code, image_url,
        discount_value, discount_type, expires_at, is_premium,
        max_redemptions, current_redemptions,
        coupon_categories ( name, slug )`)
      .eq("is_active", true)
      .or(`expires_at.is.null,expires_at.gte.${today}`)
      .order("is_premium", { ascending: false })
      .limit(6),
    supabase
      .from("events")
      .select("id, title, slug, event_date, event_time, location, description, price, category, image_url")
      .eq("is_active", true)
      .eq("is_featured", true)
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(3),
  ]);

  // Normalize coupons + events into unified FeaturedDeal array
  const couponDeals: FeaturedDeal[] = (dealCoupons ?? []).map((c: any) => {
    let discountLabel: string | null = null;
    if (c.discount_value && c.discount_value > 0) {
      discountLabel =
        c.discount_type === "percentage"
          ? `${Math.round(c.discount_value)}% OFF`
          : `$${Math.round(c.discount_value)} OFF`;
    }
    const cats = Array.isArray(c.coupon_categories) ? c.coupon_categories[0] : c.coupon_categories;
    return {
      id: c.id,
      type: "coupon" as const,
      title: c.product_service_name,
      description: c.description,
      imageUrl: c.image_url,
      categoryName: cats?.name ?? null,
      categorySlug: cats?.slug ?? null,
      href: `/coupons/${c.id}`,
      discountLabel,
      expiresAt: c.expires_at,
      maxRedemptions: c.max_redemptions,
      currentRedemptions: c.current_redemptions ?? 0,
      isPremium: c.is_premium ?? false,
    };
  });

  const eventDeals: FeaturedDeal[] = (dealEvents ?? []).map((e: any) => ({
    id: e.id,
    type: "event" as const,
    title: e.title,
    description: e.description,
    imageUrl: e.image_url,
    categoryName: e.category ?? "Event",
    categorySlug: "events",
    href: `/events/${e.slug}`,
    discountLabel: e.price?.toLowerCase() === "free" ? "FREE" : null,
    expiresAt: null,
    maxRedemptions: null,
    currentRedemptions: 0,
    isPremium: false,
  }));

  // Priority: coupons with discounts first, then others, then events — take top 3
  const featuredDeals = [
    ...couponDeals.filter((d) => d.discountLabel),
    ...couponDeals.filter((d) => !d.discountLabel),
    ...eventDeals,
  ].slice(0, 3);

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
        deals={featuredDeals}
      />
      <CategoriesSection />
      <ThingsToDoSection activities={(featuredActivities ?? []).map((a: any) => ({
        ...a,
        category: Array.isArray(a.category) ? a.category[0] ?? null : a.category ?? null,
      }))} />
      <AnnouncementsSection announcements={announcements ?? []} />
      <EventsCalendarSection />
      <TrustSection />
      <SubscribeForm />
      <BannersSection banners={banners ?? []} />
    </>
  );
}
