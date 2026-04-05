"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "10,000+", label: "Active Members" },
  { value: "200+", label: "Events Monthly" },
  { value: "50+", label: "Partner Businesses" },
  { value: "#1", label: "City Guide in Ohio" },
];

const TESTIMONIALS = [
  {
    quote: "Found the best hidden gems through Catch Columbus! The coupons page alone saved my family over $120 last month.",
    name: "Sarah M.",
    location: "Short North",
    avatar: "SM",
    color: "#F59E0B",
  },
  {
    quote: "Saved $80 on a weekend out thanks to the coupons page. I recommend this to everyone who moves to Columbus.",
    name: "James R.",
    location: "Dublin, OH",
    avatar: "JR",
    color: "#3B82F6",
  },
  {
    quote: "Best local resource for Columbus events, hands down. I check it every Friday before planning the weekend.",
    name: "Priya K.",
    location: "Westerville",
    avatar: "PK",
    color: "#8B5CF6",
  },
];

const PARTNERS = [
  { name: "Columbus Zoo", initials: "CZ" },
  { name: "COSI", initials: "CO" },
  { name: "PromoWest", initials: "PW" },
  { name: "Easton Town", initials: "ET" },
  { name: "Short North", initials: "SN" },
  { name: "Columbus Crew", initials: "CC" },
];

const fadeUpVar = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

function StarRating() {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: "var(--accent)" }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TrustSection() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #020C1B 0%, #0A1628 50%, #020C1B 100%)" }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60%] h-[50%] rounded-full blur-[120px] opacity-10" style={{ backgroundColor: "var(--accent)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-[2px] w-8" style={{ backgroundColor: "var(--accent)" }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}>
              Trusted by Columbus locals
            </span>
            <span className="h-[2px] w-8" style={{ backgroundColor: "var(--accent)" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Thousands already{" "}
            <span style={{ color: "var(--accent)" }}>saving money</span>
          </h2>
          <p className="mt-3 text-white/50 max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Join the largest community of Columbus locals discovering the best deals, events, and hidden gems.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUpVar}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center py-6 px-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-3xl md:text-4xl font-black mb-1" style={{ color: "var(--accent)", fontFamily: "'Outfit', sans-serif" }}>
                {stat.value}
              </p>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              custom={i}
              variants={fadeUpVar}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col p-6 rounded-3xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <StarRating />
              <p className="mt-4 text-white/75 text-sm leading-relaxed flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{ backgroundColor: t.color + "33", border: `1.5px solid ${t.color}66`, color: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {t.name}
                  </p>
                  <p className="text-white/40 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partner logos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center text-white/30 text-xs font-medium uppercase tracking-[0.2em] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            Trusted partners across Columbus
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {PARTNERS.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300 hover:border-white/20"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                  style={{ backgroundColor: "var(--accent)", color: "#020C1B" }}
                >
                  {p.initials}
                </div>
                <span className="text-white/60 text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
