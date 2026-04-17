"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/auth/actions";

const TABS = [
  {
    href: "/dashboard",
    label: "Home",
    exact: true,
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/dashboard/submissions",
    label: "Submissions",
    exact: false,
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    href: null,
    label: "Submit",
    exact: false,
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
];

export default function DashboardBottomNav({ email, role }: { email: string; role: string }) {
  const pathname = usePathname();
  const [showSubmit, setShowSubmit] = useState(false);

  return (
    <>
      {/* Submit quick-menu overlay */}
      {showSubmit && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSubmit(false)}
        >
          <div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 bg-[#0D1B3E] border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest px-4 pt-4 pb-2">
              Submit New
            </p>
            {(role === "admin"
              ? [
                  { href: "/services/submit", icon: "🏢", label: "List a Business" },
                  { href: "/events/submit",   icon: "📅", label: "Submit an Event" },
                  { href: "/coupons/submit",  icon: "🏷️", label: "Submit a Coupon" },
                ]
              : [
                  { href: "/services/submit", icon: "🏢", label: "List Your Business" },
                ]
            ).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowSubmit(false)}
                className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors text-sm font-semibold"
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="h-3" />
          </div>
        </div>
      )}

      {/* Bottom nav bar — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#020C1B]/95 backdrop-blur-xl border-t border-white/10 flex items-stretch">
        {TABS.filter((tab) => tab.href !== null || role === "business_user" || role === "admin").map((tab) => {
          const isActive = tab.href
            ? tab.exact
              ? pathname === tab.href
              : pathname.startsWith(tab.href)
            : showSubmit;

          if (tab.href === null) {
            return (
              <button
                key="submit"
                onClick={() => setShowSubmit((v) => !v)}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors"
              >
                <span className={`transition-colors ${isActive ? "text-accent" : "text-white/40"}`}>
                  {tab.icon}
                </span>
                <span className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? "text-accent" : "text-white/40"}`}>
                  {tab.label}
                </span>
                {isActive && <span className="w-1 h-1 rounded-full bg-accent" />}
              </button>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors"
            >
              <span className={`transition-colors ${isActive ? "text-accent" : "text-white/40"}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? "text-accent" : "text-white/40"}`}>
                {tab.label}
              </span>
              {isActive && <span className="w-1 h-1 rounded-full bg-accent" />}
            </Link>
          );
        })}

        {/* Profile / Sign Out tab */}
        <form action={logout} className="flex-1">
          <button
            type="submit"
            className="w-full h-full flex flex-col items-center justify-center gap-1 py-3 transition-colors group"
          >
            <span className="text-white/40 group-hover:text-white/70 transition-colors">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <span className="text-[10px] font-bold tracking-wide text-white/40 group-hover:text-white/70 transition-colors max-w-[60px] truncate">
              Sign Out
            </span>
          </button>
        </form>
      </nav>
    </>
  );
}
