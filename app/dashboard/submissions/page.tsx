import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import ResubmitButton from "./ResubmitButton";

export const metadata: Metadata = {
  title: "My Submissions — Catch Columbus",
};

type Status = "pending" | "approved" | "rejected" | "needs_changes";

interface EventReq {
  id: string;
  event_name: string;
  email: string;
  event_date: string | null;
  status: Status;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ProviderReq {
  id: string;
  business_name: string;
  email: string;
  status: Status;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface CouponReq {
  id: string;
  product_service_name: string;
  email: string;
  status: Status;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_STYLES: Record<Status, { label: string; className: string }> = {
  pending:       { label: "Pending Review",  className: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  approved:      { label: "Approved",        className: "bg-green-500/15 text-green-300 border-green-500/30" },
  rejected:      { label: "Rejected",        className: "bg-red-500/15 text-red-300 border-red-500/30" },
  needs_changes: { label: "Needs Changes",   className: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function StatusBadge({ status }: { status: Status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  return (
    <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${s.className}`}>
      {s.label}
    </span>
  );
}

export default async function SubmissionsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/dashboard/submissions");

  // Role: admins see all types; business users only see their business listings
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = profile?.role ?? "visitor";
  const showAllTypes = role === "admin";

  // Always fetch provider requests; fetch events/coupons only for admins
  const [
    { data: providerReqs },
    { data: eventReqs },
    { data: couponReqs },
  ] = await Promise.all([
    supabase
      .from("provider_requests")
      .select("id, business_name, email, status, admin_notes, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    showAllTypes
      ? supabase
          .from("event_requests")
          .select("id, event_name, email, event_date, status, admin_notes, created_at, updated_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    showAllTypes
      ? supabase
          .from("coupon_requests")
          .select("id, product_service_name, email, status, admin_notes, created_at, updated_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  const providers = (providerReqs ?? []) as ProviderReq[];
  const events    = (eventReqs    ?? []) as EventReq[];
  const coupons   = (couponReqs   ?? []) as CouponReq[];

  const totalAll = providers.length + events.length + coupons.length;

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

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-white/40 font-medium mb-6">
            <Link href="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-white/70">My Submissions</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            My <span style={{ color: "var(--accent)" }}>Submissions</span>
          </h1>
          <p className="text-white/50 mt-2 text-base">
            {totalAll === 0
              ? "You haven't submitted anything yet."
              : showAllTypes
              ? `${totalAll} total submission${totalAll !== 1 ? "s" : ""} across events, businesses, and coupons.`
              : `${providers.length} business listing${providers.length !== 1 ? "s" : ""} submitted.`}
          </p>
        </div>

        {totalAll === 0 ? (
          <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4 opacity-30">🏢</div>
            <p className="text-white/50 font-semibold text-lg mb-2">No listings yet</p>
            <p className="text-white/30 text-sm mb-6">
              Start by submitting your business for review.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/services/submit"
                className="bg-accent text-[#020C1B] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-yellow-400 transition-all">
                + List Your Business
              </Link>
              {showAllTypes && (
                <>
                  <Link href="/events/submit"
                    className="bg-white/10 border border-white/15 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all">
                    Submit Event
                  </Link>
                  <Link href="/coupons/submit"
                    className="bg-white/10 border border-white/15 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all">
                    Submit Coupon
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-10">

            {/* ── Events ── */}
            {events.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white/60 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    <span>📅</span> Event Submissions
                    <span className="text-white/30 font-normal normal-case tracking-normal">({events.length})</span>
                  </h2>
                  <Link href="/events/submit"
                    className="text-xs text-accent hover:text-yellow-300 font-semibold transition-colors flex items-center gap-1">
                    + Submit another
                  </Link>
                </div>
                <div className="space-y-3">
                  {events.map((req) => (
                    <SubmissionCard
                      key={req.id}
                      id={req.id}
                      type="event"
                      title={req.event_name}
                      subtitle={req.event_date ? `Event date: ${formatDate(req.event_date)}` : req.email}
                      status={req.status}
                      adminNotes={req.admin_notes}
                      createdAt={req.created_at}
                      updatedAt={req.updated_at}
                      editHref="/events/submit"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── Providers ── */}
            {providers.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white/60 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    <span>🏢</span> Business Listings
                    <span className="text-white/30 font-normal normal-case tracking-normal">({providers.length})</span>
                  </h2>
                  <Link href="/services/submit"
                    className="text-xs text-accent hover:text-yellow-300 font-semibold transition-colors">
                    + Submit another
                  </Link>
                </div>
                <div className="space-y-3">
                  {providers.map((req) => (
                    <SubmissionCard
                      key={req.id}
                      id={req.id}
                      type="provider"
                      title={req.business_name}
                      subtitle={req.email}
                      status={req.status}
                      adminNotes={req.admin_notes}
                      createdAt={req.created_at}
                      updatedAt={req.updated_at}
                      editHref="/services/submit"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── Coupons ── */}
            {coupons.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white/60 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    <span>🏷️</span> Coupon Submissions
                    <span className="text-white/30 font-normal normal-case tracking-normal">({coupons.length})</span>
                  </h2>
                  <Link href="/coupons/submit"
                    className="text-xs text-accent hover:text-yellow-300 font-semibold transition-colors">
                    + Submit another
                  </Link>
                </div>
                <div className="space-y-3">
                  {coupons.map((req) => (
                    <SubmissionCard
                      key={req.id}
                      id={req.id}
                      type="coupon"
                      title={req.product_service_name}
                      subtitle={req.email}
                      status={req.status}
                      adminNotes={req.admin_notes}
                      createdAt={req.created_at}
                      updatedAt={req.updated_at}
                      editHref="/coupons/submit"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Submission Card component
// ─────────────────────────────────────────────────────────────────────────────
function SubmissionCard({
  id,
  type,
  title,
  subtitle,
  status,
  adminNotes,
  createdAt,
  updatedAt,
  editHref,
}: {
  id: string;
  type: "event" | "provider" | "coupon";
  title: string;
  subtitle: string;
  status: Status;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  editHref: string;
}) {
  const isNeedsChanges = status === "needs_changes";
  const isApproved     = status === "approved";

  return (
    <div className={`bg-white/[0.05] border rounded-2xl p-5 transition-all ${
      isNeedsChanges
        ? "border-amber-500/30 bg-amber-500/5"
        : isApproved
        ? "border-green-500/20"
        : "border-white/10"
    }`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h3 className="text-white font-black text-base leading-snug truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {title}
            </h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-white/40 text-xs font-medium">{subtitle}</p>
          <p className="text-white/25 text-xs mt-1">
            Submitted {formatDate(createdAt)}
            {updatedAt !== createdAt && ` · Updated ${formatDate(updatedAt)}`}
          </p>
        </div>
      </div>

      {/* Admin notes */}
      {adminNotes && (
        <div className={`mt-4 rounded-xl px-4 py-3 border text-sm leading-relaxed ${
          isNeedsChanges
            ? "bg-amber-500/10 border-amber-500/20 text-amber-200"
            : status === "rejected"
            ? "bg-red-500/10 border-red-500/20 text-red-300"
            : "bg-white/5 border-white/10 text-white/60"
        }`}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">Admin Note</p>
          <p>{adminNotes}</p>
        </div>
      )}

      {/* Needs changes actions */}
      {isNeedsChanges && (
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <ResubmitButton id={id} type={type} />
          <Link
            href={editHref}
            className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl font-semibold transition-all"
          >
            Submit a new revised request
          </Link>
        </div>
      )}

      {/* Approved state — link to live listing */}
      {isApproved && type === "event" && (
        <div className="mt-3">
          <Link href="/events"
            className="text-xs text-green-400 hover:text-green-300 font-semibold flex items-center gap-1 transition-colors">
            View on Events page
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      )}
      {isApproved && type === "provider" && (
        <div className="mt-3">
          <Link href="/services"
            className="text-xs text-green-400 hover:text-green-300 font-semibold flex items-center gap-1 transition-colors">
            View in Services directory
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      )}
      {isApproved && type === "coupon" && (
        <div className="mt-3">
          <Link href="/coupons"
            className="text-xs text-green-400 hover:text-green-300 font-semibold flex items-center gap-1 transition-colors">
            View in Coupons page
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
