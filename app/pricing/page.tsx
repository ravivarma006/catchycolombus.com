import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Catch Columbus",
  description:
    "Choose a plan and unlock the best of Columbus — exclusive deals, early event access, and more.",
};

export const revalidate = 3600;

interface Plan {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number | null;
  description: string | null;
  features: string[];
  is_featured: boolean;
  display_order: number;
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-accent flex-shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default async function PricingPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("subscription_plans")
    .select("id, name, slug, price_monthly, price_yearly, description, features, is_featured, display_order")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const plans = (data ?? []) as Plan[];

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-24">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
              Columbus, Ohio
            </span>
            <span className="h-[2px] w-8 bg-accent" />
          </div>
          <h1
            className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Simple, honest{" "}
            <span style={{ color: "var(--accent)" }}>pricing</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            From free browsing to full business listings — pick the plan that
            fits how you enjoy Columbus.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-6 transition-all ${
                plan.is_featured
                  ? "bg-accent/[0.07] border-accent/40 shadow-lg shadow-accent/10 scale-[1.02]"
                  : "bg-white/[0.04] border-white/10 hover:border-white/20"
              }`}
            >
              {plan.is_featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-[#020C1B] text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h2
                  className="text-xl font-black text-white mb-1"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {plan.name}
                </h2>
                <p className="text-white/40 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.price_monthly === 0 ? (
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-white">Free</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-black text-white">
                        ${plan.price_monthly}
                      </span>
                      <span className="text-white/40 text-sm mb-1">/mo</span>
                    </div>
                    {plan.price_yearly && (
                      <p className="text-xs text-white/30 mt-1">
                        ${plan.price_yearly}/yr — save $
                        {(plan.price_monthly * 12 - plan.price_yearly).toFixed(0)}
                      </p>
                    )}
                  </>
                )}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {(plan.features ?? []).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.price_monthly === 0 ? "/auth/signup" : "/auth/signup"}
                className={`block w-full text-center font-bold text-sm py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95 ${
                  plan.is_featured
                    ? "bg-accent hover:bg-yellow-400 text-[#020C1B]"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                }`}
              >
                {plan.price_monthly === 0 ? "Get Started Free" : `Get ${plan.name}`}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ / trust section */}
        <div className="mt-16 text-center">
          <p className="text-white/30 text-sm">
            All paid plans include a 7-day free trial. Cancel anytime. No hidden fees.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-white/40">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure payments via Stripe
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              7-day free trial
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
