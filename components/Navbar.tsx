"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/auth/actions";

const NAV_LINKS = [
  { href: "/events", label: "Events" },
  { href: "/things-to-do", label: "Things to Do" },
  { href: "/services", label: "Services" },
  { href: "/coupons", label: "Coupons" },
  { href: "/announcements", label: "News" },
  { href: "/about", label: "About" },
];

interface NavbarProps {
  user: { email?: string; role?: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

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
                  href="/dashboard"
                  className="text-sm font-semibold hover:text-primary transition"
                >
                  Dashboard
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
                  className="text-sm font-semibold hover:text-primary transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-accent text-primary px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:shadow hover:bg-yellow-400 transition"
                >
                  Sign Up
                </Link>
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
                <Link href="/dashboard" className="block text-gray-700 hover:text-primary hover:bg-gray-50 px-2 py-1.5 rounded-md transition">Dashboard</Link>
                <form action={logout}>
                  <button type="submit" className="w-full text-left text-primary font-bold hover:bg-gray-50 px-2 py-1.5 rounded-md transition">
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block text-gray-700 hover:text-primary hover:bg-gray-50 px-2 py-1.5 rounded-md transition">Sign In</Link>
                <Link href="/auth/signup" className="block text-primary font-bold hover:bg-gray-50 px-2 py-1.5 rounded-md transition">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
