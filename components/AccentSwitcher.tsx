"use client";

import { useState, useEffect } from "react";

const OPTIONS = [
  { id: "gold",     label: "Gold",          hex: "#F5A800", desc: "Current"  },
  { id: "lime",     label: "Lime",          hex: "#A8E63D", desc: "Option 3" },
  { id: "sky",      label: "Sky Blue",      hex: "#38BDF8", desc: "Option 5" },
  { id: "mint",     label: "Mint",          hex: "#34D399", desc: "Option 6" },
  { id: "rose",     label: "Rose",          hex: "#FB7185", desc: "Option 7" },
  { id: "saffron",  label: "Light Orange",  hex: "#FF8C00", desc: "Option 8" },
];

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

function applyAccent(hex: string) {
  document.documentElement.style.setProperty("--accent", hex);
  document.documentElement.style.setProperty("--accent-rgb", hexToRgb(hex));
}

export default function AccentSwitcher() {
  const [active, setActive] = useState("gold");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("accent-preview");
    if (stored) {
      const found = OPTIONS.find((o) => o.id === stored);
      if (found) { setActive(found.id); applyAccent(found.hex); }
    }
  }, []);

  const select = (opt: (typeof OPTIONS)[0]) => {
    setActive(opt.id);
    applyAccent(opt.hex);
    localStorage.setItem("accent-preview", opt.id);
  };

  const current = OPTIONS.find((o) => o.id === active)!;

  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-[9999] flex-col items-end gap-2">

      {open && (
        <div
          className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{ background: "linear-gradient(135deg, #0D1B3E, #1A1040)", minWidth: 230 }}
        >
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-[11px] font-bold tracking-widest uppercase text-white/40">Accent Preview</p>
            <p className="text-xs text-white/50 mt-0.5">Updates entire site instantly</p>
          </div>

          <div className="p-3 flex flex-col gap-2">
            {OPTIONS.map((opt) => {
              const isActive = opt.id === active;
              return (
                <button
                  key={opt.id}
                  onClick={() => select(opt)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left"
                  style={{
                    background: isActive ? `${opt.hex}22` : "rgba(255,255,255,0.04)",
                    border: isActive ? `1.5px solid ${opt.hex}88` : "1.5px solid transparent",
                  }}
                >
                  <span className="w-7 h-7 rounded-lg shrink-0 shadow-md" style={{ background: opt.hex }} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white leading-none">{opt.label}</p>
                    <p className="text-[11px] text-white/40 mt-0.5">{opt.hex} · {opt.desc}</p>
                  </div>
                  {isActive && (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={opt.hex} strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t border-white/10">
            <p className="text-[10px] text-white/30">Tell Claude which to make permanent.</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg, #0D1B3E, #1A1040)", border: "1.5px solid rgba(255,255,255,0.15)" }}
      >
        <span className="w-4 h-4 rounded-full shadow-md transition-colors duration-300" style={{ background: current.hex }} />
        <span className="text-xs font-bold text-white/80">{open ? "Close" : "Preview Colors"}</span>
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.5)" strokeWidth={2.5}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
