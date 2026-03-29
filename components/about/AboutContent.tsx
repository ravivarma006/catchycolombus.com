"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface PageContent {
  hero_heading: string;
  hero_subheading: string;
  history_title: string;
  history_text: string;
  achievements_title: string;
  achievements: string[];
}

const STATS = [
  { value: "1812", label: "Year Founded" },
  { value: "915K+", label: "City Population" },
  { value: "2.1M+", label: "Metro Population" },
  { value: "#1", label: "Largest City in Ohio" },
];

const NEIGHBORHOODS = [
  {
    name: "Short North",
    description: "The arts and entertainment district — galleries, dining, nightlife.",
    color: "from-purple-900 to-primary",
    icon: "🎨",
  },
  {
    name: "German Village",
    description: "A National Historic Landmark with cobblestone streets and brick homes.",
    color: "from-amber-900 to-primary",
    icon: "🏘️",
  },
  {
    name: "Downtown",
    description: "The city's commercial and cultural core, home to events and landmarks.",
    color: "from-primary to-blue-900",
    icon: "🏙️",
  },
  {
    name: "Clintonville",
    description: "Eclectic neighborhood known for local shops and community spirit.",
    color: "from-green-900 to-primary",
    icon: "🌳",
  },
];

function FadeInUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "backOut" }}
      className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-8 hover:shadow-md transition-shadow"
    >
      <span className="text-4xl font-extrabold text-primary mb-1">{value}</span>
      <span className="text-sm text-gray-500 font-medium text-center">{label}</span>
    </motion.div>
  );
}

export default function AboutContent({ content }: { content: PageContent }) {
  const heroHeading = content.hero_heading || "About Columbus, Ohio";
  const heroSubheading = content.hero_subheading || "A city of innovation, culture, and community";
  const historyTitle = content.history_title || "A Rich History";
  const historyText = content.history_text || "";
  const achievementsTitle = content.achievements_title || "City Achievements & Highlights";
  const achievements = content.achievements || [];

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary text-white py-24 md:py-32">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--accent), transparent)" }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #60A5FA, transparent)" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-10 bg-accent/60" />
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">
                Columbus, Ohio
              </span>
              <span className="h-px w-10 bg-accent/60" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
              {heroHeading}
            </h1>
            <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto">
              {heroSubheading}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────── */}
      <section className="py-14 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} index={i} />
          ))}
        </div>
      </section>

      {/* ── History ──────────────────────────────── */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeInUp>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-8 bg-accent rounded-full" />
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">
                Our Story
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-5">
              {historyTitle}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">{historyText}</p>
            <p className="text-gray-500 leading-relaxed">
              Today, Columbus thrives as a hub for technology, healthcare, education, and arts —
              welcoming millions of visitors and new residents each year with its friendly
              neighborhoods and world-class amenities.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="relative">
              {/* Decorative timeline */}
              <div className="space-y-0">
                {[
                  { year: "1812", event: "Columbus founded and named" },
                  { year: "1816", event: "Became Ohio's state capital" },
                  { year: "1870", event: "Ohio State University established" },
                  { year: "1950s", event: "Major post-war growth begins" },
                  { year: "Today", event: "Ohio's largest and fastest-growing city" },
                ].map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex gap-4 items-start pb-6 last:pb-0"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-accent text-xs font-bold">{item.year.slice(0, 2)}</span>
                      </div>
                      {i < 4 && <div className="w-px h-full bg-gray-200 mt-1 flex-1 min-h-[1.5rem]" />}
                    </div>
                    <div className="pt-2">
                      <p className="text-xs font-bold text-accent tracking-wider uppercase mb-0.5">
                        {item.year}
                      </p>
                      <p className="text-gray-700 font-medium">{item.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ── Achievements ─────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <FadeInUp className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-px w-10 bg-accent/60" />
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">
                Why Columbus
              </span>
              <span className="h-px w-10 bg-accent/60" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
              {achievementsTitle}
            </h2>
          </FadeInUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {achievements.map((achievement, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,45,98,0.12)" }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm cursor-default"
              >
                <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-accent text-lg">★</span>
                </div>
                <p className="text-gray-700 font-medium leading-relaxed">{achievement}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Neighborhoods ────────────────────────── */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <FadeInUp className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-10 bg-accent/60" />
            <span className="text-accent text-xs font-semibold tracking-widest uppercase">
              Explore
            </span>
            <span className="h-px w-10 bg-accent/60" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
            Iconic Neighborhoods
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Every corner of Columbus tells a different story. Explore the neighborhoods that make this city unique.
          </p>
        </FadeInUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {NEIGHBORHOODS.map((n, i) => (
            <motion.div
              key={n.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className={`relative bg-gradient-to-br ${n.color} rounded-2xl p-6 text-white overflow-hidden cursor-default shadow-md`}
            >
              <div className="text-4xl mb-3">{n.icon}</div>
              <h3 className="text-lg font-bold mb-2">{n.name}</h3>
              <p className="text-white/75 text-sm leading-relaxed">{n.description}</p>
              {/* Decorative circle */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <FadeInUp>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Ready to Catch Columbus?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Discover local events, trusted services, and exclusive coupons — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/events"
                className="w-full sm:w-auto bg-accent text-primary font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-accent/20"
              >
                Browse Events →
              </Link>
              <Link
                href="/services"
                className="w-full sm:w-auto border-2 border-white/50 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 hover:border-white transition-colors"
              >
                Find Services
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
