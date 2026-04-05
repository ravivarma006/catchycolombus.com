"use client";

import { useState, useEffect } from "react";
import { subscribe } from "@/app/subscribe/actions";

export default function StickyDealBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    // Check if dismissed in this session only (sessionStorage resets on tab close)
    if (sessionStorage.getItem("stickyBarDismissed")) {
      setDismissed(true);
      return;
    }
    // Check initial scroll position on mount
    setVisible(window.scrollY > 300);
    const handler = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem("stickyBarDismissed", "1");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    const fd = new FormData();
    fd.append("email", email);
    const result = await subscribe(fd);
    setStatus(result.success ? "success" : "error");
    if (result.success) setTimeout(dismiss, 2000);
  }

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-4 py-3 md:px-8"
      style={{
        background: "linear-gradient(90deg, #0F4C5C 0%, #020C1B 60%, #1a1a2e 100%)",
        borderTop: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Left label */}
      <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
        <span className="text-lg">🔥</span>
        <div>
          <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Exclusive Columbus Deals
          </p>
          <p className="text-white/50 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
            Subscribe free — no spam, ever
          </p>
        </div>
      </div>

      {/* Form / success */}
      <div className="flex-1 max-w-sm mx-auto">
        {status === "success" ? (
          <p className="text-center text-sm font-bold text-green-300" style={{ fontFamily: "'Inter', sans-serif" }}>
            ✅ You&apos;re in! Check your inbox soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for free deals"
              required
              className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2"
              style={{ fontFamily: "'Inter', sans-serif", "--tw-ring-color": "var(--accent)" } as React.CSSProperties}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex-shrink-0 px-4 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: "var(--accent)", color: "#0F4C5C", fontFamily: "'Inter', sans-serif" }}
            >
              {status === "loading" ? "..." : "Subscribe & Save"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-red-300 text-xs mt-1 text-center">Something went wrong — try again.</p>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
