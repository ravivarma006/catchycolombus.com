"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { businessSignup } from "./actions";

export default function BusinessSignupPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/services/submit");
    });
  }, [router]);
  const [error, setError]         = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await businessSignup(fd);
      if (result?.error) setError(result.error);
    });
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)" }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/15 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full bg-amber-400/15 blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span
              className="text-2xl font-black tracking-tight"
              style={{ color: "#F5A800", fontFamily: "'Outfit', sans-serif" }}
            >
              Catch Columbus
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-7">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(245,168,0,0.15)", border: "1px solid rgba(245,168,0,0.3)" }}
            >
              <svg width="28" height="28" fill="none" stroke="#F5A800" strokeWidth="1.7" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m5 0h1M9 11h1m5 0h1M9 15h6" />
              </svg>
            </div>
            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              List Your Business
            </h1>
            <p className="text-white/45 text-sm mt-2 leading-relaxed">
              Create your business account to get listed in front of Columbus residents &amp; visitors.
            </p>
          </div>

          {/* Perks row */}
          <div className="grid grid-cols-3 gap-3 mb-7">
            {[
              { icon: "📍", label: "Get Discovered" },
              { icon: "📣", label: "Reach Locals" },
              { icon: "⭐", label: "Build Presence" },
            ].map((perk) => (
              <div
                key={perk.label}
                className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-xl">{perk.icon}</span>
                <span className="text-white/50 text-[10px] font-semibold tracking-wide leading-tight">
                  {perk.label}
                </span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                Your Full Name <span className="text-red-400">*</span>
              </label>
              <input
                name="full_name"
                type="text"
                required
                autoComplete="name"
                placeholder="Jane Smith"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="jane@yourbusiness.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm select-none">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </span>
                <input
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="(614) 555-0100"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <input
                name="confirm_password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`${inputClass} ${
                  confirm && confirm !== password ? "border-red-500/60" : ""
                }`}
              />
              {confirm && confirm !== password && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || (!!confirm && confirm !== password)}
              className="w-full py-3.5 rounded-xl font-black text-sm disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-95"
              style={{
                background: "#F5A800",
                color: "#020C1B",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {isPending ? "Creating Account…" : "Create Business Account — Free"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/25 text-xs">Already have an account?</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Link
            href="/auth/login"
            className="block w-full py-3 rounded-xl text-center text-sm font-bold text-white/70 hover:text-white transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}
          >
            Sign In
          </Link>

          <p className="text-center text-white/25 text-xs mt-5 leading-relaxed">
            Not a business?{" "}
            <Link href="/auth/signup" className="text-white/50 hover:text-accent underline transition-colors">
              Create a regular account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
