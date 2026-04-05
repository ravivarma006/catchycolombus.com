"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "../actions";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm_password") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    setLoading(true);
    setError(null);
    const result = await resetPassword(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
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
            Set new password
          </h1>
          <p className="text-sm text-white/40 text-center mb-7">
            Choose a strong password for your account.
          </p>

          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                New Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <input
                name="confirm_password"
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-yellow-400 disabled:opacity-60 text-[#020C1B] font-black text-sm py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-95 mt-2"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
