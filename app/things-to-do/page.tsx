import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 300; // 5 minutes

export const metadata: Metadata = {
  title: "Things to Do in Columbus — Catch Columbus",
  description:
    "Explore the best attractions, museums, parks, shopping, nightlife, and outdoor adventures in Columbus, Ohio.",
};

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  image_url: string | null;
  display_order: number;
  activity_count?: number;
}

interface FeaturedActivity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  neighborhood: string | null;
  price_range: string | null;
  category: { name: string; slug: string } | null;
}

export default async function ThingsToDoPage() {
  const supabase = createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from("activity_categories")
    .select("id, name, slug, icon, description, image_url, display_order")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  // Get activity counts per category + featured activities in parallel
  const cats: Category[] = await Promise.all(
    (categories ?? []).map(async (cat) => {
      const { count } = await supabase
        .from("activities")
        .select("id", { count: "exact", head: true })
        .eq("category_id", cat.id)
        .eq("is_active", true);
      return { ...cat, activity_count: count ?? 0 };
    })
  );

  const { data: featured } = await supabase
    .from("activities")
    .select("id, name, slug, description, image_url, neighborhood, price_range, category:activity_categories!category_id(name, slug)")
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(3);

  const featuredActivities = (featured ?? []) as unknown as FeaturedActivity[];

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "linear-gradient(160deg, #ffffff 0%, #f0f4f8 40%, #e8edf4 70%, #f5f3f0 100%)" }}
    >
      {/* Soft ambient glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent/8 blur-[120px]" />
        <div className="absolute top-[50%] left-[40%] w-[30%] h-[30%] rounded-full bg-blue-200/20 blur-[100px]" />
      </div>

      {/* Page Header */}
      <div className="relative z-10 pt-16 pb-10 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-[2px] w-8 bg-accent" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
            Columbus, Ohio
          </span>
        </div>
        <h1
          className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Things to <span style={{ color: "var(--accent)" }}>Do</span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg font-medium max-w-xl">
          Explore attractions, museums, parks, shopping, and more across Columbus.
        </p>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        {/* Featured Activities */}
        {featuredActivities.length > 0 && (
          <div className="mb-14">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
              Featured
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredActivities.map((act) => (
                <Link
                  key={act.id}
                  href={`/things-to-do/${act.category?.slug ?? "attractions"}/${act.slug}`}
                  className="group block"
                >
                  <div className="relative w-full h-72 rounded-3xl overflow-hidden bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg shadow-gray-200/60 hover:shadow-2xl hover:shadow-gray-300/60 hover:border-white transition-all duration-500">
                    {act.image_url ? (
                      <Image
                        src={act.image_url}
                        alt={act.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                    {/* Category badge */}
                    {act.category && (
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent text-[#020C1B] uppercase tracking-widest">
                          {act.category.name}
                        </span>
                      </div>
                    )}

                    {/* Price badge */}
                    {act.price_range && (
                      <div className="absolute top-4 right-4">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/10">
                          {act.price_range}
                        </span>
                      </div>
                    )}

                    {/* Text */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h2
                        className="text-xl font-black text-white mb-1 leading-tight group-hover:text-accent transition-colors duration-300"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {act.name}
                      </h2>
                      {act.neighborhood && (
                        <p className="text-white/50 text-sm">{act.neighborhood}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category Grid */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
          Explore by Category
        </p>

        {cats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 text-center">
            <div className="text-6xl opacity-30">🎯</div>
            <p className="text-gray-500 font-semibold text-xl">
              No categories yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cats.map((cat) => (
              <Link
                key={cat.id}
                href={`/things-to-do/${cat.slug}`}
                className="group block"
              >
                <div className="relative w-full h-72 rounded-3xl overflow-hidden bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg shadow-gray-200/60 hover:shadow-2xl hover:shadow-gray-300/60 hover:border-white transition-all duration-500">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                  {/* Icon badge */}
                  {cat.icon && (
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-lg group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                      {cat.icon}
                    </div>
                  )}

                  {/* Activity count */}
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/10">
                      {cat.activity_count}{" "}
                      {cat.activity_count === 1 ? "listing" : "listings"}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2
                      className="text-xl font-black text-white mb-1 leading-tight group-hover:text-accent transition-colors duration-300"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {cat.name}
                    </h2>
                    {cat.description && (
                      <p className="text-white/50 text-sm line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:bg-accent group-hover:text-[#020C1B] group-hover:border-accent transition-all duration-500">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
