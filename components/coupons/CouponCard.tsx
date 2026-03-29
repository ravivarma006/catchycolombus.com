"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CATEGORY_GRADIENTS } from "@/lib/coupon-utils";
export { CATEGORY_GRADIENTS } from "@/lib/coupon-utils";

export interface Coupon {
  id: string;
  category_id: string | null;
  product_service_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  description: string | null;
  coupon_code: string | null;
  website: string | null;
  image_url: string | null;
  social_links: Record<string, string> | null;
  coupon_categories: { name: string; slug: string } | null;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" },
  }),
};

/* ── Named export: used by detail page too ── */
export function CouponCopyBox({ code, large = false }: { code: string; large?: boolean }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className={`flex items-center gap-3 bg-white/5 border border-dashed border-accent/40 rounded-2xl ${large ? "px-5 py-4" : "px-3 py-2.5"}`}>
      <span className={`text-accent font-mono font-black flex-1 tracking-widest truncate ${large ? "text-2xl" : "text-sm"}`}>
        {code}
      </span>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}
        className={`shrink-0 font-bold rounded-xl bg-accent text-[#020C1B] hover:bg-yellow-400 active:scale-95 transition-all duration-150 text-center ${large ? "text-sm px-5 py-2.5 min-w-[110px]" : "text-xs px-3 py-1.5 min-w-[72px]"}`}
      >
        {copied ? "Copied ✓" : large ? "Copy Code" : "Copy"}
      </button>
    </div>
  );
}

/* ── Default export: coupon card ── */
export default function CouponCard({ coupon, index }: { coupon: Coupon; index: number }) {
  const catSlug = coupon.coupon_categories?.slug ?? "default";
  const gen = CATEGORY_GRADIENTS[catSlug] ?? CATEGORY_GRADIENTS.default;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <Link href={`/coupons/${coupon.id}`} className="group block">
        <div className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-white/25 hover:bg-white/[0.12] hover:shadow-2xl hover:shadow-black/30 transition-all duration-500">

          {/* Visual panel */}
          <div className="relative w-full h-48">
            {coupon.image_url ? (
              <Image
                src={coupon.image_url}
                alt={coupon.product_service_name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${gen.gradient} flex items-center justify-center`}>
                <span className="text-6xl">{gen.emoji}</span>
                <div className="absolute inset-0 bg-white/5" />
              </div>
            )}
            {/* Gradient fade to card body */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0a0e1a] to-transparent" />

            {/* Category badge */}
            {coupon.coupon_categories?.name && (
              <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/90 border border-white/10">
                {coupon.coupon_categories.name}
              </span>
            )}
          </div>

          {/* Card body */}
          <div className="p-5">
            <h3
              className="text-base font-black text-white mb-1 leading-snug line-clamp-1 group-hover:text-accent transition-colors duration-300"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {coupon.product_service_name}
            </h3>

            {coupon.description && (
              <p className="text-white/50 text-sm line-clamp-2 mb-4 leading-relaxed">
                {coupon.description}
              </p>
            )}

            {/* Coupon code row */}
            {coupon.coupon_code ? (
              <div onClick={(e) => e.preventDefault()}>
                <CouponCopyBox code={coupon.coupon_code} />
              </div>
            ) : (
              <span className="inline-block text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70">
                Mention Catch Columbus
              </span>
            )}
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
