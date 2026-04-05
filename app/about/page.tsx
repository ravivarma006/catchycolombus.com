import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AboutContent from "@/components/about/AboutContent";

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: "About Columbus — Catch Columbus",
  description:
    "Learn about Columbus, Ohio — its rich history, achievements, and what makes it a great place to live, work, and play.",
};

interface PageContent {
  hero_heading: string;
  hero_subheading: string;
  history_title: string;
  history_text: string;
  achievements_title: string;
  achievements: string[];
}

export default async function AboutPage() {
  const supabase = createClient();
  const { data: page } = await supabase
    .from("pages")
    .select("title, content, meta_description")
    .eq("slug", "about")
    .single();

  const content = (page?.content ?? {}) as PageContent;

  return <AboutContent content={content} />;
}
