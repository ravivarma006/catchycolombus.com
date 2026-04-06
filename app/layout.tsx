import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StickyDealBar from "@/components/StickyDealBar";
import ExitIntentPopup from "@/components/ExitIntentPopup";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  return (
    <html lang="en">
      <head>
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
        <main>{children}</main>
        <Footer />
        <AccentSwitcher />
        {!user && <StickyDealBar />}
        {!user && <ExitIntentPopup />}
      </body>
    </html>
  );
}
