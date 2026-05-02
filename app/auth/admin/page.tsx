"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "../actions";

export default function AdminLoginPage() {
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("user_type", "admin");
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #020C1B 0%, #051428 50%, #020C1B 100%)" }}
    >
      {/* Subtle ambient — intentionally muted */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-800/20 blur-[160px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[40%] h-[40%] rounded-full bg-teal-900/15 blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo — minimal, no nav */}
        <div className="text-center mb-8">
          <Link href="/">
            <span
              className="text-xl font-black tracking-tight"
              style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif" }}
            >
              Catch Columbus
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-7"
          style={{
            background: "rgba(15,76,92,0.12)",
            border: "1px solid rgba(15,76,92,0.35)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-7">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(15,76,92,0.3)", border: "1px solid rgba(15,76,92,0.6)" }}
            >
              <svg width="26" height="26" fill="none" stroke="#7FB6C4" strokeWidth="1.7" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M21 12c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5a2 2 0 012-2h12a2 2 0 012 2v7z" />
              </svg>
            </div>
            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Admin Access
            </h1>
            <p className="text-white/35 text-sm mt-2">
              Restricted — authorised personnel only
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/35 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="off"
                placeholder="admin@catchcolumbus.com"
                className="w-full rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(15,76,92,0.5)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(15,76,92,0.9)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,76,92,0.5)")}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/35 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(15,76,92,0.5)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(15,76,92,0.9)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,76,92,0.5)")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full disabled:opacity-50 font-black text-sm py-3.5 rounded-xl transition-all hover:brightness-110 active:scale-95 mt-1"
              style={{
                background: "#0F4C5C",
                color: "#ffffff",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {loading ? "Verifying…" : "Sign In as Admin"}
            </button>
          </form>

          <p className="text-center text-white/20 text-xs mt-6 leading-relaxed">
            Admin accounts are created by invitation only.
          </p>
        </div>
      </div>
    </div>
  );
}
