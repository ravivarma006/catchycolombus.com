"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { FeaturedDeal } from "@/components/home/FeaturedDealsSection";
import { CATEGORY_GRADIENTS } from "@/lib/coupon-utils";

/* ────────────────────────── SLIDE DATA ────────────────────────── */
interface Slide {
  id: number;
  image: string;
  thumb: string;
  location: string;
  tag: string;
  headline: string[];
  sub: string;
  overlayFrom: string;
  overlayTo: string;
}

interface HeroSectionProps {
  slides: Slide[];
  stats: { value: string; label: string }[];
  deals?: FeaturedDeal[];
}

/* ── Timing constants (ms) ── */
const SHOW_DURATION = 5000;   // text + image visible (5s)
const TEXT_EXIT_MS  = 1200;   // text fades out fully, image stays (1.2s)

/* ─────────────────────── MOTION VARIANTS ─────────────────────── */
const lineVar = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.1 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, filter: "blur(12px)", transition: { duration: 0.9, ease: [0.4, 0, 0.6, 1] } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, filter: "blur(8px)", transition: { duration: 0.8, ease: [0.4, 0, 0.6, 1] } },
};

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */
export default function HeroSection({ slides, stats, deals = [] }: HeroSectionProps) {
  const [active, setActive] = useState(0);
  const [phase, setPhase]   = useState<"show" | "exiting">("show");
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  /* advance to next slide */
  const goNext = useCallback(() => {
    if (slides.length === 0) return;
    setActive((p) => (p + 1) % slides.length);
    setPhase("show");
  }, [slides.length]);

  /* jump to specific slide (e.g. thumbnail click) */
  const goTo = useCallback((i: number) => {
    setActive(i);
    setPhase("show");
  }, []);

  /* ── Two-phase auto-rotate ── */
  useEffect(() => {
    if (paused || slides.length === 0) return;

    if (phase === "show") {
      const t = setTimeout(() => setPhase("exiting"), SHOW_DURATION);
      return () => clearTimeout(t);
    }

    if (phase === "exiting") {
      const t = setTimeout(goNext, TEXT_EXIT_MS);
      return () => clearTimeout(t);
    }
  }, [phase, paused, goNext]);

  /* ── Mouse parallax ── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const imgX = useTransform(sx, [-1, 1], ["-3%", "3%"]);
  const imgY = useTransform(sy, [-1, 1], ["-3%", "3%"]);

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }
  function onMouseLeave() { mx.set(0); my.set(0); setPaused(false); }

  /* ── Fallback: no slides ── */
  if (slides.length === 0) {
    return (
      <section
        className="relative w-full overflow-hidden bg-[#020C1B] flex flex-col"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0F4C5C 0%, #020C1B 100%)" }} />
        <div className="relative z-10 text-center px-6 flex-1 flex items-center justify-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Catch <span style={{ color: "var(--accent)" }}>Columbus</span>
            </h1>
            <p className="text-white/60 text-lg mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Events, services, and hidden gems in the city you love.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/events" className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-2xl" style={{ backgroundColor: "var(--accent)", color: "#0F4C5C" }}>
                Explore Events
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-2xl" style={{ border: "1.5px solid rgba(255,255,255,0.30)", color: "rgba(255,255,255,0.85)", backgroundColor: "rgba(255,255,255,0.06)" }}>
                Browse Services
              </Link>
            </div>
          </div>
        </div>
        {renderDealsStrip()}
      </section>
    );
  }

  const slide = slides[active];
  const showText = phase === "show";

  /* Sanitize overlay colors to prevent CSS injection */
  const isValidColor = (c: string) =>
    /^(#[0-9a-fA-F]{3,8}|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\))$/.test(c.trim());
  const safeOverlayFrom = isValidColor(slide.overlayFrom) ? slide.overlayFrom : "rgba(0,0,0,0.85)";
  const safeOverlayTo = isValidColor(slide.overlayTo) ? slide.overlayTo : "rgba(0,0,0,0.40)";

  /* ── Deals strip renderer ── */
  function renderDealsStrip() {
    if (deals.length === 0) return null;
    return (
      <motion.div
        className="relative z-20 border-t border-white/10 px-6 md:px-16 lg:px-24 py-5"
        style={{ background: "linear-gradient(180deg, rgba(2,12,27,0.95) 0%, #020C1B 100%)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deals.map((deal) => {
            const catSlug = deal.categorySlug ?? "default";
            const gen = CATEGORY_GRADIENTS[catSlug] ?? CATEGORY_GRADIENTS.default;
            return (
              <Link key={deal.id} href={deal.href} className="group block">
                <div className="flex rounded-2xl overflow-hidden border border-white/10 bg-[#0a1628] hover:border-accent/30 transition-all duration-300 h-[130px]">
                  {/* Image side */}
                  <div className="relative w-[40%] shrink-0 overflow-hidden">
                    {deal.imageUrl ? (
                      <Image
                        src={deal.imageUrl}
                        alt={deal.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 40vw, 15vw"
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${gen.gradient}`} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1628]/80" />
                    {/* Discount badge */}
                    {deal.discountLabel && (
                      <span
                        className={`absolute top-2.5 left-2.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg ${
                          deal.discountLabel === "FREE"
                            ? "bg-emerald-500 text-white"
                            : "bg-accent text-[#020C1B]"
                        }`}
                      >
                        {deal.discountLabel}
                      </span>
                    )}
                  </div>
                  {/* Content side */}
                  <div className="p-4 flex flex-col justify-center flex-1 min-w-0">
                    {deal.categoryName && (
                      <span
                        className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5 block"
                        style={{ color: "var(--accent)" }}
                      >
                        {deal.categoryName}
                      </span>
                    )}
                    <h3
                      className="text-white font-bold text-sm uppercase leading-snug line-clamp-2 group-hover:text-accent transition-colors"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {deal.title}
                    </h3>
                    {deal.description && (
                      <p className="text-white/35 text-xs mt-1 line-clamp-1">{deal.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    );
  }

  /* pad slide number */
  const num = String(active + 1).padStart(2, "0");
  const total = String(slides.length).padStart(2, "0");

  /* total cycle duration for progress bar */
  const cycleSec = (SHOW_DURATION + TEXT_EXIT_MS) / 1000;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#020C1B] flex flex-col"
      style={{ minHeight: "calc(100vh - 64px)" }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={onMouseLeave}
    >
      {/* ══════════════ FULL-BLEED PHOTO ══════════════ */}
      <motion.div
        className="absolute inset-0"
        style={{ x: imgX, y: imgY, scale: 1.06 }}
      >
        <AnimatePresence mode="sync">
          {slides
            .filter((_, i) => i === active || i === (active + 1) % slides.length)
            .map((s) => (
              <motion.div
                key={`img-${s.id}`}
                className="absolute inset-0"
                initial={{ opacity: s.id === slide.id ? 0 : 0, scale: 1.04 }}
                animate={s.id === slide.id ? {
                  opacity: 1,
                  scale: 1.10,
                  transition: { opacity: { duration: 0.9 }, scale: { duration: 8, ease: "linear" } },
                } : { opacity: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.9 } }}
              >
                <Image
                  src={s.image}
                  alt={s.location}
                  fill
                  priority={s.id === slides[0]?.id}
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>

      {/* ══════════════ DARK OVERLAY ══════════════ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`ov-${active}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.9 } }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          style={{
            background: `linear-gradient(105deg, ${safeOverlayFrom} 0%, ${safeOverlayTo} 35%, rgba(0,0,0,0.20) 70%, rgba(0,0,0,0.05) 100%)`,
          }}
        />
      </AnimatePresence>
      {/* vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.40) 100%)" }}
      />
      {/* dot-grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ══════════════ MAIN LAYOUT GRID ══════════════ */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 md:px-16 lg:px-24 py-10 md:py-14" style={{ minHeight: 640 }}>

        {/* ── TOP ROW : location tag + slide counter ── */}
        <AnimatePresence mode="wait">
          {showText && (
            <motion.div
              key={`top-${active}`}
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.45 } }}
            >
              {/* Location pill */}
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0 animate-pulse"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                <span
                  className="text-white/70 text-xs md:text-sm font-medium tracking-[0.18em] uppercase"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {slide.location}
                </span>
              </div>

              {/* Slide counter */}
              <div className="flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <span className="text-white font-bold text-xl md:text-2xl">{num}</span>
                <div className="h-px w-10" style={{ background: `linear-gradient(90deg, ${"var(--accent)"}, rgba(255,255,255,0.25))` }} />
                <span className="text-white/40 text-sm font-medium">{total}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MIDDLE : HEADLINE BLOCK ── */}
        <div className="flex flex-col gap-0 max-w-3xl lg:max-w-4xl">
          <AnimatePresence mode="wait">
            {showText && (
              <motion.div
                key={`text-block-${active}`}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {/* Tag badge */}
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  variants={fadeUp}
                  custom={0}
                >
                  <span className="h-[2px] w-8" style={{ backgroundColor: "var(--accent)" }} />
                  <span
                    className="text-[11px] font-semibold tracking-[0.25em] uppercase"
                    style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
                  >
                    {slide.tag}
                  </span>
                </motion.div>

                {/* Staggered headline lines */}
                {slide.headline.map((line, i) => (
                  <div key={i} className="relative z-10" style={{ paddingBottom: "0.15em", marginBottom: "-0.15em", paddingTop: "0.1em", marginTop: "-0.1em" }}>
                    <motion.h1
                      className="block leading-none font-black text-white"
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)",
                        letterSpacing: "-0.02em",
                        textShadow: "0 4px 40px rgba(0,0,0,0.5)",
                      }}
                      custom={i}
                      variants={lineVar}
                    >
                      {i === slide.headline.length - 1 ? (
                        <span style={{ color: "var(--accent)" }}>{line}</span>
                      ) : (
                        line
                      )}
                    </motion.h1>
                  </div>
                ))}

                {/* Subheadline + CTAs */}
                <motion.div
                  className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-8"
                  variants={fadeUp}
                  custom={0.35}
                >
                  <div className="flex items-start gap-4 max-w-sm">
                    <div
                      className="w-[2px] self-stretch rounded-full shrink-0 mt-1"
                      style={{ backgroundColor: `${"var(--accent)"}99` }}
                    />
                    <p
                      className="text-white/65 text-sm md:text-base leading-relaxed"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {slide.sub}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {/* Value proposition badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "var(--accent)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
                      >
                        <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 3.8 2.4-7.4L2 9.4h7.6z"/></svg>
                        Save up to 40% on Columbus attractions
                      </span>
                      <span className="text-white/40 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>· Free to join</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/coupons"
                        id="hero-get-free-deals"
                        className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          backgroundColor: "var(--accent)",
                          color: "#0F4C5C",
                          fontFamily: "'Inter', sans-serif",
                          boxShadow: `0 8px 24px ${"var(--accent)"}66`,
                        }}
                      >
                        🎁 Get Free Deals
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                      <Link
                        href="/events"
                        id="hero-explore-events"
                        className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          border: "1.5px solid rgba(255,255,255,0.30)",
                          color: "rgba(255,255,255,0.85)",
                          fontFamily: "'Inter', sans-serif",
                          backgroundColor: "rgba(255,255,255,0.06)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        Explore Events
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── BOTTOM ROW : stats + thumbnail nav ── */}
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6">

          {/* City stats */}
          <motion.div
            className="flex items-center gap-6 md:gap-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.7 } }}
          >
            {stats.map((s, i) => (
              <div key={i} className="text-left">
                <p
                  className="font-extrabold text-lg md:text-2xl leading-none text-accent"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {s.value}
                </p>
                <p
                  className="text-[10px] text-white/45 font-medium tracking-wider uppercase mt-0.5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* ══════════════ DEALS STRIP ══════════════ */}
      {renderDealsStrip()}

      {/* ══════════════ DECORATIVE ELEMENTS ══════════════ */}
      <motion.div
        className="absolute -top-24 -right-24 rounded-full pointer-events-none hidden lg:block"
        style={{ width: 420, height: 420, border: `1px solid ${"var(--accent)"}33` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -top-8 -right-8 rounded-full pointer-events-none hidden lg:block"
        style={{ width: 280, height: 280, border: `1px solid ${"var(--accent)"}1F` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      {/* Scroll cue */}
      <motion.div
        className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55, transition: { delay: 1.5 } }}
      >
        <span
          className="text-[9px] tracking-[0.3em] uppercase text-white/60"
          style={{ fontFamily: "'Inter', sans-serif", writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Scroll
        </span>
        <div className="w-px h-14 bg-gradient-to-b from-transparent via-white/40 to-transparent" />
      </motion.div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
    </section>
  );
}
