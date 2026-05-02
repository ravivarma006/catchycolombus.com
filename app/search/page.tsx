import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search events, services, coupons, and things to do in Columbus, Ohio.",
};

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q || "").trim();
  const supabase = createClient();

  type EventResult = { id: string; title: string; location: string | null; event_date: string | null; image_url: string | null; slug: string };
  type ProviderResult = { id: string; business_name: string; address: string | null; image_url: string | null; slug: string; service_categories: { name: string; slug: string } | null };
  type CouponResult = { id: string; product_service_name: string; description: string | null; coupon_code: string | null; image_url: string | null };
  type ActivityResult = { id: string; name: string; short_description: string | null; image_url: string | null; slug: string; activity_categories: { name: string; slug: string } | null };

  let events: EventResult[] = [];
  let providers: ProviderResult[] = [];
  let coupons: CouponResult[] = [];
  let activities: ActivityResult[] = [];

  if (query) {
    const [eventsRes, providersRes, couponsRes, activitiesRes] = await Promise.all([
      supabase
        .from("events")
        .select("id, title, location, event_date, image_url, slug")
        .eq("is_active", true)
        .ilike("title", `%${query}%`)
        .limit(6),

      supabase
        .from("service_providers")
        .select("id, business_name, address, image_url, slug, service_categories ( name, slug )")
        .eq("is_active", true)
        .ilike("business_name", `%${query}%`)
        .limit(6),

      supabase
        .from("coupons")
        .select("id, product_service_name, description, coupon_code, image_url")
        .eq("is_active", true)
        .or(`product_service_name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(6),

      supabase
        .from("activities")
        .select("id, name, short_description, image_url, slug, activity_categories ( name, slug )")
        .eq("is_active", true)
        .ilike("name", `%${query}%`)
        .limit(6),
    ]);

    events = (eventsRes.data ?? []) as EventResult[];
    providers = (providersRes.data ?? []) as unknown as ProviderResult[];
    coupons = (couponsRes.data ?? []) as CouponResult[];
    activities = (activitiesRes.data ?? []) as unknown as ActivityResult[];
  }

  const totalResults = events.length + providers.length + coupons.length + activities.length;

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
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-20">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
              Columbus, Ohio
            </span>
          </div>
          <h1
            className="text-5xl font-black text-white tracking-tight mb-8"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Search
          </h1>

          {/* Search form */}
          <form method="GET" action="/search" className="flex gap-3">
            <input
              name="q"
              type="text"
              defaultValue={query}
              placeholder="Search events, services, coupons, things to do..."
              autoFocus
              className="flex-1 bg-white/[0.06] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
            />
            <button
              type="submit"
              className="bg-accent hover:bg-yellow-400 text-[#020C1B] font-black px-6 py-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-95"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {query && (
          <div className="mb-6">
            <p className="text-white/40 text-sm">
              {totalResults === 0
                ? `No results for "${query}"`
                : `${totalResults} result${totalResults !== 1 ? "s" : ""} for "${query}"`}
            </p>
          </div>
        )}

        {query && totalResults === 0 && (
          <div className="text-center py-16">
            <p className="text-white/30 text-lg mb-6">Nothing found. Try a different search.</p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/events" className="text-accent hover:underline">Browse Events</Link>
              <span className="text-white/20">·</span>
              <Link href="/services" className="text-accent hover:underline">Browse Services</Link>
              <span className="text-white/20">·</span>
              <Link href="/coupons" className="text-accent hover:underline">Browse Coupons</Link>
              <span className="text-white/20">·</span>
              <Link href="/things-to-do" className="text-accent hover:underline">Things to Do</Link>
            </div>
          </div>
        )}

        {/* Events */}
        {events.length > 0 && (
          <Section title="Events" count={events.length} href="/events">
            {events.map((e) => (
              <ResultCard
                key={e.id}
                href={`/events/${e.slug}`}
                image={e.image_url}
                title={e.title}
                subtitle={[e.location, e.event_date ? new Date(e.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null].filter(Boolean).join(" · ")}
                tag="Event"
                tagColor="bg-blue-500/20 text-blue-300"
              />
            ))}
          </Section>
        )}

        {/* Services */}
        {providers.length > 0 && (
          <Section title="Services" count={providers.length} href="/services">
            {providers.map((p) => (
              <ResultCard
                key={p.id}
                href={`/services/${p.service_categories?.slug ?? ""}/${p.slug}`}
                image={p.image_url}
                title={p.business_name}
                subtitle={[p.service_categories?.name, p.address].filter(Boolean).join(" · ")}
                tag="Service"
                tagColor="bg-teal-500/20 text-teal-300"
              />
            ))}
          </Section>
        )}

        {/* Coupons */}
        {coupons.length > 0 && (
          <Section title="Coupons & Deals" count={coupons.length} href="/coupons">
            {coupons.map((c) => (
              <ResultCard
                key={c.id}
                href={`/coupons/${c.id}`}
                image={c.image_url}
                title={c.product_service_name}
                subtitle={c.coupon_code ? `Code: ${c.coupon_code}` : (c.description?.slice(0, 80) ?? "")}
                tag="Coupon"
                tagColor="bg-amber-500/20 text-amber-300"
              />
            ))}
          </Section>
        )}

        {/* Things to Do */}
        {activities.length > 0 && (
          <Section title="Things to Do" count={activities.length} href="/things-to-do">
            {activities.map((a) => (
              <ResultCard
                key={a.id}
                href={`/things-to-do/${a.activity_categories?.slug ?? ""}/${a.slug}`}
                image={a.image_url}
                title={a.name}
                subtitle={[a.activity_categories?.name, a.short_description?.slice(0, 60)].filter(Boolean).join(" · ")}
                tag="Activity"
                tagColor="bg-violet-500/20 text-violet-300"
              />
            ))}
          </Section>
        )}

        {/* Empty state — no query */}
        {!query && (
          <div className="text-center py-16">
            <p className="text-white/30 text-base mb-8">
              Search across all of Columbus — events, services, coupons, and things to do.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/events" className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition">Events</Link>
              <Link href="/services" className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition">Services</Link>
              <Link href="/coupons" className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition">Coupons</Link>
              <Link href="/things-to-do" className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition">Things to Do</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  count,
  href,
  children,
}: {
  title: string;
  count: number;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-lg font-bold text-white"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {title}
          <span className="ml-2 text-white/30 text-sm font-normal">({count})</span>
        </h2>
        <Link href={href} className="text-xs text-accent hover:underline font-semibold">
          See all →
        </Link>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ResultCard({
  href,
  image,
  title,
  subtitle,
  tag,
  tagColor,
}: {
  href: string;
  image: string | null;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/10 rounded-2xl p-4 transition-all group"
    >
      {image ? (
        <div
          className="w-14 h-14 rounded-xl flex-shrink-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      ) : (
        <div className="w-14 h-14 rounded-xl flex-shrink-0 bg-white/5 flex items-center justify-center">
          <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm group-hover:text-accent transition truncate">
          {title}
        </p>
        {subtitle && (
          <p className="text-white/40 text-xs mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
      <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg ${tagColor}`}>
        {tag}
      </span>
    </Link>
  );
}
