import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Catch Columbus",
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  // Fetch pending counts across all three request types in parallel
  const [{ count: pendingEvents }, { count: pendingProviders }, { count: pendingCoupons }] =
    await Promise.all([
      supabase
        .from("event_requests")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "pending"),
      supabase
        .from("provider_requests")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "pending"),
      supabase
        .from("coupon_requests")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "pending"),
    ]);

  const [{ count: changesEvents }, { count: changesProviders }, { count: changesCoupons }] =
    await Promise.all([
      supabase
        .from("event_requests")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "needs_changes"),
      supabase
        .from("provider_requests")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "needs_changes"),
      supabase
        .from("coupon_requests")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "needs_changes"),
    ]);

  const totalPending = (pendingEvents ?? 0) + (pendingProviders ?? 0) + (pendingCoupons ?? 0);
  const totalChanges = (changesEvents ?? 0) + (changesProviders ?? 0) + (changesCoupons ?? 0);

  const role = profile?.role ?? "visitor";
  const name = profile?.full_name || user.email;

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)" }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/15 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">My Account</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Welcome back,{" "}
            <span style={{ color: "var(--accent)" }}>
              {profile?.full_name?.split(" ")[0] || "there"}
            </span>
          </h1>
          <p className="text-white/50 mt-2 text-base">
            {user.email} · <span className="capitalize font-semibold text-white/70">{role}</span>
          </p>
        </div>

        {/* Needs changes alert */}
        {totalChanges > 0 && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-4 flex items-start gap-3">
            <span className="text-amber-400 text-xl shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-amber-300 font-bold text-sm">
                {totalChanges} {totalChanges === 1 ? "submission requires" : "submissions require"} changes
              </p>
              <p className="text-amber-300/70 text-xs mt-0.5">
                An admin has reviewed your request and left feedback.{" "}
                <Link href="/dashboard/submissions" className="underline hover:text-amber-200 font-semibold">
                  View &amp; resubmit
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-5">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Pending Review</p>
            <p className="text-4xl font-black text-white">{totalPending}</p>
            <p className="text-white/40 text-xs mt-1">requests awaiting admin</p>
          </div>
          <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-5">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Needs Changes</p>
            <p className={`text-4xl font-black ${totalChanges > 0 ? "text-amber-400" : "text-white"}`}>
              {totalChanges}
            </p>
            <p className="text-white/40 text-xs mt-1">require your attention</p>
          </div>
          <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-5">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Account Role</p>
            <p className="text-xl font-black text-white capitalize mt-1">{role}</p>
            <p className="text-white/40 text-xs mt-1">{user.email}</p>
          </div>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Link
            href="/dashboard/submissions"
            className="group bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center text-lg">📋</div>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                className="text-white/30 group-hover:text-accent transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <h2 className="text-white font-black text-lg mb-1 group-hover:text-accent transition-colors"
              style={{ fontFamily: "'Outfit', sans-serif" }}>
              My Submissions
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              View and manage all your submitted events, businesses, and coupons.
            </p>
          </Link>

          <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-lg mb-4">➕</div>
            <h2 className="text-white font-black text-lg mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Submit New
            </h2>
            <div className="flex flex-col gap-2">
              <Link href="/events/submit"
                className="text-sm text-white/70 hover:text-accent transition-colors flex items-center gap-2 font-medium">
                <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-xs">📅</span>
                Submit an Event
              </Link>
              <Link href="/services/submit"
                className="text-sm text-white/70 hover:text-accent transition-colors flex items-center gap-2 font-medium">
                <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-xs">🏢</span>
                List Your Business
              </Link>
              <Link href="/coupons/submit"
                className="text-sm text-white/70 hover:text-accent transition-colors flex items-center gap-2 font-medium">
                <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-xs">🏷️</span>
                Submit a Coupon
              </Link>
            </div>
          </div>
        </div>

        {/* Admin shortcut */}
        {role === "admin" && (
          <Link
            href="/admin"
            className="group flex items-center justify-between w-full bg-primary/20 hover:bg-primary/30 border border-primary/40 hover:border-primary/60 rounded-2xl px-6 py-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="text-white font-bold text-sm">Admin Dashboard</p>
                <p className="text-white/50 text-xs">Manage requests, approve listings, and more</p>
              </div>
            </div>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              className="text-white/40 group-hover:text-accent transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
