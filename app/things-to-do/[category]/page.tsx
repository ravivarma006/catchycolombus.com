import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

interface Activity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  neighborhood: string | null;
  image_url: string | null;
  price_range: string | null;
  hours: string | null;
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("activity_categories")
    .select("name, description")
    .eq("slug", params.category)
    .eq("is_active", true)
    .single();

  if (!data) return { title: "Category Not Found — Catch Columbus" };

  return {
    title: `${data.name} — Things to Do — Catch Columbus`,
    description: data.description ?? `Explore ${data.name} in Columbus, Ohio.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const supabase = createClient();

  const { data: category } = await supabase
    .from("activity_categories")
    .select("id, name, slug, icon, description, image_url")
    .eq("slug", params.category)
    .eq("is_active", true)
    .single();

  if (!category) notFound();

  const { data: activities } = await supabase
    .from("activities")
    .select("id, name, slug, description, address, neighborhood, image_url, price_range, hours")
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("name", { ascending: true });

  const items: Activity[] = (activities ?? []) as Activity[];

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)" }}
    >
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/15 blur-[130px]" />
      </div>

      {/* Hero Banner */}
      <div className="relative z-10 w-full h-64 md:h-80 overflow-hidden">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020C1B] via-[#020C1B]/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-5 left-5 z-20">
          <Link
            href="/things-to-do"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium bg-black/20 hover:bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            All Things to Do
          </Link>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              {category.icon && <span className="text-3xl">{category.icon}</span>}
              <h1
                className="text-4xl md:text-5xl font-black text-white tracking-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {category.name}
              </h1>
            </div>
            {category.description && (
              <p className="text-white/60 text-base md:text-lg max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 pb-24">
        <p className="text-white/40 font-semibold text-sm tracking-widest uppercase mb-8">
          {items.length} {items.length === 1 ? "Listing" : "Listings"}
        </p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="text-5xl opacity-30">🎯</div>
            <p className="text-white/50 font-semibold text-lg">
              No activities listed yet.
            </p>
            <p className="text-white/30 text-sm">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((act) => (
              <Link
                key={act.id}
                href={`/things-to-do/${category.slug}/${act.slug}`}
                className="group block"
              >
                <div className="bg-white/[0.08] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-white/25 hover:bg-white/[0.12] hover:shadow-2xl hover:shadow-black/30 transition-all duration-500">
                  {/* Image */}
                  <div className="relative w-full h-48 overflow-hidden">
                    {act.image_url ? (
                      <Image
                        src={act.image_url}
                        alt={act.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Price badge */}
                    {act.price_range && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent text-[#020C1B]">
                          {act.price_range}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3
                      className="text-lg font-black text-white mb-2 leading-snug group-hover:text-accent transition-colors duration-300"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {act.name}
                    </h3>

                    {act.description && (
                      <p className="text-white/50 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {act.description}
                      </p>
                    )}

                    <div className="flex flex-col gap-1.5 text-xs text-white/40 font-medium">
                      {act.neighborhood && (
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-accent/60" />
                          <span>{act.neighborhood}</span>
                        </div>
                      )}
                      {act.address && (
                        <div className="flex items-center gap-2">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span className="truncate">{act.address}</span>
                        </div>
                      )}
                      {act.hours && (
                        <div className="flex items-center gap-2">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12,6 12,12 16,14" />
                          </svg>
                          <span className="truncate">{act.hours}</span>
                        </div>
                      )}
                    </div>
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
