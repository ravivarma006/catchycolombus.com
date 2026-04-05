"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScarcityBadgeProps {
  maxRedemptions?: number | null;
  currentRedemptions: number;
}

export default function ScarcityBadge({ maxRedemptions, currentRedemptions }: ScarcityBadgeProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!maxRedemptions || maxRedemptions <= 0) return null;

  const remaining = maxRedemptions - currentRedemptions;
  const percentageLeft = (remaining / maxRedemptions) * 100;
  
  // Only show high urgency if less than 20% left OR less than 10 total remaining
  const isHighUrgency = remaining > 0 && (percentageLeft <= 20 || remaining <= 10);

  if (!mounted) return null;

  if (remaining <= 0) {
    return (
      <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-red-600/90 backdrop-blur-sm text-white shadow-xl shadow-red-900/50 ring-1 ring-white/20">
        Sold Out
      </span>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-3 right-3 z-10"
      >
        {isHighUrgency ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/90 backdrop-blur-md rounded-full shadow-lg shadow-red-500/20 ring-1 ring-red-400/50">
             {/* Pulsing dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              Only {remaining} left!
            </span>
          </div>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/10">
            {remaining} left
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
