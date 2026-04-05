"use client";

import { useState, useEffect, useRef } from "react";
import { subscribe } from "@/app/subscribe/actions";

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const triggered = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("exitPopupSeen")) return;

    // Desktop: mouse leaves top of viewport
    function onMouseLeave(e: MouseEvent) {
      if (e.clientY <= 20 && !triggered.current) {
        triggered.current = true;
        setOpen(true);
        localStorage.setItem("exitPopupSeen", "1");
      }
    }

    // Mobile fallback: show after 30s
    const timer = setTimeout(() => {
      if (!triggered.current) {
        triggered.current = true;
        setOpen(true);
        localStorage.setItem("exitPopupSeen", "1");
      }
    }, 30000);

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  function close() { setOpen(false); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    const fd = new FormData();
    fd.append("email", email);
    const result = await subscribe(fd);
    setStatus(result.success ? "success" : "error");
    if (result.success) setTimeout(close, 2500);
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/70"
        style={{ backdropFilter: "blur(6px)" }}
        onClick={close}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[61] flex items-center justify-center px-4"
      >
        <div
          className="relative w-full max-w-lg rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 100%)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Ambient blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20 blur-[80px]" style={{ backgroundColor: "var(--accent)" }} />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-blue-500/30 blur-[80px]" />
          </div>

          <div className="relative z-10 p-8 md:p-10">
            {/* Close */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all text-lg leading-none"
            >
              ×
            </button>

            {status === "success" ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  You&apos;re in!
                </h2>
                <p className="text-white/60" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Check your inbox for exclusive Columbus deals.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🎁</div>
                  <h2
                    className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Don&apos;t miss out on{" "}
                    <span style={{ color: "var(--accent)" }}>Columbus deals</span>
                  </h2>
                  <p className="text-white/55 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Get Columbus deals, events & coupons in your inbox
                  </p>
                </div>

                {/* Social proof */}
                <div
                  className="flex items-center justify-center gap-2 mb-6 py-2.5 px-4 rounded-2xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex -space-x-2">
                    {["🧑", "👩", "👨", "🙋"].map((emoji, i) => (
                      <span
                        key={i}
                        className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-sm border border-white/20"
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/70 text-xs font-medium ml-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="text-white font-bold">10,000+</span> locals already saving money
                  </p>
                </div>

                {/* Benefits */}
                <ul className="space-y-2 mb-6">
                  {[
                    "Exclusive coupons — up to 40% off local attractions",
                    "Weekly event picks curated for Columbus",
                    "Early access to deals before they go public",
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span className="mt-0.5 text-base leading-none" style={{ color: "var(--accent)" }}>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ fontFamily: "'Inter', sans-serif", "--tw-ring-color": "var(--accent)" } as React.CSSProperties}
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    style={{ backgroundColor: "var(--accent)", color: "#0F4C5C", fontFamily: "'Inter', sans-serif", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
                  >
                    {status === "loading" ? "Subscribing..." : "🎁 Send Me Free Deals"}
                  </button>
                  {status === "error" && (
                    <p className="text-red-300 text-xs text-center">Something went wrong — please try again.</p>
                  )}
                  <p className="text-center text-white/30 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                    No spam. Unsubscribe at any time.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
