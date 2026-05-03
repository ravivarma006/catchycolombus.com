"use client";

import { useState, useTransition } from "react";
import { subscribe } from "@/app/subscribe/actions";

export default function NeverMissDealsSection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const fd = new FormData();
    fd.append("email", email);
    startTransition(async () => {
      const result = await subscribe(fd);
      if (result.success) {
        try { localStorage.setItem("catchcolumbus_subscribed", "1"); } catch {}
        setMessage({ type: "success", text: "You're in! Check your inbox for your first deal." });
        setEmail("");
      } else {
        setMessage({ type: "error", text: result.error ?? "Something went wrong." });
      }
    });
  }

  return (
    <section
      className="relative py-20 md:py-28 px-6 md:px-16 lg:px-24 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0D0D0D 0%, #020C1B 60%, #0F4C5C 100%)" }}
    >
      {/* decorative glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[120%] rounded-full bg-accent/10 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[100%] rounded-full bg-primary/20 blur-[120px]" />
      </div>

      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent">
            Free Newsletter
          </span>
        </div>

        <h2
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.02] mb-6"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Save Money. Support Local.
          <br />
          <span style={{ color: "var(--accent)" }}>Every Single Week.</span>
        </h2>

        <p className="text-white/65 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Columbus businesses drop exclusive deals only on Catch Columbus —
          coupons, promos, and offers you won&apos;t find anywhere else.
          Join thousands of Columbus &amp; suburb residents already saving.
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
          {[
            { value: "1,200+", label: "Deals This Month" },
            { value: "$45", label: "Avg. Savings/Month" },
            { value: "100%", label: "Free to Join" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="text-2xl md:text-4xl font-black"
                style={{ color: "var(--accent)", fontFamily: "'Outfit', sans-serif" }}
              >
                {s.value}
              </p>
              <p className="text-[10px] md:text-xs text-white/50 font-semibold tracking-wider uppercase mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Subscribe form */}
        {message?.type === "success" ? (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-emerald-500/15 border border-emerald-400/40">
            <div className="flex items-center justify-center gap-3">
              <svg width="22" height="22" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-emerald-300 font-bold">{message.text}</p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition backdrop-blur-sm"
            />
            <button
              type="submit"
              disabled={isPending}
              className="px-7 py-4 rounded-xl bg-accent text-[#020C1B] font-bold text-sm shadow-lg shadow-amber-500/30 hover:bg-yellow-400 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all whitespace-nowrap"
            >
              {isPending ? "Subscribing..." : "Get My Free Deals →"}
            </button>
          </form>
        )}

        {message?.type === "error" && (
          <p className="text-red-400 text-sm mt-3">{message.text}</p>
        )}

        <p className="text-white/40 text-xs mt-5">
          ✉️ No spam. Unsubscribe anytime. We respect your inbox.
        </p>
      </div>
    </section>
  );
}
