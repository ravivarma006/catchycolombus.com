import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import HistoryContent from "@/components/history/HistoryContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "History of Columbus, Ohio — Catch Columbus",
  description:
    "Discover the rich history of Columbus, Ohio — from its founding in 1812 as Ohio's state capital to becoming the state's largest, fastest-growing city. Explore key milestones, iconic neighborhoods, and what makes Columbus a world-class city.",
  keywords: [
    "Columbus Ohio history",
    "Columbus founded 1812",
    "Ohio state capital",
    "German Village Columbus",
    "Short North history",
    "Ohio State University history",
    "Columbus landmarks",
    "Columbus Ohio neighborhoods",
    "history of Columbus Ohio",
    "Catch Columbus",
  ],
  openGraph: {
    title: "History of Columbus, Ohio — Catch Columbus",
    description:
      "From its 1812 founding to Ohio's largest city — explore Columbus history, milestones, neighborhoods, and achievements.",
    url: "https://catchcolumbus.com/history",
    siteName: "Catch Columbus",
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "History of Columbus, Ohio — Catch Columbus",
    description:
      "Explore the rich history of Columbus, Ohio — founded 1812, Ohio's capital, home of Ohio State, and America's fastest-growing major city.",
  },
  alternates: {
    canonical: "https://catchcolumbus.com/history",
  },
  other: {
    "geo.region": "US-OH",
    "geo.placename": "Columbus, Ohio",
    "geo.position": "39.9612;-82.9988",
    ICBM: "39.9612, -82.9988",
  },
};

interface PageContent {
  hero_heading: string;
  hero_subheading: string;
  history_title: string;
  history_text: string;
  achievements_title: string;
  achievements: string[];
}

export default async function HistoryPage() {
  const supabase = createClient();
  const { data: page } = await supabase
    .from("pages")
    .select("title, content, meta_description")
    .eq("slug", "about")
    .single();

  const content = (page?.content ?? {}) as PageContent;

  return <HistoryContent content={content} />;
}
