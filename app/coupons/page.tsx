import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CouponsContent from "@/components/coupons/CouponsContent";
import type { Coupon } from "@/components/coupons/CouponCard";

export const revalidate = 300; // 5 minutes

interface CouponCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

export const metadata: Metadata = {
  title: "Coupons & Deals — Catch Columbus",
  description:
    "Find exclusive coupons and deals from local Columbus businesses — food, events, services, and products.",
};

export default async function CouponsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let canSubmit = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    canSubmit = profile?.role === "business_user" || profile?.role === "admin";
  }

  const { data: categories } = await supabase
    .from("coupon_categories")
    .select("id, name, slug, display_order")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const today = new Date().toISOString().split("T")[0];
  const { data: coupons } = await supabase
    .from("coupons")
    .select(
      `id, category_id, product_service_name, phone, email,
       address, description, coupon_code, website, image_url, social_links,
       expires_at, discount_type, discount_value, is_premium, max_redemptions, current_redemptions,
       coupon_categories ( name, slug )`
    )
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gte.${today}`)
    .order("approved_at", { ascending: false });

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)",
      }}
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
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
                Columbus, Ohio
              </span>
            </div>
            <h1
              className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Coupons &amp; <span style={{ color: "var(--accent)" }}>Deals</span>
            </h1>
            <p className="text-white/60 mt-3 text-lg font-medium max-w-4xl">
              Exclusive discounts from local Columbus businesses — show the code or mention Catch Columbus.
            </p>
          </div>

          {/* Submit CTA — only for business_user / admin */}
          {canSubmit && (
            <Link
              href="/coupons/submit"
              className="inline-flex items-center gap-2 bg-accent hover:bg-yellow-400 text-[#020C1B] font-bold text-sm px-6 py-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20 shrink-0 mt-2"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Submit a Coupon
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        <CouponsContent
          coupons={(coupons ?? []) as unknown as Coupon[]}
          categories={(categories ?? []) as CouponCategory[]}
        />
      </div>
    </div>
  );
}
