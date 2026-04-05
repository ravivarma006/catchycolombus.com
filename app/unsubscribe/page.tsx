"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { unsubscribe } from "./actions";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    if (!email) setStatus("error");
  }, [email]);

  async function handleUnsubscribe() {
    setStatus("loading");
    const res = await unsubscribe(email);
    setStatus(res.success ? "done" : "error");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)",
      }}
    >
      <div className="w-full max-w-md bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
        {status === "done" ? (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg width="32" height="32" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Unsubscribed
            </h1>
            <p className="text-white/50 text-sm mb-6">
              You&apos;ve been removed from our mailing list. You won&apos;t receive any more emails from us.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-accent hover:bg-yellow-400 text-[#020C1B] font-bold text-sm px-6 py-3 rounded-2xl transition-all">
              Back to Home
            </Link>
          </>
        ) : status === "error" ? (
          <>
            <h1 className="text-2xl font-black text-white mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Something went wrong
            </h1>
            <p className="text-white/50 text-sm mb-6">
              We couldn&apos;t process your unsubscribe request. Please try again or contact us.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all">
              Back to Home
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-black text-white mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Unsubscribe
            </h1>
            <p className="text-white/50 text-sm mb-6">
              Are you sure you want to unsubscribe <span className="text-white/70 font-medium">{email}</span> from Catch Columbus emails?
            </p>
            <button
              onClick={handleUnsubscribe}
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 bg-red-500/80 hover:bg-red-500 text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all disabled:opacity-50">
              {status === "loading" ? "Unsubscribing..." : "Yes, Unsubscribe"}
            </button>
            <div className="mt-4">
              <Link href="/" className="text-white/40 text-sm hover:text-white/60 transition-colors">
                Cancel
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
