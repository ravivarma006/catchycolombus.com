import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin — Catch Columbus", template: "%s | Admin — Catch Columbus" },
};

const NAV = [
  { href: "/admin",               label: "Overview",       icon: "🏠" },
  { href: "/admin/hero",          label: "Hero",           icon: "🖼️" },
  { href: "/admin/events",        label: "Events",         icon: "📅" },
  { href: "/admin/things-to-do",  label: "Things to Do",   icon: "🎯" },
  { href: "/admin/services",      label: "Businesses",     icon: "🏢" },
  { href: "/admin/coupons",       label: "Coupons",        icon: "🏷️" },
  { href: "/admin/announcements", label: "Announcements",  icon: "📢" },
  { href: "/admin/subscribers",   label: "Subscribers",    icon: "📧" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)" }}
    >
      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 border-r border-white/10 flex flex-col py-8 px-4 sticky top-0 h-screen">
        {/* Brand */}
        <div className="mb-8 px-2">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-1">Admin Panel</p>
          <p className="text-white font-black text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Catch Columbus
          </p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.08] text-sm font-semibold transition-all"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-4 mt-4">
          <p className="text-white/40 text-xs font-medium px-2 truncate mb-3">
            {profile?.full_name || user.email}
          </p>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] text-xs font-semibold transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
