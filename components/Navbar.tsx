"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/auth/actions";
import { subscribe } from "@/app/subscribe/actions";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/history", label: "History" },
  { href: "/events", label: "Events" },
  { href: "/things-to-do", label: "Things to Do" },
  { href: "/services", label: "Services" },
  { href: "/coupons", label: "Coupons" },
  { href: "/announcements", label: "Announcements" },
];

interface NavbarProps {
  user: { email?: string; role?: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [subEmail, setSubEmail] = useState("");
  const [subMessage, setSubMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const subEmailRef = useRef<HTMLInputElement>(null);

  function openSubscribe() {
    setSubEmail("");
    setSubMessage(null);
    setSubscribeOpen(true);
  }

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubMessage(null);
    const formData = new FormData();
    formData.append("email", subEmail);
    startTransition(async () => {
      const result = await subscribe(formData);
      if (result.success) {
        localStorage.setItem("catchcolumbus_subscribed", "1");
        setSubMessage({ type: "success", text: "You're subscribed! Check your inbox for a welcome email." });
        setSubEmail("");
      } else {
        setSubMessage({ type: "error", text: result.error ?? "Something went wrong." });
      }
    });
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    if (subscribeOpen) setTimeout(() => subEmailRef.current?.focus(), 50);
  }, [subscribeOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <nav className="bg-white text-gray-800 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-primary font-black text-xl tracking-tight">
              Catch Columbus
            </span>
          </Link>

          {/* Desktop Nav */}
          {!searchOpen && (
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-primary transition ${
                    isActive(link.href)
                      ? "text-primary border-b-2 border-accent pb-0.5"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop Search Expand */}
          {searchOpen && (
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 mx-6 items-center gap-2"
            >
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, services, coupons..."
                className="flex-1 border border-gray-200 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
              >
                Go
              </button>
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition"
                aria-label="Close search"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          )}

          {/* Right side: search icon + auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100 transition"
              aria-label="Search"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
            </button>

            {user ? (
              <>
                <Link
                  href={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="text-sm font-semibold hover:text-primary transition"
                >
                  {user.role === "admin" ? "Admin" : "Dashboard"}
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="bg-accent text-primary px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-yellow-400 transition"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100 transition"
                  aria-label="Sign in"
                  title="Sign In"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </Link>
                <button
                  onClick={openSubscribe}
                  className="bg-accent text-primary px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:shadow hover:bg-yellow-400 transition"
                >
                  Subscribe
                </button>
              </>
            )}
          </div>

          {/* Mobile: search icon + menu toggle */}
          <div className="md:hidden flex items-center gap-1">
            <Link
              href="/search"
              className="p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100 transition"
              aria-label="Search"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
            </Link>
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className={`w-5 h-0.5 bg-gray-800 mb-1 transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <div className={`w-5 h-0.5 bg-gray-800 mb-1 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-5 h-0.5 bg-gray-800 transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2 text-sm font-semibold">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block hover:text-primary hover:bg-gray-50 px-2 py-1.5 rounded-md transition ${
                isActive(link.href)
                  ? "text-primary bg-gray-50 border-l-2 border-accent"
                  : "text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-100">
            {user ? (
              <>
                <Link
                  href={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="block text-gray-700 hover:text-primary hover:bg-gray-50 px-2 py-1.5 rounded-md transition"
                >
                  {user.role === "admin" ? "Admin Dashboard" : "Business Dashboard"}
                </Link>
                <form action={logout}>
                  <button type="submit" className="w-full text-left text-primary font-bold hover:bg-gray-50 px-2 py-1.5 rounded-md transition">
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block text-gray-700 hover:text-primary hover:bg-gray-50 px-2 py-1.5 rounded-md transition">Sign In</Link>
                <button onClick={openSubscribe} className="block w-full text-center bg-accent text-primary font-bold px-2 py-1.5 rounded-md hover:bg-yellow-400 transition mt-1">Subscribe</button>
              </>
            )}
          </div>
        </div>
      )}
      {/* Subscribe Modal */}
      {subscribeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setSubscribeOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative z-10 w-full max-w-md rounded-2xl p-7 shadow-2xl"
            style={{ background: "linear-gradient(135deg, #0D1B3E 0%, #020C1B 100%)", border: "1px solid rgba(255,255,255,0.12)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSubscribeOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition"
              aria-label="Close"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" fill="none" stroke="#F5A800" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Stay in the Loop
              </h2>
              <p className="text-white/50 text-sm mt-1">
                Get free Columbus deals, events &amp; local picks — straight to your inbox.
              </p>
            </div>

            {subMessage?.type === "success" ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-300 font-bold text-sm">{subMessage.text}</p>
                <button
                  onClick={() => setSubscribeOpen(false)}
                  className="mt-4 px-6 py-2 rounded-lg bg-accent text-primary text-sm font-bold hover:bg-yellow-400 transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  ref={subEmailRef}
                  type="email"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-white/20 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/60 transition"
                />
                {subMessage?.type === "error" && (
                  <p className="text-red-400 text-xs">{subMessage.text}</p>
                )}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-accent text-primary hover:bg-yellow-400 disabled:opacity-50 transition"
                >
                  {isPending ? "Subscribing..." : "Subscribe — It's Free"}
                </button>
                <p className="text-center text-white/30 text-xs">No spam. Unsubscribe anytime.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
