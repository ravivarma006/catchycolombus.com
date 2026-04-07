"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORY_GRADIENTS } from "@/lib/coupon-utils";
import CountdownTimer from "@/components/coupons/CountdownTimer";
import ScarcityBadge from "@/components/coupons/ScarcityBadge";

export interface FeaturedDeal {
  id: string;
  type: "coupon" | "event";
  title: string;
  description: string | null;
  imageUrl: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  href: string;
  discountLabel: string | null;
  expiresAt: string | null;
  maxRedemptions: number | null;
  currentRedemptions: number;
  isPremium: boolean;
}

interface FeaturedDealsSectionProps {
  deals: FeaturedDeal[];
}

const containerVar = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVar = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FeaturedDealsSection({ deals }: FeaturedDealsSectionProps) {
  if (deals.length === 0) return null;

  return (
    <section className="relative w-full py-24 sm:py-32 bg-[#020C1B] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-emerald-500/8 blur-[120px]" />
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
              Deals & Offers
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Save Money in Columbus
          </h2>
          <p className="text-white/50 text-lg mt-4 leading-relaxed">
            Exclusive discounts on attractions, dining, and local services.
            Grab a deal before it&apos;s gone.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVar}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {deals.map((deal, i) => {
            const catSlug = deal.categorySlug ?? "default";
            const gen =
              CATEGORY_GRADIENTS[catSlug] ?? CATEGORY_GRADIENTS.default;

            return (
              <motion.div key={deal.id} variants={cardVar}>
                <Link href={deal.href} className="group block">
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 22,
                    }}
                    className="rounded-3xl border border-white/10 overflow-hidden bg-[#0a1628] transition-shadow hover:shadow-2xl hover:shadow-accent/5"
                  >
                    {/* Image Area */}
                    <div className="relative h-48 overflow-hidden">
                      {deal.imageUrl ? (
                        <Image
                          src={deal.imageUrl}
                          alt={deal.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${gen.gradient}`}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Discount Badge */}
                      {deal.discountLabel && (
                        <span
                          className={`absolute top-3 left-3 z-10 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg ${
                            deal.discountLabel === "FREE"
                              ? "bg-emerald-500 text-white"
                              : "bg-accent text-[#020C1B]"
                          }`}
                        >
                          {deal.discountLabel}
                        </span>
                      )}

                      {/* Premium Badge */}
                      {deal.isPremium && (
                        <span className="absolute bottom-3 left-3 z-10 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-400/50 backdrop-blur-sm">
                          Premium
                        </span>
                      )}

                      {/* Scarcity Badge */}
                      <ScarcityBadge
                        maxRedemptions={deal.maxRedemptions}
                        currentRedemptions={deal.currentRedemptions}
                      />
                    </div>

                    {/* Content Area */}
                    <div className="p-5">
                      {deal.categoryName && (
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent block mb-2">
                          {deal.categoryName}
                        </span>
                      )}
                      <h3
                        className="text-white font-bold text-lg leading-snug mb-2 line-clamp-1 group-hover:text-accent transition-colors"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {deal.title}
                      </h3>
                      {deal.description && (
                        <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                          {deal.description}
                        </p>
                      )}

                      {/* Countdown Timer */}
                      <CountdownTimer expiresAt={deal.expiresAt} />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10"
        >
          <Link
            href="/coupons"
            className="inline-flex items-center gap-2 text-accent font-bold text-sm hover:text-yellow-400 transition group"
          >
            View All Deals
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <button
            onClick={() =>
              document
                .getElementById("subscribe-email-submit")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-white/40 text-sm hover:text-accent transition flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Subscribe for weekly offers
          </button>
        </motion.div>
      </div>
    </section>
  );
}
