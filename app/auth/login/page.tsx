"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "../actions";

type Tab = "business" | "admin";

export default function LoginPage() {
  const [tab, setTab]     = useState<Tab>("business");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("user_type", tab);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  const isBusiness = tab === "business";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)",
      }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/10 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-7">
          <Link href="/">
            <span
              className="text-2xl md:text-3xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Catch <span className="text-accent">Columbus</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">

          {/* Tab switcher */}
          <div
            className="grid grid-cols-2 rounded-xl p-1 mb-6 gap-1"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <button
              type="button"
              onClick={() => { setTab("business"); setError(null); }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
              style={{
                background: isBusiness ? "#F5A800" : "transparent",
                color: isBusiness ? "#020C1B" : "rgba(255,255,255,0.5)",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m5 0h1M9 11h1m5 0h1M9 15h6" />
              </svg>
              Business
            </button>
            <button
              type="button"
              onClick={() => { setTab("admin"); setError(null); }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
              style={{
                background: !isBusiness ? "#0F4C5C" : "transparent",
                color: !isBusiness ? "#ffffff" : "rgba(255,255,255,0.5)",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M21 12c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5a2 2 0 012-2h12a2 2 0 012 2v7z" />
              </svg>
              Admin
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{
                background: isBusiness ? "rgba(245,168,0,0.15)" : "rgba(15,76,92,0.25)",
                border: `1px solid ${isBusiness ? "rgba(245,168,0,0.3)" : "rgba(15,76,92,0.5)"}`,
              }}
            >
              {isBusiness ? (
                <svg width="22" height="22" fill="none" stroke="#F5A800" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m5 0h1M9 11h1m5 0h1M9 15h6" />
                </svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="#7FB6C4" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M21 12c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5a2 2 0 012-2h12a2 2 0 012 2v7z" />
                </svg>
              )}
            </div>
            <h1
              className="text-xl md:text-2xl font-black text-white"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {isBusiness ? "Business Sign In" : "Admin Sign In"}
            </h1>
            <p className="text-white/45 text-sm mt-1">
              {isBusiness
                ? "Manage your business listings and submissions"
                : "Review submissions and manage the platform"}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-white/30 hover:text-accent transition">
                  Forgot password?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full disabled:opacity-60 font-black text-sm py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-95 mt-2"
              style={{
                background: isBusiness ? "#F5A800" : "#0F4C5C",
                color: isBusiness ? "#020C1B" : "#ffffff",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {loading
                ? "Signing in…"
                : isBusiness
                ? "Sign In as Business"
                : "Sign In as Admin"}
            </button>
          </form>

          {/* Business-only footer */}
          {isBusiness ? (
            <div className="mt-6 space-y-3">
              <p className="text-center text-sm text-white/40">
                Don&apos;t have a business account yet?
              </p>
              <Link
                href="/auth/business-signup"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.01]"
                style={{
                  background: "rgba(245,168,0,0.1)",
                  border: "1px solid rgba(245,168,0,0.25)",
                  color: "#F5A800",
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Register Your Business — Free
              </Link>
            </div>
          ) : (
            <p className="text-center text-xs text-white/30 mt-6 leading-relaxed">
              Admin accounts are created by invitation only.
              <br />
              Contact{" "}
              <a href="mailto:support@catchcolumbus.com" className="text-white/50 underline hover:text-accent transition">
                support@catchcolumbus.com
              </a>{" "}
              if you need access.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
