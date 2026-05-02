"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CouponCard, { type Coupon } from "./CouponCard";

interface CouponCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export default function CouponsContent({
  coupons,
  categories,
}: {
  coupons: Coupon[];
  categories: CouponCategory[];
}) {
  const [activeSlug, setActiveSlug] = useState<string>("all");

  const filtered =
    activeSlug === "all"
      ? coupons
      : coupons.filter((c) => c.coupon_categories?.slug === activeSlug);

  return (
    <div>
      {/* Category filter tabs */}
      <div className="flex items-center gap-2 flex-wrap mb-10">
        {["all", ...categories.map((c) => c.slug)].map((slug) => {
          const label =
            slug === "all"
              ? "All"
              : categories.find((c) => c.slug === slug)?.name ?? slug;
          const isActive = activeSlug === slug;
          const count =
            slug === "all"
              ? coupons.length
              : coupons.filter((c) => c.coupon_categories?.slug === slug).length;

          return (
            <button
              key={slug}
              onClick={() => setActiveSlug(slug)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-accent text-[#020C1B] shadow-lg shadow-amber-500/20"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-accent/40 hover:text-gray-900"
              }`}
            >
              {label}
              <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4 text-center">
          <div className="text-6xl opacity-30">🏷️</div>
          <p className="text-gray-500 font-semibold text-xl">No coupons found.</p>
          <p className="text-gray-400 text-sm">
            {activeSlug === "all"
              ? "Check back soon — new coupons are added regularly."
              : "No coupons in this category yet."}
          </p>
        </div>
      ) : (
        <motion.div
          key={activeSlug}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {filtered.map((coupon, i) => (
            <CouponCard key={coupon.id} coupon={coupon} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
