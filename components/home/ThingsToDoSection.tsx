"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface FeaturedActivity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  neighborhood: string | null;
  price_range: string | null;
  category: { name: string; slug: string } | null;
}

interface ThingsToDoSectionProps {
  activities: FeaturedActivity[];
}

const containerVar = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVar = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function ThingsToDoSection({ activities }: ThingsToDoSectionProps) {
  if (activities.length === 0) return null;

  return (
    <section className="relative w-full py-24 sm:py-32 bg-[#020C1B] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
              Explore Columbus
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Things to{" "}
            <span className="text-accent relative">
              Do
              <span className="absolute bottom-1 left-0 w-full h-1 bg-accent/30 rounded-full" />
            </span>
          </h2>
          <p className="text-white/50 mt-3 text-lg">
            From world-class museums to outdoor adventures — discover what makes Columbus unforgettable.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVar}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {activities.slice(0, 6).map((act) => (
            <motion.div key={act.id} variants={cardVar} className="group">
              <Link
                href={`/things-to-do/${act.category?.slug ?? "attractions"}/${act.slug}`}
                className="block relative w-full h-[320px] rounded-[2rem] overflow-hidden border border-white/10 hover:border-white/25 hover:shadow-2xl hover:shadow-black/30 transition-all duration-500"
              >
                {act.image_url ? (
                  <Image
                    src={act.image_url}
                    alt={act.name}
                    fill
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20" />
                )}

                {/* Gradients */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#020C1B]/90 via-[#020C1B]/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-60" />

                {/* Category badge */}
                {act.category && (
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent text-[#020C1B] uppercase tracking-widest">
                      {act.category.name}
                    </span>
                  </div>
                )}

                {/* Price */}
                {act.price_range && (
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/10">
                      {act.price_range}
                    </span>
                  </div>
                )}

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h3
                    className="text-xl font-black text-white mb-1 leading-tight group-hover:text-accent transition-colors duration-300"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {act.name}
                  </h3>
                  {act.neighborhood && (
                    <p className="text-white/50 text-sm">{act.neighborhood}</p>
                  )}
                </div>

                {/* Hover arrow */}
                <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:bg-accent group-hover:text-[#020C1B] group-hover:border-accent transition-all duration-500 z-10">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link
            href="/things-to-do"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-accent hover:text-[#020C1B] text-white font-bold text-sm px-8 py-3.5 rounded-2xl border border-white/10 hover:border-accent transition-all duration-300 hover:scale-[1.02]"
          >
            View All Things to Do
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
