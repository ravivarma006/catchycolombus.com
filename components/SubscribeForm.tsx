"use client";

import { useState, useTransition } from "react";
import { subscribe } from "@/app/subscribe/actions";
import Link from "next/link";

const FREE_BENEFITS = [
  "Browse all Columbus events & activities",
  "Access the full business directory",
  "Read local news & announcements",
  "Save favorite spots to your list",
];

const PREMIUM_BENEFITS = [
  "Exclusive coupons — up to 40% off",
  "Early access to deals before they go public",
  "Weekly curated event picks in your inbox",
  "Priority listing for your business",
];

export default function SubscribeForm() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData();
    formData.append("email", email);
    startTransition(async () => {
      const result = await subscribe(formData);
      if (result.success) {
        setMessage({ type: "success", text: "You're subscribed! Welcome to the Columbus community." });
        setEmail("");
      } else {
        setMessage({ type: "error", text: result.error ?? "Something went wrong." });
      }
    });
  }

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #020C1B 0%, #0F1F40 50%, #020C1B 100%)" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-15"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-500/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-[2px] w-8" style={{ backgroundColor: "var(--accent)" }} />
            <span
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
            >
              Simple Pricing
            </span>
            <span className="h-[2px] w-8" style={{ backgroundColor: "var(--accent)" }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Start free, upgrade{" "}
            <span style={{ color: "var(--accent)" }}>when you&apos;re ready</span>
          </h2>
          <p
            className="mt-3 text-white/50 max-w-lg mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Everything you need to explore Columbus is free. Upgrade for exclusive deals and premium perks.
          </p>
        </div>

        {/* Free vs Premium cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-12">
          {/* Free */}
          <div
            className="flex flex-col p-6 rounded-3xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                Free Forever
              </p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>$0</span>
                <span className="text-white/40 text-sm mb-1">/month</span>
              </div>
            </div>
            <ul className="space-y-3 flex-1 mb-6">
              {FREE_BENEFITS.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/65" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-white/40" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signup"
              id="subscribe-free-signup"
              className="block w-full text-center py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: "rgba(255,255,255,0.10)", color: "white", border: "1px solid rgba(255,255,255,0.15)", fontFamily: "'Inter', sans-serif" }}
            >
              Get Started Free →
            </Link>
          </div>

          {/* Premium */}
          <div
            className="flex flex-col p-6 rounded-3xl relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.20)" }}
          >
            {/* Most popular badge */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2">
              <span
                className="inline-block px-4 py-1 text-[10px] font-black uppercase tracking-wider rounded-b-xl"
                style={{ backgroundColor: "var(--accent)", color: "#020C1B" }}
              >
                Most Popular
              </span>
            </div>
            {/* Subtle accent glow */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl opacity-10"
              style={{ background: "radial-gradient(ellipse at top, var(--accent) 0%, transparent 70%)" }}
            />
            <div className="relative z-10 mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}>
                Premium Member
              </p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>$9</span>
                <span className="text-white/40 text-sm mb-1">/month</span>
              </div>
              <p className="text-white/35 text-xs mt-1">$79/yr — save $29</p>
            </div>
            <ul className="space-y-3 flex-1 mb-6 relative z-10">
              {PREMIUM_BENEFITS.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/80" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "var(--accent)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
            <div className="relative z-10 space-y-2">
              <Link
                href="/pricing"
                id="subscribe-see-plans"
                className="block w-full text-center py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
                style={{ backgroundColor: "var(--accent)", color: "#020C1B", fontFamily: "'Inter', sans-serif", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
              >
                See All Plans →
              </Link>
              <p className="text-center text-white/30 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                7-day free trial · Cancel anytime
              </p>
            </div>
          </div>
        </div>

        {/* Email subscribe strip */}
        <div
          className="max-w-xl mx-auto text-center p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p
            className="text-white font-bold mb-1"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Not ready yet? Get free deals by email 📬
          </p>
          <p className="text-white/45 text-sm mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            No account needed — just drop your email below.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ fontFamily: "'Inter', sans-serif", "--tw-ring-color": "var(--accent)" } as React.CSSProperties}
            />
            <button
              type="submit"
              disabled={isPending}
              id="subscribe-email-submit"
              className="px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex-shrink-0"
              style={{ backgroundColor: "var(--accent)", color: "#020C1B", fontFamily: "'Inter', sans-serif" }}
            >
              {isPending ? "Subscribing..." : "Subscribe & Save"}
            </button>
          </form>
          {message && (
            <p
              className={`mt-3 text-sm font-medium ${message.type === "success" ? "text-green-300" : "text-red-300"}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
