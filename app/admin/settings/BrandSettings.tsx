"use client";

import { useState, useTransition } from "react";
import { saveBrandColors } from "./actions";

interface BrandSettingsProps {
  primaryColor: string;
  accentColor: string;
}

// Preset palette options
const PRESETS = [
  { label: "Teal + Gold (Default)", primary: "#0F4C5C", accent: "#F5A800" },
  { label: "Navy + Gold",           primary: "#1B2A4A", accent: "#F5A800" },
  { label: "Forest + Amber",        primary: "#1A4731", accent: "#F59E0B" },
  { label: "Charcoal + Gold",       primary: "#1F2937", accent: "#F5A800" },
  { label: "Deep Purple + Amber",   primary: "#3B1F5E", accent: "#FBB040" },
  { label: "Crimson + Gold",        primary: "#7B1D1D", accent: "#F5A800" },
  { label: "Slate + Cyan",          primary: "#1E3A5F", accent: "#06B6D4" },
  { label: "Dark Olive + Lime",     primary: "#2D3A1E", accent: "#A3E635" },
];

function hexToRgbParts(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export default function BrandSettings({ primaryColor, accentColor }: BrandSettingsProps) {
  const [primary, setPrimary] = useState(primaryColor);
  const [accent,  setAccent]  = useState(accentColor);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function applyPreset(p: typeof PRESETS[0]) {
    setPrimary(p.primary);
    setAccent(p.accent);
    setSaved(false);
    setError(null);
    // Live preview on this page only
    document.documentElement.style.setProperty("--primary", p.primary);
    document.documentElement.style.setProperty("--primary-rgb", hexToRgbParts(p.primary));
    document.documentElement.style.setProperty("--accent", p.accent);
    document.documentElement.style.setProperty("--accent-rgb", hexToRgbParts(p.accent));
  }

  function handlePrimaryChange(hex: string) {
    setPrimary(hex);
    setSaved(false);
    document.documentElement.style.setProperty("--primary", hex);
    document.documentElement.style.setProperty("--primary-rgb", hexToRgbParts(hex));
  }

  function handleAccentChange(hex: string) {
    setAccent(hex);
    setSaved(false);
    document.documentElement.style.setProperty("--accent", hex);
    document.documentElement.style.setProperty("--accent-rgb", hexToRgbParts(hex));
  }

  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await saveBrandColors(primary, accent);
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  }

  function handleReset() {
    applyPreset(PRESETS[0]);
  }

  return (
    <div className="space-y-8 max-w-2xl">

      {/* Live preview banner */}
      <div
        className="rounded-2xl p-5 flex items-center justify-between gap-4"
        style={{ background: `linear-gradient(135deg, ${primary} 0%, color-mix(in srgb, ${primary} 70%, black) 100%)` }}
      >
        <div>
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Live Preview</p>
          <p className="text-white font-black text-xl" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Catch <span style={{ color: accent }}>Columbus</span>
          </p>
          <p className="text-white/50 text-sm mt-1">Your primary + accent colors applied live</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl border-2 border-white/20 mx-auto mb-1" style={{ backgroundColor: primary }} />
            <p className="text-white/50 text-[10px] uppercase tracking-widest">Primary</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl border-2 border-white/20 mx-auto mb-1" style={{ backgroundColor: accent }} />
            <p className="text-white/50 text-[10px] uppercase tracking-widest">Accent</p>
          </div>
        </div>
      </div>

      {/* Color pickers */}
      <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-6 space-y-6">
        <h2 className="text-white font-bold text-base">Custom Colors</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Primary */}
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-3">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={primary}
                  onChange={(e) => handlePrimaryChange(e.target.value)}
                  className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white/20 bg-transparent"
                  style={{ padding: "2px" }}
                />
              </div>
              <div>
                <p className="text-white font-mono text-sm font-semibold">{primary.toUpperCase()}</p>
                <p className="text-white/40 text-xs mt-0.5">Used for navbar, buttons, text</p>
              </div>
            </div>
          </div>

          {/* Accent */}
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-3">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => handleAccentChange(e.target.value)}
                  className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white/20 bg-transparent"
                  style={{ padding: "2px" }}
                />
              </div>
              <div>
                <p className="text-white font-mono text-sm font-semibold">{accent.toUpperCase()}</p>
                <p className="text-white/40 text-xs mt-0.5">Used for highlights, badges, links</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset palette */}
      <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-bold text-base mb-4">Preset Palettes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESETS.map((preset) => {
            const isActive = primary === preset.primary && accent === preset.accent;
            return (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border ${
                  isActive
                    ? "border-accent/60 bg-accent/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {/* Mini swatch pair */}
                <div className="flex shrink-0">
                  <div className="w-5 h-5 rounded-l-md" style={{ backgroundColor: preset.primary }} />
                  <div className="w-5 h-5 rounded-r-md" style={{ backgroundColor: preset.accent }} />
                </div>
                <span className={`text-sm font-semibold ${isActive ? "text-accent" : "text-white/70"}`}>
                  {preset.label}
                </span>
                {isActive && (
                  <span className="ml-auto text-[10px] font-bold text-accent bg-accent/20 px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-7 py-3 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save & Apply to Site"}
        </button>
        <button
          onClick={handleReset}
          disabled={isPending}
          className="px-5 py-3 bg-white/10 text-white/60 font-bold rounded-xl text-sm hover:bg-white/20 transition disabled:opacity-50"
        >
          Reset to Default
        </button>
        {saved && (
          <span className="text-green-400 text-sm font-semibold flex items-center gap-1.5">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Colors saved — site updated instantly
          </span>
        )}
        {error && <span className="text-red-400 text-sm">{error}</span>}
      </div>

      {/* Info note */}
      <p className="text-white/25 text-xs leading-relaxed">
        Colors are stored in the database and applied server-side on every page load — no refresh needed for visitors after saving.
      </p>
    </div>
  );
}
