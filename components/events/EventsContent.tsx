"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

export interface Event {
  id: string;
  title: string;
  slug: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  description: string | null;
  price: string | null;
  category: string | null;
  is_featured: boolean;
  image_url: string | null;
}

import { EVENT_FALLBACK_IMAGES } from "@/lib/constants/images";

const TAG_COLOURS: Record<string, string> = {
  SPORTS:    "bg-blue-100 text-blue-700",
  MUSIC:     "bg-purple-100 text-purple-700",
  FOOD:      "bg-orange-100 text-orange-700",
  COMMUNITY: "bg-green-100 text-green-700",
  FAIR:      "bg-rose-100 text-rose-700",
  ART:       "bg-pink-100 text-pink-700",
  FAMILY:    "bg-teal-100 text-teal-700",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatTime(t: string | null): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

type DateFilter = "all" | "week" | "month";

function inDateRange(dateStr: string, filter: DateFilter): boolean {
  if (filter === "all") return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateStr + "T00:00:00");
  if (filter === "week") {
    const end = new Date(today);
    end.setDate(end.getDate() + 7);
    return eventDate >= today && eventDate <= end;
  }
  if (filter === "month") {
    const end = new Date(today);
    end.setMonth(end.getMonth() + 1);
    return eventDate >= today && eventDate <= end;
  }
  return true;
}

export default function EventsContent({ events }: { events: Event[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDateFilter, setActiveDateFilter] = useState<DateFilter>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => { if (e.category) set.add(e.category.toUpperCase()); });
    return Array.from(set).sort();
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const catMatch =
        activeCategory === "all" ||
        (e.category?.toUpperCase() ?? "") === activeCategory;
      const dateMatch = inDateRange(e.event_date, activeDateFilter);
      return catMatch && dateMatch;
    });
  }, [events, activeCategory, activeDateFilter]);

  const featured = filtered.filter((e) => e.is_featured);
  const rest = filtered.filter((e) => !e.is_featured);

  const DATE_LABELS: Record<DateFilter, string> = {
    all: "All Dates",
    week: "This Week",
    month: "This Month",
  };

  return (
    <div>
      {/* ── Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        {/* Category tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {["all", ...categories].map((cat) => {
            const isActive = activeCategory === cat;
            const label = cat === "all" ? "All" : cat.charAt(0) + cat.slice(1).toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-accent text-[#020C1B] shadow-lg shadow-amber-500/20"
                    : "bg-white/60 backdrop-blur-sm border border-white/80 text-gray-600 shadow-sm shadow-gray-200/40 hover:bg-white/80 hover:text-gray-900 hover:shadow-md"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-2 sm:ml-auto">
          {(["all", "week", "month"] as DateFilter[]).map((d) => (
            <button
              key={d}
              onClick={() => setActiveDateFilter(d)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                activeDateFilter === d
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white/60 backdrop-blur-sm border border-white/80 text-gray-600 shadow-sm shadow-gray-200/40 hover:bg-white/80 hover:text-gray-900 hover:shadow-md"
              }`}
            >
              {DATE_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 gap-4 text-center">
          <div className="text-6xl opacity-30">📅</div>
          <p className="text-gray-500 font-semibold text-xl">No events found.</p>
          <p className="text-gray-400 text-sm">Try a different filter or check back soon.</p>
        </div>
      )}

      {/* ── Featured events ── */}
      {featured.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-accent font-bold text-sm tracking-widest uppercase">★ Featured</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((event, idx) => {
              const img = event.image_url || EVENT_FALLBACK_IMAGES[idx % EVENT_FALLBACK_IMAGES.length];
              const tag = (event.category || "EVENT").toUpperCase();
              const tagClass = TAG_COLOURS[tag] ?? "bg-gray-100 text-gray-700";
              return (
                <Link key={event.id} href={`/events/${event.slug}`} className="group block">
                  <div className="relative w-full h-72 rounded-3xl overflow-hidden shadow-lg shadow-gray-200/60 hover:shadow-2xl hover:shadow-gray-300/60 transition-all duration-500">
                    <Image
                      src={img}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020C1B]/90 via-[#020C1B]/30 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-black tracking-widest uppercase bg-accent text-[#020C1B] px-3 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-3 inline-block ${tagClass}`}>
                        {tag}
                      </span>
                      <h2 className="text-2xl font-black text-white leading-tight mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {event.title}
                      </h2>
                      <div className="flex items-center gap-4 text-xs text-white/70 font-medium">
                        <span>📅 {formatDate(event.event_date)}</span>
                        {event.event_time && <span>🕐 {formatTime(event.event_time)}</span>}
                        {event.location && <span>📍 {event.location}</span>}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:bg-accent group-hover:text-[#020C1B] group-hover:border-accent transition-all duration-400">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── All events grid ── */}
      {rest.length > 0 && (
        <section>
          {featured.length > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-gray-400 font-bold text-sm tracking-widest uppercase">All Events</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((event, idx) => {
              const img = event.image_url || EVENT_FALLBACK_IMAGES[idx % EVENT_FALLBACK_IMAGES.length];
              const tag = (event.category || "EVENT").toUpperCase();
              const tagClass = TAG_COLOURS[tag] ?? "bg-gray-100 text-gray-700";
              const isFree = event.price?.toLowerCase() === "free";
              return (
                <Link key={event.id} href={`/events/${event.slug}`} className="group block">
                  <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 hover:bg-white/90 hover:shadow-2xl hover:shadow-gray-300/60 hover:border-white transition-all duration-400">
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={img}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${tagClass}`}>
                          {tag}
                        </span>
                      </div>
                      {event.price && (
                        <div className="absolute top-3 right-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${isFree ? "bg-green-500/90 text-white" : "bg-white/20 backdrop-blur-sm text-white"}`}>
                            {isFree ? "FREE" : event.price}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-black text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                      <div className="flex flex-col gap-1.5 text-xs text-gray-400 font-medium">
                        <div className="flex items-center gap-2">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span>{formatDate(event.event_date)}{event.event_time ? ` · ${formatTime(event.event_time)}` : ""}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
