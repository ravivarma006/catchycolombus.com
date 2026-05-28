import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StickyDealBar from "@/components/StickyDealBar";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import MobileBottomNav from "@/components/MobileBottomNav";
import { createClient } from "@/lib/supabase/server";
import { organizationSchema, websiteSchema, jsonLd } from "@/lib/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://catchcolumbus.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Catch Columbus — Events, Services & Coupons in Columbus, Ohio",
    template: "%s | Catch Columbus",
  },
  description:
    "Catch Columbus is your free local guide to events, services, coupons, and things to do in Columbus, Ohio and surrounding suburbs including Dublin, Westerville, Hilliard, Grove City, Gahanna, Powell, and Worthington.",
  keywords: [
    // Core
    "Columbus Ohio",
    "Columbus city guide",
    "Catch Columbus",
    // Discovery intents
    "Columbus events",
    "things to do in Columbus",
    "Columbus events this weekend",
    "Columbus services",
    "Columbus coupons",
    "Columbus deals",
    "Columbus business directory",
    "Columbus restaurants",
    "free events Columbus Ohio",
    // Suburbs (long-tail)
    "Dublin Ohio events",
    "Westerville Ohio things to do",
    "Hilliard Ohio businesses",
    "Grove City Ohio",
    "Gahanna Ohio dining",
    "Powell Ohio",
    "Worthington Ohio",
    "Upper Arlington Ohio",
    "Bexley Ohio",
    "New Albany Ohio",
    "Columbus suburbs guide",
  ],
  authors: [{ name: "Catch Columbus" }],
  creator: "Catch Columbus",
  publisher: "Catch Columbus",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Catch Columbus",
    title: "Catch Columbus — Events, Services & Coupons in Columbus, Ohio",
    description:
      "Discover events, services, coupons & things to do across Columbus and its suburbs — Dublin, Westerville, Hilliard, Gahanna, Powell, and more.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Catch Columbus — Your City Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catch Columbus — Events, Services & Coupons in Columbus, Ohio",
    description:
      "Free local guide to events, services, coupons & things to do across Columbus and its suburbs.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "lifestyle",
};

function hexToRgbParts(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let navUser: { email: string | undefined; role: string | undefined } | null = null;
  let primaryColor = "#0F4C5C";
  let accentColor = "#F5A800";

  try {
    const supabase = createClient();
    const [
      { data: { user } },
      { data: siteSettings },
    ] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("site_settings").select("primary_color, accent_color").eq("id", 1).single(),
    ]);

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      navUser = { email: user.email, role: profile?.role };
    }

    primaryColor = siteSettings?.primary_color ?? "#0F4C5C";
    accentColor = siteSettings?.accent_color ?? "#F5A800";
  } catch (e: any) {
    if (e?.message?.includes("Dynamic server usage") || e?.digest?.startsWith("DYNAMIC_SERVER_USAGE")) {
      throw e;
    }
    console.error("Layout: Supabase init failed, using defaults", e);
  }
  const primaryRgb   = hexToRgbParts(primaryColor);
  const accentRgb    = hexToRgbParts(accentColor);

  const colorVars = `
    :root {
      --primary: ${primaryColor};
      --primary-rgb: ${primaryRgb};
      --accent: ${accentColor};
      --accent-rgb: ${accentRgb};
    }
  `.trim();

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: colorVars }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Non-blocking font load: preload + media-swap pattern so HTML paints immediately on mobile */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          media="print"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          />
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.querySelectorAll('link[media=\"print\"][rel=\"stylesheet\"]').forEach(function(l){l.media='all';});",
          }}
        />
        {/* Geographic targeting hints for search engines */}
        <meta name="geo.region" content="US-OH" />
        <meta name="geo.placename" content="Columbus, Ohio" />
        <meta name="geo.position" content="39.9612;-82.9988" />
        <meta name="ICBM" content="39.9612, -82.9988" />
        {/* Schema.org: Organization + WebSite (sitelinks search box, AI citations) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteSchema) }}
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
        <GoogleAnalytics />
        <Navbar user={navUser} />
        <main className={!navUser ? "pb-16 md:pb-0" : ""}>{children}</main>
        <Footer />
        {!navUser && <StickyDealBar />}
        {!navUser && <ExitIntentPopup />}
        {!navUser && <MobileBottomNav />}
      </body>
    </html>
  );
}
