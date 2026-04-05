import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const revalidate = 300; // 5 minutes

export const metadata: Metadata = {
  title: "City Announcements — Catch Columbus",
  description: "Latest news and announcements from Columbus, Ohio.",
};

export default async function AnnouncementsPage() {
  const supabase = createClient();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, content, image_url, is_pinned, published_at")
    .eq("is_active", true)
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false });

  const items = announcements ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-14">
          <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-3">
            Stay Informed
          </p>
          <h1
            className="text-4xl md:text-5xl font-black text-white mb-3"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            City Announcements
          </h1>
          <p className="text-white/60 text-lg max-w-xl">
            The latest news, updates, and important information for Columbus residents and visitors.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No announcements yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <article
                key={item.id}
                className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {item.image_url && (
                    <div className="relative w-full md:w-72 h-48 md:h-auto shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 288px"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      {item.is_pinned && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                          Pinned
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(item.published_at).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h2
                      className="text-xl font-bold text-foreground mb-2"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {item.title}
                    </h2>
                    {item.content && (
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
