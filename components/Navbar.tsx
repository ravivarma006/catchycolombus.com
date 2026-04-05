"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="bg-white text-gray-800 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-primary font-black text-xl tracking-tight">
              Catch Columbus
            </span>
          </Link>

          {/* Desktop Nav */}
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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
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

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`w-5 h-0.5 bg-gray-800 mb-1 transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-gray-800 mb-1 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-gray-800 transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
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
