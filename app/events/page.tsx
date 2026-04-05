import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EventsContent, { type Event } from "@/components/events/EventsContent";

export const revalidate = 300; // 5 minutes

export const metadata: Metadata = {
  title: "Events in Columbus — Catch Columbus",
  description:
    "Discover upcoming events in Columbus, Ohio. Browse sports, music, food, community events and more.",
};

export default async function EventsPage() {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];
  const end = new Date();
  end.setMonth(end.getMonth() + 3);
  const endDate = end.toISOString().split("T")[0];

  const { data } = await supabase
    .from("events")
    .select(
      "id, title, slug, event_date, event_time, location, description, price, category, is_featured, image_url"
    )
    .eq("is_active", true)
    .gte("event_date", today)
    .lte("event_date", endDate)
    .order("event_date", { ascending: true });

  const events = (data ?? []) as Event[];

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)" }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/15 blur-[130px]" />
        <div className="absolute top-[40%] left-[35%] w-[40%] h-[40%] rounded-full bg-violet-600/15 blur-[110px]" />
      </div>

      {/* Page Header */}
      <div className="relative z-10 pt-16 pb-10 px-4 max-w-7xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-accent" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">Columbus, Ohio</span>
            </div>
            <h1
              className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Upcoming <span style={{ color: "var(--accent)" }}>Events</span>
            </h1>
            <p className="text-white/60 mt-3 text-lg font-medium max-w-xl">
              Discover what&apos;s happening around Columbus in the next 3 months.
            </p>
          </div>

          {/* Submit CTA */}
          <Link
            href="/events/submit"
            className="inline-flex items-center gap-2 bg-accent hover:bg-yellow-400 text-[#020C1B] font-bold text-sm px-6 py-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20 shrink-0 mt-2"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Submit an Event
          </Link>
        </div>
      </div>

      {/* Content with filters */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        <EventsContent events={events} />
      </div>
    </div>
  );
}
