"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { subscribe } from "@/app/subscribe/actions";

/* ─── Nav items (4 links + 1 action button) ─── */
const NAV_LINKS = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12L12 3l9 9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v11h14V10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
      </svg>
    ),
    activeIcon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7A1 1 0 003 11h1v9a1 1 0 001 1h4v-6h6v6h4a1 1 0 001-1v-9h1a1 1 0 00.707-1.707l-7-7z" />
      </svg>
    ),
  },
  {
    href: "/events",
    label: "Events",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    activeIcon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h12a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/coupons",
    label: "Deals",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M3 12V7a1 1 0 011-1h5l9 9a2 2 0 010 2.83l-4.17 4.17a2 2 0 01-2.83 0L3 14v-2z" />
      </svg>
    ),
    activeIcon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 12V7a1 1 0 011-1h5l9 9a2 2 0 010 2.83l-4.17 4.17a2 2 0 01-2.83 0L3 14v-2z" />
        <circle cx="7.5" cy="7.5" r="1.5" fill="white" />
      </svg>
    ),
  },
  {
    href: "/things-to-do",
    label: "Explore",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.83 9.17l-3.54 7.07-3.54-3.54 7.08-3.53z" />
      </svg>
    ),
    activeIcon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm3.536 6.464a1 1 0 00-1.072-.22l-7 3a1 1 0 00-.52 1.316l3 5a1 1 0 001.792-.04l4-8a1 1 0 00-.2-1.056z" clipRule="evenodd" />
      </svg>
    ),
  },
];

/* ─── Bottom-sheet modal ─── */
type SheetView = "choose" | "subscribe";

