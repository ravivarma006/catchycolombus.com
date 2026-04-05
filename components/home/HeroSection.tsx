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
export default function HeroSection({ slides, stats }: HeroSectionProps) {
  const [active, setActive] = useState(0);
  const [phase, setPhase]   = useState<"show" | "exiting">("show");
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  /* advance to next slide */
  const goNext = useCallback(() => {
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
    if (paused) return;

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
        className="relative w-full overflow-hidden bg-[#020C1B] flex items-center justify-center"
        style={{ height: "calc(100vh - 64px)", minHeight: 640 }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0F4C5C 0%, #020C1B 100%)" }} />
        <div className="relative z-10 text-center px-6">
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
      </section>
    );
  }

  const slide = slides[active];
  const showText = phase === "show";

  /* pad slide number */
  const num = String(active + 1).padStart(2, "0");
  const total = String(slides.length).padStart(2, "0");

  /* total cycle duration for progress bar */
  const cycleSec = (SHOW_DURATION + TEXT_EXIT_MS) / 1000;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#020C1B]"
      style={{ height: "calc(100vh - 64px)", minHeight: 640 }}
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
          <motion.div
            key={`img-${active}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{
              opacity: 1,
              scale: 1.10,
              transition: { opacity: { duration: 0.9 }, scale: { duration: 8, ease: "linear" } },
            }}
            exit={{ opacity: 0, transition: { duration: 0.9 } }}
          >
            <Image
              src={slide.image}
              alt={slide.location}
              fill
              priority={active === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
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
            background: `linear-gradient(105deg, ${slide.overlayFrom} 0%, ${slide.overlayTo} 35%, rgba(0,0,0,0.20) 70%, rgba(0,0,0,0.05) 100%)`,
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
      <div className="absolute inset-0 flex flex-col justify-between px-6 md:px-16 lg:px-24 py-10 md:py-14">

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

          {/* Thumbnail navigation */}
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.7 } }}
          >
            {slides.map((s, i) => (
              <button
                key={i}
                id={`hero-thumb-${i}`}
                onClick={() => goTo(i)}
                aria-label={`Go to ${s.location}`}
                className="relative rounded-xl overflow-hidden transition-all duration-300 focus:outline-none"
                style={{
                  width: i === active ? 72 : 48,
                  height: i === active ? 52 : 36,
                  opacity: i === active ? 1 : 0.45,
                  boxShadow: i === active
                    ? `0 0 0 2px ${"var(--accent)"}, 0 4px 16px rgba(0,0,0,0.4)`
                    : "none",
                }}
              >
                <Image
                  src={s.thumb}
                  alt={s.location}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                {/* active slide progress sweep */}
                {i === active && (
                  <motion.div
                    key={`sw-${active}-${phase}`}
                    className="absolute bottom-0 left-0 h-[3px]"
                    style={{ backgroundColor: "var(--accent)" }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: cycleSec, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

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
