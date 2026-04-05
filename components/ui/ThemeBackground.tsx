"use client";

import { useEffect, useState } from "react";

type ThemeVariant = "default" | "emerald" | "sunset";

// You can change this single string to globally switch your website's aesthetic!
const ACTIVE_THEME: ThemeVariant = "default";

export default function ThemeBackground() {
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // 1. DEFAULT (Navy & Indigo - Trustworthy, Deep)
  if (ACTIVE_THEME === "default") {
    return (
      <div 
        className="fixed inset-0 -z-50 overflow-hidden pointer-events-none w-full h-full"
        style={{ background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)" }}
      >
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute top-[40%] left-[35%] w-[40%] h-[40%] rounded-full bg-violet-600/15 blur-[110px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/15 blur-[130px]" />
      </div>
    );
  }

  // 2. EMERALD (Obsidian Green & Teal - Luxurious, Premium, Secure)
  if (ACTIVE_THEME === "emerald") {
    return (
      <div 
        className="fixed inset-0 -z-50 overflow-hidden pointer-events-none w-full h-full"
        style={{ background: "linear-gradient(135deg, #041514 0%, #0A2E2C 50%, #020F12 100%)" }}
      >
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-emerald-500/15 blur-[130px]" />
        <div className="absolute top-[40%] left-[35%] w-[40%] h-[40%] rounded-full bg-teal-600/15 blur-[110px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/15 blur-[130px]" />
      </div>
    );
  }

  // 3. SUNSET (Burgundy & Pitch Plum - Exclusive, High-End Nightlife)
  if (ACTIVE_THEME === "sunset") {
    return (
      <div 
        className="fixed inset-0 -z-50 overflow-hidden pointer-events-none w-full h-full"
        style={{ background: "linear-gradient(135deg, #1C0D11 0%, #2A0A18 50%, #0F050B 100%)" }}
      >
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-rose-500/10 blur-[130px]" />
        <div className="absolute top-[40%] left-[35%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[110px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/20 blur-[130px]" />
      </div>
    );
  }

  return null;
}
