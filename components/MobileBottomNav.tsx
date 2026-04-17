"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12L12 3l9 9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v11h14V10" />
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
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
        <path fillRule="evenodd" d="M4.083 9h-.875A2 2 0 001 11v2a2 2 0 002 2h.083A4 4 0 009 17.938V20h1a1 1 0 110 2H7a1 1 0 110-2v-.08A6 6 0 013.083 15H3a4 4 0 01-4-4v-2a4 4 0 014-4h.083A6 6 0 017 1.062V1h1a1 1 0 110 2h-1v.062A4 4 0 004.083 9zM12 4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
        <path d="M3 12V7a1 1 0 011-1h5l9 9a2 2 0 010 2.83l-4.17 4.17a2 2 0 01-2.83 0L3 14v-2z" />
      </svg>
    ),
  },
  {
    href: "/things-to-do",
    label: "Explore",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.83 9.17l-3.54 7.07-3.54-3.54 7.08-3.53z" />
      </svg>
    ),
    activeIcon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm3.536 6.464a1 1 0 00-1.072-.22l-7 3a1 1 0 00-.52 1.316l3 5a1 1 0 001.792-.04l4-8a1 1 0 00-.2-1.056z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/auth/login",
    label: "Sign In",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    activeIcon: (
      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
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
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative transition-all duration-150 group"
              style={{ minHeight: 56 }}
            >
              {/* Active indicator pill */}
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-b-full transition-all"
                  style={{ width: 28, background: "#F5A800" }}
                />
              )}

              {/* Icon */}
              <span
                className="transition-all duration-150"
                style={{
                  color: active ? "#F5A800" : "rgba(255,255,255,0.45)",
                  transform: active ? "scale(1.1)" : "scale(1)",
                }}
              >
                {active ? item.activeIcon : item.icon}
              </span>

              {/* Label */}
              <span
                className="text-[10px] font-semibold tracking-wide transition-all duration-150 leading-none"
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
      </div>
    </nav>
  );
}
