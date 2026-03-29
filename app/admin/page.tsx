import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview" };

async function getCounts(supabase: ReturnType<typeof createClient>) {
  const [
    { count: pendingEvents },
    { count: pendingProviders },
    { count: pendingCoupons },
    { count: needsEvents },
    { count: needsProviders },
    { count: needsCoupons },
    { count: approvedEvents },
    { count: approvedProviders },
    { count: approvedCoupons },
    { count: activeAnnouncements },
    { count: totalSubscribers },
    { count: activeActivities },
  ] = await Promise.all([
    supabase.from("event_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("provider_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("coupon_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("event_requests").select("id", { count: "exact", head: true }).eq("status", "needs_changes"),
    supabase.from("provider_requests").select("id", { count: "exact", head: true }).eq("status", "needs_changes"),
    supabase.from("coupon_requests").select("id", { count: "exact", head: true }).eq("status", "needs_changes"),
    supabase.from("event_requests").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("provider_requests").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("coupon_requests").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("announcements").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("subscribers").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("activities").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);

  return {
    pending: (pendingEvents ?? 0) + (pendingProviders ?? 0) + (pendingCoupons ?? 0),
    pendingEvents:   pendingEvents   ?? 0,
    pendingProviders:pendingProviders?? 0,
    pendingCoupons:  pendingCoupons  ?? 0,
    needsChanges: (needsEvents ?? 0) + (needsProviders ?? 0) + (needsCoupons ?? 0),
    approved: (approvedEvents ?? 0) + (approvedProviders ?? 0) + (approvedCoupons ?? 0),
    activeAnnouncements: activeAnnouncements ?? 0,
    totalSubscribers: totalSubscribers ?? 0,
    activeActivities: activeActivities ?? 0,
  };
}

export default async function AdminOverviewPage() {
  const supabase = createClient();
  const counts = await getCounts(supabase);

  const SECTIONS = [
    {
      href:    "/admin/events",
      label:   "Event Requests",
      icon:    "📅",
      pending: counts.pendingEvents,
      color:   "from-blue-500/20 to-blue-600/10 border-blue-500/20",
      badge:   "bg-blue-500/20 text-blue-300",
    },
    {
      href:    "/admin/services",
      label:   "Business Listings",
      icon:    "🏢",
      pending: counts.pendingProviders,
      color:   "from-teal-500/20 to-teal-600/10 border-teal-500/20",
      badge:   "bg-teal-500/20 text-teal-300",
    },
    {
      href:    "/admin/coupons",
      label:   "Coupon Requests",
      icon:    "🏷️",
      pending: counts.pendingCoupons,
      color:   "from-amber-500/20 to-amber-600/10 border-amber-500/20",
      badge:   "bg-amber-500/20 text-amber-300",
    },
    {
      href:    "/admin/things-to-do",
      label:   "Things to Do",
      icon:    "🎯",
      pending: counts.activeActivities,
      color:   "from-cyan-500/20 to-cyan-600/10 border-cyan-500/20",
      badge:   "bg-cyan-500/20 text-cyan-300",
      badgeLabel: "listings",
    },
    {
      href:    "/admin/announcements",
      label:   "Announcements",
      icon:    "📢",
      pending: counts.activeAnnouncements,
      color:   "from-violet-500/20 to-violet-600/10 border-violet-500/20",
      badge:   "bg-violet-500/20 text-violet-300",
      badgeLabel: "active",
    },
    {
      href:    "/admin/subscribers",
      label:   "Subscribers",
      icon:    "📧",
      pending: counts.totalSubscribers,
      color:   "from-green-500/20 to-green-600/10 border-green-500/20",
      badge:   "bg-green-500/20 text-green-300",
      badgeLabel: "subscribed",
    },
  ];

  return (
    <div className="px-8 py-10 max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <h1
          className="text-4xl font-black text-white mb-2"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Admin Overview
        </h1>
        <p className="text-white/40 text-sm">
          Review and approve submitted requests from business users.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5 text-center">
          <p className={`text-4xl font-black mb-1 ${counts.pending > 0 ? "text-amber-400" : "text-white"}`}>
            {counts.pending}
          </p>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Pending</p>
        </div>
        <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5 text-center">
          <p className={`text-4xl font-black mb-1 ${counts.needsChanges > 0 ? "text-orange-400" : "text-white"}`}>
            {counts.needsChanges}
          </p>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Needs Changes</p>
        </div>
        <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-4xl font-black text-green-400 mb-1">{counts.approved}</p>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Approved</p>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 gap-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`group bg-gradient-to-r ${s.color} border rounded-2xl p-6 flex items-center justify-between hover:border-white/30 transition-all`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <h2 className="text-white font-black text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {s.label}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {s.pending > 0 ? (
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${s.badge}`}>
                      {s.pending} {"badgeLabel" in s ? (s as { badgeLabel: string }).badgeLabel : "pending"}
                    </span>
                  ) : (
                    <span className="text-xs text-white/30 font-medium">All clear</span>
                  )}
                </div>
              </div>
            </div>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
              className="text-white/30 group-hover:text-accent transition-colors shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
