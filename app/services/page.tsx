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

  // Role check for submit button (business_user + admin)
  const { data: { user } } = await supabase.auth.getUser();
  let canSubmit = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    canSubmit = profile?.role === "business_user" || profile?.role === "admin";
  }

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
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
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
              Services <span style={{ color: "var(--accent)" }}>Directory</span>
            </h1>
            <p className="text-gray-500 mt-3 text-lg font-medium max-w-xl">
              Find trusted local businesses across Columbus — from dining to home improvement.
            </p>
          </div>

          {/* Submit CTA — business_user + admin */}
          {canSubmit && (
            <Link
              href="/services/submit"
              className="inline-flex items-center gap-2 bg-accent hover:bg-yellow-400 text-[#020C1B] font-bold text-sm px-6 py-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20 shrink-0 mt-2"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Submit Your Business Here
            </Link>
          )}
        </div>
      </div>

      {/* Category Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        {cats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 text-center">
            <div className="text-6xl opacity-30">🏢</div>
            <p className="text-gray-500 font-semibold text-xl">
              No service categories yet.
            </p>
            <p className="text-gray-400 text-sm">
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
                  <div className="relative w-full h-72 rounded-3xl overflow-hidden bg-white/60 backdrop-blur-sm border border-white/80 shadow-lg shadow-gray-200/60 hover:shadow-2xl hover:shadow-gray-300/60 hover:border-white transition-all duration-500">
                    {/* Image */}
                    <Image
                      src={img}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

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
