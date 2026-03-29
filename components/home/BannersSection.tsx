"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  display_order: number;
}

interface BannersSectionProps {
  banners: Banner[];
}

export default function BannersSection({ banners }: BannersSectionProps) {
  if (banners.length === 0) return null;

  return (
    <section className="py-8 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
          Featured
        </p>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {banners.map((banner) => {
            const inner = (
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-md cursor-pointer"
                style={{ width: 280, height: 120 }}
              >
                <Image
                  src={banner.image_url}
                  alt={banner.title || "Banner"}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {banner.title && (
                  <p className="absolute bottom-2 left-3 text-white text-sm font-semibold drop-shadow">
                    {banner.title}
                  </p>
                )}
              </motion.div>
            );

            return banner.link_url ? (
              <a
                key={banner.id}
                href={banner.link_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {inner}
              </a>
            ) : (
              <div key={banner.id}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