function BottomSheet({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<SheetView>("choose");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  // slide-in animation
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (view === "subscribe") setTimeout(() => emailRef.current?.focus(), 80);
  }, [view]);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const fd = new FormData();
    fd.append("email", email);
    startTransition(async () => {
      const res = await subscribe(fd);
      if (res.success) {
        localStorage.setItem("catchcolumbus_subscribed", "1");
        setMessage({ type: "success", text: "You're subscribed! Deals heading to your inbox." });
        setEmail("");
      } else {
        setMessage({ type: "error", text: res.error ?? "Something went wrong." });
      }
    });
  }

  const sheet = (
    <div className="fixed inset-0 z-[70] flex flex-col justify-end md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: mounted ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative z-10 rounded-t-3xl px-5 pt-5 pb-8 transition-transform duration-300 ease-out"
        style={{
          background: "linear-gradient(160deg, #0D1B3E 0%, #020C1B 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderBottom: "none",
          transform: mounted ? "translateY(0)" : "translateY(100%)",
          paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
        }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        {/* ── Choose view ── */}
        {view === "choose" && (
          <>
            <h2
              className="text-white font-black text-lg text-center mb-1"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Get Started
            </h2>
            <p className="text-white/45 text-sm text-center mb-6">
              What brings you to Catch Columbus?
            </p>

            {/* Subscribe option */}
            <button
              onClick={() => setView("subscribe")}
              className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 mb-3 transition-all active:scale-[0.98]"
              style={{ background: "rgba(245,168,0,0.12)", border: "1px solid rgba(245,168,0,0.3)" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(245,168,0,0.2)" }}
              >
                <svg width="22" height="22" fill="none" stroke="#F5A800" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Subscribe for Deals
                </p>
                <p className="text-white/45 text-xs mt-0.5">
                  Free Columbus events, coupons &amp; picks — to your inbox
                </p>
              </div>
              <svg className="ml-auto shrink-0 text-white/30" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Business Sign In option */}
            <Link
              href="/auth/login"
              onClick={onClose}
              className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 transition-all active:scale-[0.98]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <svg width="22" height="22" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Business Sign In
                </p>
                <p className="text-white/45 text-xs mt-0.5">
                  Already have an account? Sign in here
                </p>
              </div>
              <svg className="ml-auto shrink-0 text-white/30" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </Link>

            {/* Register Business option */}
            <Link
              href="/auth/business-signup"
              onClick={onClose}
              className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 transition-all active:scale-[0.98]"
              style={{ background: "rgba(245,168,0,0.06)", border: "1px solid rgba(245,168,0,0.2)" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(245,168,0,0.12)" }}
              >
                <svg width="22" height="22" fill="none" stroke="#F5A800" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h1m5 0h1M9 11h1m5 0h1M9 15h6" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-sm" style={{ color: "#F5A800", fontFamily: "'Outfit', sans-serif" }}>
                  Register Your Business
                </p>
                <p className="text-white/45 text-xs mt-0.5">
                  New here? List your business for free
                </p>
              </div>
              <svg className="ml-auto shrink-0 text-white/30" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          </>
        )}

        {/* ── Subscribe form view ── */}
        {view === "subscribe" && (
          <>
            {/* Back button */}
            <button
              onClick={() => { setView("choose"); setMessage(null); setEmail(""); }}
              className="flex items-center gap-1.5 text-white/50 text-sm mb-5 hover:text-white/80 transition"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(245,168,0,0.15)" }}>
                <svg width="24" height="24" fill="none" stroke="#F5A800" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-white font-black text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Stay in the Loop
              </h2>
              <p className="text-white/45 text-sm mt-1">
                Free Columbus deals, events &amp; local picks.
              </p>
            </div>

            {message?.type === "success" ? (
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(74,222,128,0.15)" }}>
                  <svg width="24" height="24" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-300 font-bold text-sm">{message.text}</p>
                <button
                  onClick={onClose}
                  className="mt-5 w-full py-3 rounded-xl font-bold text-sm transition"
                  style={{ background: "#F5A800", color: "#020C1B" }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 transition"
                  style={{ border: "1.5px solid rgba(245,168,0,0.4)" }}
                />
                {message?.type === "error" && (
                  <p className="text-red-400 text-xs">{message.text}</p>
                )}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 transition active:scale-[0.98]"
                  style={{ background: "#F5A800", color: "#020C1B", fontFamily: "'Outfit', sans-serif" }}
                >
                  {isPending ? "Subscribing…" : "Subscribe — It's Free"}
                </button>
                <p className="text-center text-white/25 text-xs">No spam. Unsubscribe anytime.</p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (typeof window === "undefined") return null;
  return createPortal(sheet, document.body);
}

/* ─── Main component ─── */
export default function MobileBottomNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "linear-gradient(180deg, #0a1628 0%, #020C1B 100%)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: "env(safe-area-inset-bottom)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-stretch">
          {/* 4 regular nav links */}
          {NAV_LINKS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative transition-all duration-150"
                style={{ minHeight: 56 }}
              >
                {active && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-b-full"
                    style={{ width: 28, background: "#F5A800" }}
                  />
                )}
                <span
                  className="transition-all duration-150"
                  style={{
                    color: active ? "#F5A800" : "rgba(255,255,255,0.45)",
                    transform: active ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {active ? item.activeIcon : item.icon}
                </span>
                <span
                  className="text-[10px] font-semibold tracking-wide leading-none"
                  style={{
                    color: active ? "#F5A800" : "rgba(255,255,255,0.4)",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* 5th tab — Subscribe action */}
          <button
            onClick={() => setSheetOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative transition-all duration-150"
            style={{ minHeight: 56 }}
            aria-label="Subscribe or Sign In"
          >
            {/* Gold glow ring around icon */}
            <span
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150"
              style={{
                background: sheetOpen
                  ? "rgba(245,168,0,0.25)"
                  : "rgba(245,168,0,0.12)",
                border: "1.5px solid rgba(245,168,0,0.4)",
              }}
            >
              <svg width="19" height="19" fill="none" stroke="#F5A800" strokeWidth="1.9" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <span
              className="text-[10px] font-semibold tracking-wide leading-none"
              style={{
                color: "#F5A800",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Subscribe
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom sheet */}
      {sheetOpen && <BottomSheet onClose={() => setSheetOpen(false)} />}
    </>
  );
}
