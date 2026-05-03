/**
 * Schema.org JSON-LD helpers for SEO, GEO, AEO.
 *
 * Use these in pages by injecting <script type="application/ld+json"> with the
 * stringified object. Google, Bing, ChatGPT, Perplexity, and AI Overviews all
 * read this structured data to power rich results, AI citations, and answer
 * boxes.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://catchcolumbus.com";
const SITE_NAME = "Catch Columbus";

/* ─── ORGANIZATION (publisher entity) ─────────────────────────────── */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  description:
    "Catch Columbus is the local guide for events, services, coupons, and things to do in Columbus, Ohio and surrounding suburbs including Dublin, Westerville, Hilliard, Grove City, Gahanna, Powell, and Worthington.",
  areaServed: {
    "@type": "City",
    name: "Columbus",
    "@id": "https://en.wikipedia.org/wiki/Columbus,_Ohio",
  },
  sameAs: [
    "https://www.facebook.com/catchcolumbus",
    "https://www.instagram.com/catchcolumbus",
    "https://twitter.com/catchcolumbus",
  ],
};

/* ─── WEBSITE + SITELINKS SEARCH BOX ──────────────────────────────── */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description:
    "Discover local events, services, coupons, and things to do in Columbus, Ohio and surrounding suburbs.",
  publisher: { "@id": `${SITE_URL}#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/* ─── BREADCRUMB ──────────────────────────────────────────────────── */
export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/* ─── FAQ PAGE (powers featured snippets + AI answers) ────────────── */
export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

/* ─── EVENT (for /events/[slug] pages) ────────────────────────────── */
export function eventSchema(event: {
  name: string;
  slug: string;
  startDate: string;
  startTime?: string | null;
  location?: string | null;
  description?: string | null;
  image?: string | null;
  price?: string | null;
}) {
  // Combine date + optional time into ISO 8601
  const startDateIso =
    event.startTime && event.startDate
      ? `${event.startDate}T${event.startTime}`
      : event.startDate;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: startDateIso,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location || "Columbus, Ohio",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Columbus",
        addressRegion: "OH",
        addressCountry: "US",
      },
    },
    image: event.image ? [event.image] : undefined,
    description: event.description || `${event.name} — a Columbus, Ohio event.`,
    url: `${SITE_URL}/events/${event.slug}`,
    offers: event.price
      ? {
          "@type": "Offer",
          price: event.price.toLowerCase() === "free" ? "0" : event.price.replace(/[^0-9.]/g, "") || "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/events/${event.slug}`,
        }
      : undefined,
    organizer: { "@id": `${SITE_URL}#organization` },
  };
}

/* ─── LOCAL BUSINESS (for /services/[category]/[slug] pages) ──────── */
export function localBusinessSchema(biz: {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  description?: string | null;
  image?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  website?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: biz.name,
    description:
      biz.description ||
      `${biz.name} — a ${biz.category} business in Columbus, Ohio.`,
    image: biz.image || undefined,
    url: `${SITE_URL}/services/${biz.categorySlug}/${biz.slug}`,
    telephone: biz.phone || undefined,
    email: biz.email || undefined,
    address: biz.address
      ? {
          "@type": "PostalAddress",
          streetAddress: biz.address,
          addressLocality: "Columbus",
          addressRegion: "OH",
          addressCountry: "US",
        }
      : undefined,
    sameAs: biz.website ? [biz.website] : undefined,
    areaServed: {
      "@type": "City",
      name: "Columbus",
    },
  };
}

/* ─── HELPER: stringify for <script> tag ──────────────────────────── */
export function jsonLd(obj: object): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}
