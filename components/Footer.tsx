import Link from "next/link";

const NAV_SECTIONS = [
  {
    title: "Explore",
    links: [
      { label: "Events", href: "/events" },
      { label: "Things to Do", href: "/things-to-do" },
      { label: "Services", href: "/services" },
      { label: "Coupons", href: "/coupons" },
      { label: "News", href: "/announcements" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Attractions", href: "/things-to-do/attractions" },
      { label: "Museums", href: "/things-to-do/museums" },
      { label: "Parks & Nature", href: "/things-to-do/parks-nature" },
      { label: "Shopping", href: "/things-to-do/shopping" },
      { label: "Nightlife", href: "/things-to-do/nightlife" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "History", href: "/history" },
      { label: "Contact", href: "/history" },
      { label: "Sign In", href: "/auth/login" },
      { label: "Sign Up", href: "/auth/signup" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com/catchcolumbus",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/catchcolumbus",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://x.com/catchcolumbus",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@catchcolumbus",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020C1B] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-30%] left-[-15%] w-[50%] h-[50%] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/8 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="pt-16 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span
                className="text-2xl font-black text-white tracking-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Catch{" "}
                <span className="text-accent">Columbus</span>
              </span>
            </Link>
            <p className="mt-4 text-white/45 text-sm leading-relaxed max-w-sm">
              Your ultimate city guide to Columbus, Ohio. Discover local events,
              services, attractions, and hidden gems that make Columbus
              unforgettable.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:bg-accent hover:text-[#020C1B] hover:border-accent transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav sections */}
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-5">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-accent transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {currentYear} Catch Columbus. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-white/25">
            <span>Made with</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-accent/60">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>in Columbus, Ohio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
