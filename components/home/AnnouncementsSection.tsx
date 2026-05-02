"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Announcement {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  is_pinned: boolean;
  published_at: string;
}

interface AnnouncementsSectionProps {
  announcements: Announcement[];
}

export default function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  if (announcements.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
              Latest Updates
            </p>
            <h2
              className="text-2xl font-black text-foreground"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Catch us
            </h2>
          </div>
          <Link
            href="/announcements"
            className="text-sm font-semibold text-primary hover:text-accent transition"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {announcements.slice(0, 3).map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {item.image_url && (
                <div className="relative h-40 w-full">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  {item.is_pinned && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                      Pinned
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(item.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                {item.content && (
                  <p className="text-sm text-gray-500 line-clamp-2">{item.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
