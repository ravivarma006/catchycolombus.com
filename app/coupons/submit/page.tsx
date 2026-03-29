import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import CouponSubmitForm from "./CouponSubmitForm";

export const metadata: Metadata = {
  title: "Submit a Coupon — Catch Columbus",
  description: "Submit a coupon or deal from your Columbus business to be featured on Catch Columbus.",
};

export default async function CouponSubmitPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/coupons/submit");

  const { data: categories } = await supabase
    .from("coupon_categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const success = searchParams.success === "1";

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

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">Columbus, Ohio</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Submit a <span style={{ color: "var(--accent)" }}>Coupon</span>
          </h1>
          <p className="text-white/50 mt-3 text-base leading-relaxed">
            Submit your deal or coupon for review. Once approved, customers in Columbus will see it on Catch Columbus.
          </p>
        </div>

        {success ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-8 text-center">
            <div className="text-5xl mb-4">🏷️</div>
            <h2 className="text-2xl font-black text-white mb-2">Coupon Submitted!</h2>
            <p className="text-white/60 mb-6">
              Your coupon has been submitted for review. We&apos;ll notify you once it&apos;s approved.
            </p>
            <a
              href="/coupons"
              className="inline-flex items-center gap-2 bg-accent text-[#020C1B] font-bold text-sm px-6 py-3 rounded-2xl hover:bg-yellow-400 transition-all"
            >
              Browse Coupons
            </a>
          </div>
        ) : (
          <CouponSubmitForm
            categories={(categories ?? []) as { id: string; name: string; slug: string }[]}
          />
        )}
      </div>
    </div>
  );
}
