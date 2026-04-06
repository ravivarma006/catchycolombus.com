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
  const { data: { user } } = await supabase.auth.getUser();
  let canSubmit = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    canSubmit = profile?.role === "business_user" || profile?.role === "admin";
  }
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
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">Columbus, Ohio</span>
            </div>
            <h1
              className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Upcoming <span style={{ color: "var(--accent)" }}>Events</span>
            </h1>
            <p className="text-gray-500 mt-3 text-lg font-medium max-w-xl">
              Discover what&apos;s happening around Columbus in the next 3 months.
            </p>
          </div>

          {/* Submit CTA — only for business_user / admin */}
          {canSubmit && (
            <Link
              href="/events/submit"
              className="inline-flex items-center gap-2 bg-accent hover:bg-yellow-400 text-[#020C1B] font-bold text-sm px-6 py-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20 shrink-0 mt-2"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Submit an Event
            </Link>
          )}
        </div>
      </div>

      {/* Content with filters */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        <EventsContent events={events} />
      </div>
    </div>
  );
}
