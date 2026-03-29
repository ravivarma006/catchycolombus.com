"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

import { EVENT_FALLBACK_IMAGES } from "@/lib/constants/images";

interface CalendarEvent {
  id: string;
  slug: string;
  date: number; // day of month
  event_date: string; // YYYY-MM-DD
  tag: string;
  title: string;
  desc: string;
  time: string;
  location: string;
  image: string;
}

/* ── Event Detail Modal ── */
function EventModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const formattedDate = new Date(event.event_date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0D1B3E 0%, #1A1040 100%)", border: "1px solid rgba(255,255,255,0.12)" }}
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 24 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Hero Image */}
        <div className="relative w-full h-52 shrink-0">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="512px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E]/90 via-[#0D1B3E]/20 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="text-[10px] font-black tracking-widest uppercase bg-accent text-[#020C1B] px-3 py-1 rounded-full">
              {event.tag}
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
            aria-label="Close"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3
            className="text-2xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {event.title}
          </h3>

          {/* Meta rows */}
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex items-center gap-3 text-sm text-white/70">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <svg width="14" height="14" fill="none" stroke="var(--accent)" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <svg width="14" height="14" fill="none" stroke="var(--accent)" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <svg width="14" height="14" fill="none" stroke="var(--accent)" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                </svg>
              </div>
              <span>{event.location}</span>
            </div>
          </div>

          {/* Description */}
          {event.desc && (
            <p className="text-sm text-white/60 leading-relaxed mb-6 border-t border-white/10 pt-5">
              {event.desc}
            </p>
          )}

          {/* CTA */}
          <Link
            href={`/events/${event.slug}`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-[#e09e00] text-[#020C1B] font-bold text-sm py-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-95"
          >
            View Full Details
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
            </svg>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

function formatTime(t: string | null): string {
  if (!t) return "TBD";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */
export default function EventsCalendarSection() {
  const today = new Date();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-based
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDate, setActiveDate] = useState<number | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ── Fetch events from Supabase on mount ── */
  useEffect(() => {
    const fetchEvents = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("events")
        .select("id, slug, title, event_date, event_time, location, description, image_url, category")
        .eq("is_active", true)
        .gte("event_date", today.toISOString().split("T")[0])
        .order("event_date", { ascending: true })
        .limit(50);

      if (data) {
        const mapped: CalendarEvent[] = data.map((e, idx) => ({
          id: e.id,
          slug: e.slug,
          // parse day safely without timezone issues
          date: parseInt(e.event_date.split("-")[2], 10),
          event_date: e.event_date,
          tag: (e.category || "EVENT").toUpperCase(),
          title: e.title,
          desc: e.description || "",
          time: formatTime(e.event_time),
          location: e.location || "Columbus, OH",
          image: e.image_url || EVENT_FALLBACK_IMAGES[idx % EVENT_FALLBACK_IMAGES.length],
        }));
        setAllEvents(mapped);
      }
      setLoading(false);
    };

    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Events for currently viewed month ── */
  const monthEvents = useMemo(() => {
    const monthStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
    return allEvents.filter((e) => e.event_date.startsWith(monthStr));
  }, [allEvents, viewYear, viewMonth]);

  /* Triple for seamless infinite scroll */
  const scrollEvents = useMemo(() => {
    if (monthEvents.length === 0) return [];
    return [...monthEvents, ...monthEvents, ...monthEvents];
  }, [monthEvents]);

  /* ── Calendar grid computed values ── */
  const daysInMonth = useMemo(
    () => new Date(viewYear, viewMonth + 1, 0).getDate(),
    [viewYear, viewMonth]
  );
  const firstDayOfWeek = useMemo(
    () => new Date(viewYear, viewMonth, 1).getDay(),
    [viewYear, viewMonth]
  );
  const monthLabel = useMemo(
    () =>
      new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [viewYear, viewMonth]
  );

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
    setActiveDate(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
    setActiveDate(null);
  };

  /* ── Infinite Auto-Scroll Logic ── */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !autoScroll || isHovered || scrollEvents.length === 0) return;

    // Cache once — recalculating every frame can cause 1px drift → visible jump
    const oneSetHeight = el.scrollHeight / 3;

    // Start in the middle set so we can scroll both directions
    if (el.scrollTop < oneSetHeight) {
      el.scrollTop = oneSetHeight;
    }

    let rAF: number;
    let lastTime = performance.now();

    const scroll = (time: number) => {
      const dt = Math.min(time - lastTime, 64); // cap dt to avoid huge jumps after tab switch
      lastTime = time;

      el.scrollTop += dt * 0.04;

      // Seamless loop: reset position without any CSS smooth interference
      if (el.scrollTop >= oneSetHeight * 2) {
        el.scrollTop -= oneSetHeight;
      } else if (el.scrollTop <= 0) {
        el.scrollTop += oneSetHeight;
      }

      rAF = requestAnimationFrame(scroll);
    };

    rAF = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(rAF);
  }, [autoScroll, isHovered, scrollEvents]);

  /* ── Interactive Date Click ── */
  const handleDateClick = useCallback(
    (date: number) => {
      setActiveDate(date);

      const eventExists = monthEvents.some((e) => e.date === date);
      if (!eventExists) return;

      setAutoScroll(false);

      const targetId = `event-card-${date}-1`;
      const targetEl = document.getElementById(targetId);

      if (targetEl && scrollRef.current) {
        const container = scrollRef.current;
        const targetRect = targetEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollTopTarget =
          container.scrollTop +
          (targetRect.top - containerRect.top) -
          containerRect.height / 2 +
          targetRect.height / 2;

        container.scrollTo({ top: scrollTopTarget, behavior: "smooth" });
      }

      setTimeout(() => {
        setAutoScroll(true);
        setActiveDate(null);
      }, 4000);
    },
    [monthEvents]
  );

  return (
    <section
      className="relative w-full py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #020C1B 0%, #0D1B3E 40%, #1A1040 70%, #0A0E27 100%)",
      }}
    >
      {/* ── BACKGROUND MESH GRADIENT ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-indigo-500/25 blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-violet-600/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-12">
          <h2
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Upcoming <span style={{ color: "var(--accent)" }}>Events</span>
          </h2>
          <p className="text-white/60 mt-2 font-medium">
            Discover what&apos;s happening around Columbus this month.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── LEFT COLUMN : CALENDAR WIDGET ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-[380px] shrink-0"
          >
            {/* Calendar Glass UI */}
            <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-blue-900/5 rounded-3xl p-6 sm:p-8">

              {/* Header: Month & Arrows */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-gray-900 text-lg">{monthLabel}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={prevMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow hover:bg-gray-50 transition text-gray-500"
                    aria-label="Previous month"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow hover:bg-gray-50 transition text-gray-900"
                    aria-label="Next month"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-400">
                    {d}
                  </div>
                ))}
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                {/* Empty slots for first day of week */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((date) => {
                  const isActive = date === activeDate;
                  const hasEvent = monthEvents.some((e) => e.date === date);

                  return (
                    <button
                      key={date}
                      onClick={() => handleDateClick(date)}
                      className={`relative flex items-center justify-center w-8 h-8 mx-auto rounded-full text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white shadow-lg scale-110"
                          : hasEvent
                          ? "text-primary hover:bg-blue-50 bg-white shadow-sm ring-1 ring-blue-100"
                          : "text-gray-700 hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      {date}
                      {hasEvent && !isActive && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN : EVENTS SCROLLER ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex-1 overflow-hidden relative rounded-3xl"
            style={{ height: "600px" }}
          >
            {/* Loading state */}
            {loading && (
              <div className="h-full flex items-center justify-center">
                <div className="text-white/50 text-sm font-medium">Loading events…</div>
              </div>
            )}

            {/* Empty state */}
            {!loading && monthEvents.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center gap-3 px-8 text-center">
                <div className="text-4xl opacity-30">📅</div>
                <p className="text-white/60 font-medium">No events scheduled for this month.</p>
                <p className="text-white/30 text-sm">Check back soon or browse another month.</p>
              </div>
            )}

            {/* Events scroller */}
            {!loading && scrollEvents.length > 0 && (
              <>
                {/* Top & Bottom Fade Masks */}
                <div
                  className="absolute inset-x-0 top-0 h-10 z-20 pointer-events-none"
                  style={{ background: "linear-gradient(to bottom, #0D1B3E, transparent)" }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-16 z-20 pointer-events-none"
                  style={{ background: "linear-gradient(to top, #0A0E27, transparent)" }}
                />

                <div
                  ref={scrollRef}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="h-full w-full overflow-y-auto scrollbar-hide flex flex-col gap-6 pt-4 pb-4"
                  style={{ scrollBehavior: "auto" }}
                >
                  {scrollEvents.map((evt, index) => {
                    const setIndex = Math.floor(index / monthEvents.length);
                    const isTargetActive = activeDate === evt.date && !autoScroll;

                    return (
                      <div
                        key={`${evt.id}-${index}`}
                        id={`event-card-${evt.date}-${setIndex}`}
                        onClick={() => { setSelectedEvent(evt); setAutoScroll(false); }}
                        className={`bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 mx-2 transition-all duration-500 group cursor-pointer
                          ${
                            isTargetActive
                              ? "shadow-2xl shadow-blue-900/20 scale-[1.03] bg-white ring-2 ring-primary/20 z-10 relative"
                              : "shadow-lg shadow-blue-900/5 hover:bg-white hover:shadow-xl"
                          }
                        `}
                      >
                        {/* Event Image */}
                        <div className="relative w-full sm:w-48 h-40 shrink-0 rounded-2xl overflow-hidden">
                          <Image
                            src={evt.image}
                            alt={evt.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, 192px"
                          />
                        </div>

                        {/* Event Details */}
                        <div className="flex flex-col justify-center flex-1">
                          <span className="text-xs font-bold tracking-widest text-primary mb-1 uppercase">
                            {evt.tag}
                          </span>
                          <h4
                            className="text-xl font-black text-gray-900 mb-2 leading-tight"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                          >
                            {evt.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                            {evt.desc}
                          </p>

                          {/* Time & Location */}
                          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {evt.time}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                              </svg>
                              {evt.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>

        </div>
      </div>

      {/* ── EVENT DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => { setSelectedEvent(null); setAutoScroll(true); }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
