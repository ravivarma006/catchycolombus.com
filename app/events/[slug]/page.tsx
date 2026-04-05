import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

interface EventDetail {
  id: string;
  title: string;
  slug: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  price: string;
  website: string | null;
  category: string | null;
  is_featured: boolean;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(t: string | null): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("title, description")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!data) return { title: "Event Not Found — Catch Columbus" };

  return {
    title: `${data.title} — Catch Columbus`,
    description: data.description ?? `${data.title} event in Columbus, Ohio.`,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();

  const { data: event } = await supabase
    .from("events")
    .select(
      "id, title, slug, event_date, event_time, location, description, image_url, price, website, category, is_featured"
    )
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single<EventDetail>();

  if (!event) notFound();

  const isFree = event.price?.toLowerCase() === "free";
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://catchcolumbus.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description ?? undefined,
    startDate: event.event_time
      ? `${event.event_date}T${event.event_time}`
      : event.event_date,
    location: event.location
      ? { "@type": "Place", name: event.location, address: { "@type": "PostalAddress", addressLocality: "Columbus", addressRegion: "OH" } }
      : undefined,
    image: event.image_url ?? undefined,
    url: `${SITE_URL}/events/${event.slug}`,
    organizer: { "@type": "Organization", name: "Catch Columbus", url: SITE_URL },
    offers: {
      "@type": "Offer",
      price: isFree ? "0" : event.price,
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative w-full h-72 md:h-96 bg-primary overflow-hidden">
        {event.image_url ? (
          <>
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        )}

        {/* Back button */}
        <div className="absolute top-5 left-5 z-10">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium bg-black/20 hover:bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
          <div className="max-w-4xl mx-auto">
            {event.category && (
              <span className="inline-block text-xs font-bold tracking-widest uppercase bg-accent text-primary px-3 py-1 rounded-full mb-3">
                {event.category}
              </span>
            )}
            <h1
              className="text-3xl md:text-5xl font-black text-white leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {event.title}
              {event.is_featured && (
                <span className="ml-3 text-accent text-2xl">★</span>
              )}
            </h1>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Details card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Event Details</h2>

              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-primary">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Date</p>
                  <p className="text-sm font-semibold text-gray-800">{formatDate(event.event_date)}</p>
                </div>
              </div>

              {/* Time */}
              {event.event_time && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-primary">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Time</p>
                    <p className="text-sm font-semibold text-gray-800">{formatTime(event.event_time)}</p>
                  </div>
                </div>
              )}

              {/* Location */}
              {event.location && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-primary">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Location</p>
                    <p className="text-sm font-semibold text-gray-800">{event.location}</p>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-primary">
                    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Price</p>
                  <p className={`text-sm font-bold ${isFree ? "text-green-600" : "text-amber-600"}`}>
                    {event.price}
                  </p>
                </div>
              </div>

              {/* Website CTA */}
              {event.website && (
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent/90 text-primary font-bold text-sm py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95 mt-2"
                >
                  Visit Website
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            {event.description ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">About This Event</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-center h-32">
                <p className="text-gray-400 text-sm">No description available.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
    </>
  );
}
