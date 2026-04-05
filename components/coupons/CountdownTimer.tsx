"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  expiresAt: string | null; // ISO string
}

export default function CountdownTimer({ expiresAt }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!expiresAt) return;

    const targetDate = new Date(expiresAt).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      setTimeLeft({
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // Don't render if SSR, no expiry, or already expired
  if (!mounted || !expiresAt || !timeLeft) return null;
  if (timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mt-3 pt-3 border-t border-white/5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Offer Expired
      </div>
    );
  }

  // Format with leading zeros
  const pad = (num: number) => num.toString().padStart(2, '0');

  // If less than 24 hours left, show it in red to create urgency
  const isEndingSoon = timeLeft.d === 0;

  return (
    <div className={`flex items-center gap-1.5 text-xs font-bold mt-3 pt-3 border-t border-white/5 ${isEndingSoon ? 'text-red-400' : 'text-white/60'}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      {timeLeft.d > 0 ? (
        <span>Expires in {timeLeft.d}d {pad(timeLeft.h)}h {pad(timeLeft.m)}m</span>
      ) : (
        <span className="flex items-center">
          Ends in {pad(timeLeft.h)}:{pad(timeLeft.m)}:
          <motion.span 
            key={timeLeft.s}
            initial={{ opacity: 0.5, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block w-4 text-center ml-0.5"
          >
            {pad(timeLeft.s)}
          </motion.span>
        </span>
      )}
    </div>
  );
}
