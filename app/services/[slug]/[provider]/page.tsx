import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_FALLBACK_IMAGES, DEFAULT_SERVICE_IMAGE } from "@/lib/constants/images";
import type { Metadata } from "next";

interface ProviderDetail {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  description: string | null;
  website: string | null;
  image_url: string | null;
  social_links: Record<string, string> | null;
  category: {
    name: string;
    slug: string;
    icon: string | null;
  } | null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; provider: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("service_providers")
    .select("name, description")
    .eq("slug", params.provider)
    .eq("is_active", true)
    .single();

  if (!data) return { title: "Provider Not Found — Catch Columbus" };

  return {
    title: `${data.name} — Catch Columbus`,
    description:
      data.description ?? `${data.name} — local service provider in Columbus, Ohio.`,
  };
}

export default async function ProviderDetailPage({
  params,
}: {
  params: { slug: string; provider: string };
}) {
  const supabase = createClient();

  // Get provider + category join
  const { data: provider } = await supabase
    .from("service_providers")
    .select(
      `id, name, slug, phone, email, address, description, website, image_url, social_links,
       category:service_categories!category_id(name, slug, icon)`
    )
    .eq("slug", params.provider)
    .eq("is_active", true)
    .single();

  if (!provider) notFound();

  const p = provider as unknown as ProviderDetail;
  const catSlug = p.category?.slug || params.slug;
  const heroImg =
    p.image_url || SERVICE_FALLBACK_IMAGES[catSlug] || DEFAULT_SERVICE_IMAGE;

  const socials = p.social_links || {};
  const hasSocials = Object.values(socials).some(Boolean);

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://catchcolumbus.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: p.name,
    description: p.description ?? undefined,
    image: p.image_url ?? undefined,
    telephone: p.phone ?? undefined,
    email: p.email ?? undefined,
    url: p.website ?? `${SITE_URL}/services/${catSlug}/${p.slug}`,
    address: p.address
      ? { "@type": "PostalAddress", streetAddress: p.address, addressLocality: "Columbus", addressRegion: "OH", addressCountry: "US" }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)" }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/15 blur-[130px]" />
        <div className="absolute top-[40%] left-[35%] w-[40%] h-[40%] rounded-full bg-violet-600/15 blur-[110px]" />
      </div>

      {/* Hero */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden bg-[#020C1B]">
        <Image
          src={heroImg}
          alt={p.name}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back */}
        <div className="absolute top-5 left-5 z-10">
          <Link
            href={`/services/${catSlug}`}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium bg-black/20 hover:bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to {p.category?.name || "Services"}
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
          <div className="max-w-4xl mx-auto">
            {p.category && (
              <span className="inline-block text-xs font-bold tracking-widest uppercase bg-accent text-[#020C1B] px-3 py-1 rounded-full mb-3">
                {p.category.icon} {p.category.name}
              </span>
            )}
            <h1
              className="text-3xl md:text-5xl font-black text-white leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {p.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Details Card */}
          <div className="md:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-5">
              <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Contact Info
              </h2>

              {/* Address */}
              {p.address && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-accent">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 font-medium mb-0.5">Address</p>
                    <p className="text-sm font-semibold text-white">{p.address}</p>
                  </div>
                </div>
              )}

              {/* Phone */}
              {p.phone && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-accent">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.09 5.18 2 2 0 015.11 3h3a2 2 0 012 1.72c.13.81.36 1.6.68 2.34a2 2 0 01-.45 2.11L8.09 11.5a16 16 0 006.41 6.41l2.33-2.33a2 2 0 012.11-.45c.74.32 1.53.55 2.34.68a2 2 0 011.72 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 font-medium mb-0.5">Phone</p>
                    <a href={`tel:${p.phone}`} className="text-sm font-semibold text-white hover:text-accent transition-colors">
                      {p.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Email */}
              {p.email && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-accent">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 font-medium mb-0.5">Email</p>
                    <a href={`mailto:${p.email}`} className="text-sm font-semibold text-white hover:text-accent transition-colors break-all">
                      {p.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Website CTA */}
              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-[#e09e00] text-[#020C1B] font-bold text-sm py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95 mt-2"
                >
                  Visit Website
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              )}

              {/* Social Links */}
              {hasSocials && (
                <div>
                  <p className="text-xs text-white/40 font-medium mb-2 uppercase tracking-widest">Social</p>
                  <div className="flex gap-2">
                    {socials.facebook && (
                      <a href={socials.facebook} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent hover:text-[#020C1B] flex items-center justify-center text-white/70 text-xs font-bold transition-all"
                        aria-label="Facebook">f</a>
                    )}
                    {socials.instagram && (
                      <a href={socials.instagram} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent hover:text-[#020C1B] flex items-center justify-center text-white/70 text-xs font-bold transition-all"
                        aria-label="Instagram">ig</a>
                    )}
                    {socials.linkedin && (
                      <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent hover:text-[#020C1B] flex items-center justify-center text-white/70 text-xs font-bold transition-all"
                        aria-label="LinkedIn">in</a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            {p.description ? (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">About</h2>
                <p className="text-white/80 leading-relaxed whitespace-pre-line">{p.description}</p>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex items-center justify-center h-32">
                <p className="text-white/30 text-sm">No description available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
