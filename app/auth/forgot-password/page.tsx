"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "../actions";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await forgotPassword(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background:
          "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)",
      }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/10 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span
              className="text-3xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Catch <span className="text-accent">Columbus</span>
            </span>
          </Link>
        </div>

        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h1
            className="text-2xl font-bold text-white mb-1 text-center"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Reset password
          </h1>
          <p className="text-sm text-white/40 text-center mb-7">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-sm">
                Check your email for a reset link. It may take a minute to arrive.
              </div>
              <Link
                href="/auth/login"
                className="text-accent font-semibold hover:underline text-sm"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <form action={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-yellow-400 disabled:opacity-60 text-[#020C1B] font-black text-sm py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-95 mt-2"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center text-sm text-white/40 mt-6">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-accent font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
