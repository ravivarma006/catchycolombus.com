"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin",               label: "Overview",       icon: "🏠" },
  { href: "/admin/hero",          label: "Hero",           icon: "🖼️" },
  { href: "/admin/events",        label: "Events",         icon: "📅" },
  { href: "/admin/things-to-do",  label: "Things to Do",   icon: "🎯" },
  { href: "/admin/services",      label: "Businesses",     icon: "🏢" },
  { href: "/admin/coupons",       label: "Coupons",        icon: "🏷️" },
  { href: "/admin/announcements", label: "Catch us",       icon: "📢" },
  { href: "/admin/subscribers",   label: "Subscribers",    icon: "📧" },
  { href: "/admin/settings",      label: "Brand Colors",   icon: "🎨" },
];

function SidebarContent({
  email,
  onNavClick,
}: {
  email: string;
  onNavClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="mb-8 px-2">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-1">Admin Panel</p>
        <p className="text-white font-black text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Catch Columbus
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-white/[0.12] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 pt-4 mt-4">
        <p className="text-white/40 text-xs font-medium px-2 truncate mb-3">{email}</p>
        <Link
          href="/dashboard"
          onClick={onNavClick}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] text-xs font-semibold transition-all"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)" }}
    >
      {/* ── Desktop Sidebar (hidden on mobile) ── */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-white/10 flex-col py-8 px-4 sticky top-0 h-screen">
        <SidebarContent email={email} />
      </aside>

      {/* ── Mobile: Top bar with hamburger ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#020C1B]/95 backdrop-blur-xl">
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.08] text-white hover:bg-white/[0.14] transition-colors"
          aria-label="Open navigation"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <p className="text-white font-black text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Admin Panel
        </p>
        <Link
          href="/dashboard"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.14] transition-colors"
          aria-label="Back to dashboard"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer panel */}
          <aside
            className="relative z-10 w-64 h-full flex flex-col py-8 px-4 border-r border-white/10"
            style={{ background: "linear-gradient(160deg, #0D1B3E 0%, #020C1B 100%)" }}
          >
            {/* Close button */}
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.08] text-white/60 hover:text-white transition-colors"
              aria-label="Close navigation"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <SidebarContent email={email} onNavClick={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 overflow-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
