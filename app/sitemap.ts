import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://catchcolumbus.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/coupons`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/announcements`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/things-to-do`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic: service categories
  const { data: categories } = await supabase
    .from("service_categories")
    .select("slug, updated_at")
    .eq("is_active", true);

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((cat) => ({
    url: `${SITE_URL}/services/${cat.slug}`,
    lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic: service providers
  const { data: providers } = await supabase
    .from("service_providers")
    .select("slug, category_id, updated_at")
    .eq("is_active", true);

  // Get category slugs for provider URLs
  const catMap = new Map((categories ?? []).map((c) => [c.slug, c.slug]));
  const { data: allCats } = await supabase
    .from("service_categories")
    .select("id, slug");
  const catIdToSlug = new Map((allCats ?? []).map((c) => [c.id, c.slug]));

  const providerPages: MetadataRoute.Sitemap = (providers ?? []).map((p) => ({
    url: `${SITE_URL}/services/${catIdToSlug.get(p.category_id) ?? "unknown"}/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Dynamic: events
  const { data: events } = await supabase
    .from("events")
    .select("slug, created_at")
    .eq("is_active", true);

  const eventPages: MetadataRoute.Sitemap = (events ?? []).map((e) => ({
    url: `${SITE_URL}/events/${e.slug}`,
    lastModified: e.created_at ? new Date(e.created_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic: coupons
  const { data: coupons } = await supabase
    .from("coupons")
    .select("id, created_at")
    .eq("is_active", true);

  const couponPages: MetadataRoute.Sitemap = (coupons ?? []).map((c) => ({
    url: `${SITE_URL}/coupons/${c.id}`,
    lastModified: c.created_at ? new Date(c.created_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Dynamic: activity categories (Things to Do)
  const { data: activityCategories } = await supabase
    .from("activity_categories")
    .select("id, slug, created_at")
    .eq("is_active", true);

  const actCatIdToSlug = new Map(
    (activityCategories ?? []).map((c) => [c.id, c.slug])
  );

  const activityCategoryPages: MetadataRoute.Sitemap = (activityCategories ?? []).map((c) => ({
    url: `${SITE_URL}/things-to-do/${c.slug}`,
    lastModified: c.created_at ? new Date(c.created_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic: activities (Things to Do)
  const { data: activities } = await supabase
    .from("activities")
    .select("slug, category_id, updated_at")
    .eq("is_active", true);

  const activityPages: MetadataRoute.Sitemap = (activities ?? []).map((a) => ({
    url: `${SITE_URL}/things-to-do/${actCatIdToSlug.get(a.category_id) ?? "attractions"}/${a.slug}`,
    lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...providerPages,
    ...eventPages,
    ...couponPages,
    ...activityCategoryPages,
    ...activityPages,
  ];
}
