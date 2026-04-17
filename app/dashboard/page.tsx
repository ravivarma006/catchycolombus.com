import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Dashboard — Catch Columbus",
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

  const role = profile?.role ?? "visitor";
  const isBusiness = role === "business_user";
  const isAdmin    = role === "admin";

  // Business users & admins are the only ones who should be here
  // Visitors see the "upgrade to business" prompt

  // Fetch provider-only counts + listings for business users
  const [
    { count: pendingProviders },
    { count: changesProviders },
    { count: approvedProviders },
    { count: rejectedProviders },
    { data: myListings },
  ] = await Promise.all([
    supabase.from("provider_requests").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "pending"),
    supabase.from("provider_requests").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "needs_changes"),
    supabase.from("provider_requests").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "approved"),
    supabase.from("provider_requests").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "rejected"),
    // Live approved listings for this user
    (isBusiness || isAdmin)
      ? supabase
          .from("service_providers")
          .select("id, name, slug, image_url, address, phone, is_active, category:service_categories!category_id(name, slug)")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("approved_at", { ascending: false })
      : Promise.resolve({ data: null }),
  ]);

  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const listings  = (myListings ?? []) as any[];

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

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-16">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-[2px] w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
              {isAdmin ? "Account" : "Business Dashboard"}
            </span>
          </div>
          <h1
            className="text-3xl md:text-5xl font-black text-white tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Welcome back,{" "}
            <span style={{ color: "var(--accent)" }}>{firstName}</span>
          </h1>
          <p className="text-white/45 mt-2 text-sm">
            {user.email} ·{" "}
            <span className="capitalize font-semibold text-white/65">{role.replace("_", " ")}</span>
          </p>
        </div>

        {/* ── Admin shortcut (top if admin) ── */}
        {isAdmin && (
          <Link
            href="/admin"
            className="group flex items-center justify-between w-full bg-primary/20 hover:bg-primary/30 border border-primary/40 hover:border-primary/60 rounded-2xl px-6 py-4 transition-all mb-6"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="text-white font-bold text-sm">Go to Admin Dashboard</p>
                <p className="text-white/45 text-xs">Manage submissions, listings, events, coupons &amp; more</p>
              </div>
            </div>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              className="text-white/35 group-hover:text-accent transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}

        {/* ── Needs-changes alert ── */}
        {(changesProviders ?? 0) > 0 && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-4 flex items-start gap-3">
            <span className="text-amber-400 text-xl shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-amber-300 font-bold text-sm">
                {changesProviders} business listing{(changesProviders ?? 0) !== 1 ? "s" : ""} need your attention
              </p>
              <p className="text-amber-300/60 text-xs mt-0.5">
                Admin left feedback on your submission.{" "}
                <Link href="/dashboard/submissions" className="underline hover:text-amber-200 font-semibold">
                  View &amp; resubmit →
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* ── Visitor upgrade prompt ── */}
        {role === "visitor" && (
          <div
            className="rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
            style={{ background: "rgba(245,168,0,0.08)", border: "1px solid rgba(245,168,0,0.2)" }}
          >
            <div>
              <p className="text-white font-bold text-sm">Own a business in Columbus?</p>
              <p className="text-white/45 text-xs mt-0.5">
                Register a business account to list your services for free.
              </p>
            </div>
            <Link
              href="/auth/business-signup"
              className="shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
              style={{ background: "#F5A800", color: "#020C1B", fontFamily: "'Outfit', sans-serif" }}
            >
              Register Business
            </Link>
          </div>
        )}

        {/* ── Stats row (business / admin only) ── */}
        {(isBusiness || isAdmin) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Pending",        value: pendingProviders  ?? 0, color: "text-blue-300" },
              { label: "Needs Changes",  value: changesProviders  ?? 0, color: (changesProviders ?? 0) > 0 ? "text-amber-400" : "text-white" },
              { label: "Approved",       value: approvedProviders ?? 0, color: "text-green-400" },
              { label: "Rejected",       value: rejectedProviders ?? 0, color: (rejectedProviders ?? 0) > 0 ? "text-red-400" : "text-white/70" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/[0.06] border border-white/10 rounded-2xl p-4 md:p-5">
                <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-1 leading-tight">
                  {stat.label}
                </p>
                <p className={`text-3xl md:text-4xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Primary CTA: Add New Listing (business users) ── */}
        {(isBusiness || isAdmin) && (
          <Link
            href="/services/submit"
            className="group block w-full rounded-2xl p-6 md:p-7 mb-6 transition-all hover:scale-[1.005]"
            style={{
              background: "linear-gradient(135deg, rgba(245,168,0,0.15) 0%, rgba(245,168,0,0.05) 100%)",
              border: "1px solid rgba(245,168,0,0.3)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl"
                style={{ background: "rgba(245,168,0,0.2)", border: "1px solid rgba(245,168,0,0.3)" }}
              >
                ➕
              </div>
              <div className="flex-1 min-w-0">
                <h2
                  className="text-white font-black text-lg md:text-xl mb-1"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Add a New Business Listing
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  Submit your business details with photos — admin reviews and approves within 1–2 business days.
                </p>
              </div>
              <svg
                width="24" height="24" fill="none" stroke="#F5A800" strokeWidth="2" viewBox="0 0 24 24"
                className="shrink-0 group-hover:translate-x-1 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        )}

        {/* ── Live Listings ── */}
        {(isBusiness || isAdmin) && listings.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-white font-black text-lg flex items-center gap-2"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Your Live Listings ({listings.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listings.map((listing: any) => {
                const cat = Array.isArray(listing.category) ? listing.category[0] : listing.category;
                const publicUrl = cat?.slug && listing.slug
                  ? `/services/${cat.slug}/${listing.slug}`
                  : "/services";
                return (
                  <div
                    key={listing.id}
                    className="flex gap-4 items-start bg-white/[0.06] border border-green-500/20 rounded-2xl p-4 group hover:border-green-500/40 transition-all"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white/10 flex items-center justify-center">
                      {listing.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={listing.image_url} alt={listing.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🏢</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className="text-white font-black text-sm leading-tight truncate"
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          {listing.name}
                        </h3>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
                          Live
                        </span>
                      </div>
                      {cat?.name && <p className="text-white/40 text-xs mt-0.5">{cat.name}</p>}
                      {listing.address && <p className="text-white/30 text-xs mt-0.5 truncate">{listing.address}</p>}
                      <Link
                        href={publicUrl}
                        className="inline-flex items-center gap-1 mt-2 text-xs text-accent hover:text-yellow-300 font-semibold transition-colors"
                      >
                        View public listing
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── My Submissions link ── */}
        {(isBusiness || isAdmin) && (
          <Link
            href="/dashboard/submissions"
            className="group flex items-center justify-between w-full bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 hover:border-white/20 rounded-2xl px-6 py-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📋</span>
              <div>
                <p className="text-white font-bold text-sm">My Submissions</p>
                <p className="text-white/45 text-xs">Track all your listing requests and their status</p>
              </div>
            </div>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              className="text-white/35 group-hover:text-accent transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}

        {/* ── Empty state for business user with no listings ── */}
        {isBusiness && listings.length === 0 && (pendingProviders ?? 0) === 0 && (changesProviders ?? 0) === 0 && (approvedProviders ?? 0) === 0 && (
          <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-10 text-center mt-8">
            <div className="text-5xl mb-4 opacity-40">🏢</div>
            <p className="text-white/60 font-bold text-base mb-1">No listings yet</p>
            <p className="text-white/35 text-sm">
              Click &ldquo;Add a New Business Listing&rdquo; above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
