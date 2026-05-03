import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StickyDealBar from "@/components/StickyDealBar";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import MobileBottomNav from "@/components/MobileBottomNav";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://catchcolumbus.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Catch Columbus — Your City Guide",
    template: "%s | Catch Columbus",
  },
  description:
    "Discover local events, services, coupons, and announcements in Columbus, Ohio. Your one-stop city guide for everything Columbus.",
  keywords: [
    "Columbus Ohio",
    "Columbus events",
    "Columbus services",
    "Columbus coupons",
    "Columbus business directory",
    "things to do in Columbus",
    "Columbus city guide",
  ],
  authors: [{ name: "Catch Columbus" }],
  creator: "Catch Columbus",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Catch Columbus",
    title: "Catch Columbus — Your City Guide",
    description:
      "Discover local events, services, coupons, and announcements in Columbus, Ohio.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Catch Columbus — Your City Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catch Columbus — Your City Guide",
    description:
      "Discover local events, services, coupons, and announcements in Columbus, Ohio.",
    images: [`${SITE_URL}/og-image.png`],
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
  const supabase = createClient();
  const [
    { data: { user } },
    { data: siteSettings },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("site_settings").select("primary_color, accent_color").eq("id", 1).single(),
  ]);

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const navUser = user
    ? { email: user.email, role: profile?.role }
    : null;

  const primaryColor = siteSettings?.primary_color ?? "#0F4C5C";
  const accentColor  = siteSettings?.accent_color  ?? "#F5A800";
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
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
        <GoogleAnalytics />
        <Navbar user={navUser} />
        <main className={!user ? "pb-16 md:pb-0" : ""}>{children}</main>
        <Footer />
        {!user && <StickyDealBar />}
        {!user && <ExitIntentPopup />}
        {!user && <MobileBottomNav />}
      </body>
    </html>
  );
}
