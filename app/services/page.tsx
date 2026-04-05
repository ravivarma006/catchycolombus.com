import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_FALLBACK_IMAGES, DEFAULT_SERVICE_IMAGE } from "@/lib/constants/images";

export const metadata: Metadata = {
  title: "Services Directory — Catch Columbus",
  description:
    "Browse local services in Columbus, Ohio. Find dining, health, beauty, real estate, automotive and more.",
};

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  image_url?: string | null;
  display_order: number;
  provider_count?: number;
}

export const revalidate = 300; // 5 minutes

export default async function ServicesPage() {
  const supabase = createClient();

  // Two queries instead of N+1: categories + all provider category_ids
  const [{ data: categories }, { data: providerRows }] = await Promise.all([
    supabase
      .from("service_categories")
      .select("id, name, slug, icon, description, display_order, image_url")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("service_providers")
      .select("category_id")
      .eq("is_active", true),
  ]);

  // Count providers per category in JS — O(n) single pass
  const countMap = (providerRows ?? []).reduce<Record<string, number>>(
    (acc, p) => { acc[p.category_id] = (acc[p.category_id] ?? 0) + 1; return acc; },
    {}
  );

  const cats: Category[] = (categories ?? []).map((cat) => ({
    ...cat,
    provider_count: countMap[cat.id] ?? 0,
  }));

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)",
      }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/15 blur-[130px]" />
        <div className="absolute top-[40%] left-[35%] w-[40%] h-[40%] rounded-full bg-violet-600/15 blur-[110px]" />
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
          className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Services <span style={{ color: "var(--accent)" }}>Directory</span>
        </h1>
        <p className="text-white/60 mt-3 text-lg font-medium max-w-xl">
          Find trusted local businesses across Columbus — from dining to home
          improvement.
        </p>
      </div>

      {/* Category Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        {cats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 text-center">
            <div className="text-6xl opacity-30">🏢</div>
            <p className="text-white/50 font-semibold text-xl">
              No service categories yet.
            </p>
            <p className="text-white/30 text-sm">
              Check back soon — categories are being set up.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cats.map((cat) => {
              const img =
                cat.image_url || SERVICE_FALLBACK_IMAGES[cat.slug] || DEFAULT_SERVICE_IMAGE;

              return (
                <Link
                  key={cat.id}
                  href={`/services/${cat.slug}`}
                  className="group block"
                >
                  <div className="relative w-full h-72 rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 hover:shadow-2xl hover:shadow-black/30 transition-all duration-500">
                    {/* Image */}
                    <Image
                      src={img}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020C1B]/95 via-[#020C1B]/40 to-transparent" />

                    {/* Icon badge */}
                    {cat.icon && (
                      <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-lg group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                        {cat.icon}
                      </div>
                    )}

                    {/* Provider count */}
                    <div className="absolute top-4 right-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/10">
                        {cat.provider_count}{" "}
                        {cat.provider_count === 1 ? "listing" : "listings"}
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
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
