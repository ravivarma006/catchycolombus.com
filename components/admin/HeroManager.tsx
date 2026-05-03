"use client";

import { useState, useTransition } from "react";
import {
  createHeroSlide,
  updateHeroSlide,
  toggleHeroSlideActive,
  deleteHeroSlide,
  reorderHeroSlides,
  createHeroStat,
  updateHeroStat,
  toggleHeroStatActive,
  deleteHeroStat,
  setHeroMode,
  saveHeroVideo,
} from "@/app/admin/hero/actions";
import ImageUpload from "@/components/admin/ImageUpload";
import VideoUpload from "@/components/admin/VideoUpload";
import Image from "next/image";
import AdminSlidePanel from "@/components/admin/AdminSlidePanel";

interface HeroSlide {
  id: string;
  image_url: string;
  thumb_url: string;
  location: string;
  tag: string;
  headline: string[];
  subtitle: string;
  overlay_from: string;
  overlay_to: string;
  is_active: boolean;
  display_order: number;
}

interface HeroStat {
  id: string;
  value: string;
  label: string;
  display_order: number;
  is_active: boolean;
}

interface HeroSettings {
  hero_mode: "slides" | "video";
  video_url: string;
  video_thumb_url: string;
}

const INPUT_CLS =
  "w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent";

export default function HeroManager({
  slides,
  stats,
  heroSettings,
}: {
  slides: HeroSlide[];
  stats: HeroStat[];
  heroSettings: HeroSettings;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"slides" | "stats" | "video">("slides");

  // Video settings state
  const [currentMode, setCurrentMode] = useState<"slides" | "video">(heroSettings.hero_mode);
  const [videoUrl, setVideoUrl] = useState(heroSettings.video_url);
  const [videoThumbUrl, setVideoThumbUrl] = useState(heroSettings.video_thumb_url);
  const [videoSaved, setVideoSaved] = useState(false);

  // Slide form state
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editThumbUrl, setEditThumbUrl] = useState("");
  const [headlineLines, setHeadlineLines] = useState<string[]>([""]);
  const [editHeadlineLines, setEditHeadlineLines] = useState<string[]>([""]);

  // Stat form state
  const [showStatForm, setShowStatForm] = useState(false);
  const [editingStat, setEditingStat] = useState<HeroStat | null>(null);

  /* ── Slide Handlers ── */
  function handleCreateSlide(formData: FormData) {
    setError(null);
    formData.set("headline", JSON.stringify(headlineLines.filter((l) => l.trim())));
    startTransition(async () => {
      const result = await createHeroSlide(formData);
      if (result.error) setError(result.error);
      else {
        setShowSlideForm(false);
        setImageUrl("");
        setThumbUrl("");
        setHeadlineLines([""]);
      }
    });
  }

  function handleUpdateSlide(formData: FormData) {
    if (!editingSlide) return;
    setError(null);
    formData.set("headline", JSON.stringify(editHeadlineLines.filter((l) => l.trim())));
    startTransition(async () => {
      const result = await updateHeroSlide(editingSlide.id, formData);
      if (result.error) setError(result.error);
      else {
        setEditingSlide(null);
        setEditImageUrl("");
        setEditThumbUrl("");
        setEditHeadlineLines([""]);
      }
    });
  }

  function openEditSlide(slide: HeroSlide) {
    setEditingSlide(slide);
    setEditImageUrl(slide.image_url);
    setEditThumbUrl(slide.thumb_url);
    setEditHeadlineLines([...slide.headline]);
    setShowSlideForm(false);
    setError(null);
  }

  function handleToggleSlide(id: string, current: boolean) {
    startTransition(async () => { await toggleHeroSlideActive(id, current); });
  }

  function handleDeleteSlide(id: string) {
    if (!confirm("Delete this slide?")) return;
    startTransition(async () => { await deleteHeroSlide(id); });
  }

  function handleMoveSlide(index: number, direction: "up" | "down") {
    const ids = slides.map((s) => s.id);
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= ids.length) return;
    [ids[index], ids[swapIdx]] = [ids[swapIdx], ids[index]];
    startTransition(async () => { await reorderHeroSlides(ids); });
  }

  /* ── Stat Handlers ── */
  function handleCreateStat(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createHeroStat(formData);
      if (result.error) setError(result.error);
      else setShowStatForm(false);
    });
  }

  function handleUpdateStat(formData: FormData) {
    if (!editingStat) return;
    setError(null);
    startTransition(async () => {
      const result = await updateHeroStat(editingStat.id, formData);
      if (result.error) setError(result.error);
      else setEditingStat(null);
    });
  }

  function handleToggleStat(id: string, current: boolean) {
    startTransition(async () => { await toggleHeroStatActive(id, current); });
  }

  function handleDeleteStat(id: string) {
    if (!confirm("Delete this stat?")) return;
    startTransition(async () => { await deleteHeroStat(id); });
  }

  /* ── Video / Mode Handlers ── */
  function handleSetMode(mode: "slides" | "video") {
    startTransition(async () => {
      const result = await setHeroMode(mode);
      if (result.error) setError(result.error);
      else setCurrentMode(mode);
    });
  }

  function handleSaveVideo() {
    if (!videoUrl) { setError("Please upload a video first."); return; }
    setError(null);
    setVideoSaved(false);
    startTransition(async () => {
      const result = await saveHeroVideo(videoUrl, videoThumbUrl);
      if (result.error) setError(result.error);
      else setVideoSaved(true);
    });
  }

  /* ── Headline line helpers ── */
  function updateLine(lines: string[], setLines: (l: string[]) => void, idx: number, val: string) {
    const next = [...lines];
    next[idx] = val;
    setLines(next);
  }
  function addLine(lines: string[], setLines: (l: string[]) => void) {
    setLines([...lines, ""]);
  }
  function removeLine(lines: string[], setLines: (l: string[]) => void, idx: number) {
    if (lines.length <= 1) return;
    setLines(lines.filter((_, i) => i !== idx));
  }

  /* ── Slide Form ── */
  function renderSlideForm(mode: "create" | "edit", slide?: HeroSlide) {
    const isEdit = mode === "edit" && slide;
    const imgUrl = isEdit ? editImageUrl : imageUrl;
    const setImgUrl = isEdit ? setEditImageUrl : setImageUrl;
    const thmUrl = isEdit ? editThumbUrl : thumbUrl;
    const setThmUrl = isEdit ? setEditThumbUrl : setThumbUrl;
    const lines = isEdit ? editHeadlineLines : headlineLines;
    const setLines = isEdit ? setEditHeadlineLines : setHeadlineLines;

    return (
      <form
        action={isEdit ? handleUpdateSlide : handleCreateSlide}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Main Image *</label>
            <ImageUpload bucket="city-images" folder="hero" onUpload={setImgUrl} currentUrl={imgUrl} />
            <input type="hidden" name="image_url" value={imgUrl} />
          </div>
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Thumbnail *</label>
            <ImageUpload bucket="city-images" folder="hero/thumbs" onUpload={setThmUrl} currentUrl={thmUrl} />
            <input type="hidden" name="thumb_url" value={thmUrl} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Location *</label>
            <input name="location" required defaultValue={slide?.location || ""} className={INPUT_CLS} placeholder="e.g. Downtown Columbus" />
          </div>
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Tag *</label>
            <input name="tag" required defaultValue={slide?.tag || ""} className={INPUT_CLS} placeholder="e.g. City Skyline" />
          </div>
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Headline Lines *</label>
          <p className="text-white/30 text-xs mb-2">Each line appears as a separate animated line. The last line is highlighted in accent color.</p>
          {lines.map((line, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={line}
                onChange={(e) => updateLine(lines, setLines, i, e.target.value)}
                className={INPUT_CLS}
                placeholder={`Line ${i + 1}`}
              />
              {lines.length > 1 && (
                <button type="button" onClick={() => removeLine(lines, setLines, i)} className="px-3 py-1 text-xs font-bold rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition shrink-0">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => addLine(lines, setLines)} className="text-xs font-bold text-accent hover:text-yellow-400 transition">
            + Add Line
          </button>
          <input type="hidden" name="headline" value={JSON.stringify(lines.filter((l) => l.trim()))} />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Subtitle *</label>
          <textarea name="subtitle" required rows={2} defaultValue={slide?.subtitle || ""} className={`${INPUT_CLS} resize-none`} placeholder="Subtitle text..." />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Overlay From</label>
            <div className="flex items-center gap-2">
              <input name="overlay_from" defaultValue={slide?.overlay_from || "rgba(0,20,50,0.48)"} className={INPUT_CLS} placeholder="rgba(0,20,50,0.48)" />
              <div className="w-8 h-8 rounded-lg border border-white/20 shrink-0" style={{ backgroundColor: isEdit ? (slide?.overlay_from || "rgba(0,20,50,0.48)") : "rgba(0,20,50,0.48)" }} />
            </div>
          </div>
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Overlay To</label>
            <div className="flex items-center gap-2">
              <input name="overlay_to" defaultValue={slide?.overlay_to || "rgba(0,20,50,0.50)"} className={INPUT_CLS} placeholder="rgba(0,20,50,0.50)" />
              <div className="w-8 h-8 rounded-lg border border-white/20 shrink-0" style={{ backgroundColor: isEdit ? (slide?.overlay_to || "rgba(0,20,50,0.50)") : "rgba(0,20,50,0.50)" }} />
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition disabled:opacity-50">
            {isPending ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Slide")}
          </button>
          <button type="button" onClick={() => isEdit ? setEditingSlide(null) : setShowSlideForm(false)} className="px-6 py-2.5 bg-white/10 text-white/60 font-bold rounded-xl text-sm hover:bg-white/20 transition">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  /* ── Stat Form ── */
  function renderStatForm(mode: "create" | "edit", stat?: HeroStat) {
    const isEdit = mode === "edit" && stat;

    return (
      <form
        action={isEdit ? handleUpdateStat : handleCreateStat}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Value *</label>
            <input name="value" required defaultValue={stat?.value || ""} className={INPUT_CLS} placeholder="e.g. 900K+" />
          </div>
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Label *</label>
            <input name="label" required defaultValue={stat?.label || ""} className={INPUT_CLS} placeholder="e.g. Residents" />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition disabled:opacity-50">
            {isPending ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Stat")}
          </button>
          <button type="button" onClick={() => isEdit ? setEditingStat(null) : setShowStatForm(false)} className="px-6 py-2.5 bg-white/10 text-white/60 font-bold rounded-xl text-sm hover:bg-white/20 transition">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["slides", "stats", "video"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(null); setVideoSaved(false); }}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition flex items-center gap-2 ${
              tab === t ? "bg-accent text-primary" : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {t === "slides" && `Slides (${slides.length})`}
            {t === "stats" && `Stats (${stats.length})`}
            {t === "video" && (
              <>
                🎬 Video Hero
                {currentMode === "video" && (
                  <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">LIVE</span>
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* ═══════════ SLIDES TAB ═══════════ */}
      {tab === "slides" && (
        <div>
          <button
            onClick={() => { setShowSlideForm(true); setError(null); setHeadlineLines([""]); }}
            className="mb-6 px-5 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition"
          >
            + New Slide
          </button>

          <AdminSlidePanel isOpen={showSlideForm && !editingSlide} onClose={() => setShowSlideForm(false)} title="New Slide">
            {renderSlideForm("create")}
          </AdminSlidePanel>
          <AdminSlidePanel isOpen={!!editingSlide} onClose={() => { setEditingSlide(null); setEditImageUrl(""); setEditThumbUrl(""); setEditHeadlineLines([""]); }} title="Edit Slide">
            {editingSlide && renderSlideForm("edit", editingSlide)}
          </AdminSlidePanel>

          {slides.length === 0 ? (
            <p className="text-white/30 text-sm">No hero slides yet.</p>
          ) : (
            <div className="space-y-4">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`bg-white/[0.05] border rounded-2xl p-5 transition ${
                    slide.is_active ? "border-white/10" : "border-white/5 opacity-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail preview */}
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0">
                      <Image src={slide.thumb_url} alt={slide.location} fill className="object-cover" sizes="80px" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                          #{idx + 1}
                        </span>
                        {!slide.is_active && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Inactive</span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white/40 px-2 py-0.5 rounded-full">{slide.tag}</span>
                      </div>
                      <h3 className="text-white font-bold text-lg truncate">{slide.headline.join(" ")}</h3>
                      <p className="text-white/40 text-sm truncate">{slide.location} — {slide.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      {/* Reorder */}
                      <button onClick={() => handleMoveSlide(idx, "up")} disabled={isPending || idx === 0} className="px-2 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:bg-white/20 transition disabled:opacity-30" title="Move up">
                        ↑
                      </button>
                      <button onClick={() => handleMoveSlide(idx, "down")} disabled={isPending || idx === slides.length - 1} className="px-2 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:bg-white/20 transition disabled:opacity-30" title="Move down">
                        ↓
                      </button>
                      <button onClick={() => openEditSlide(slide)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition disabled:opacity-50">
                        Edit
                      </button>
                      <button onClick={() => handleToggleSlide(slide.id, slide.is_active)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition disabled:opacity-50">
                        {slide.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => handleDeleteSlide(slide.id)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition disabled:opacity-50">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════ VIDEO TAB ═══════════ */}
      {tab === "video" && (
        <div className="space-y-8">

          {/* Mode toggle */}
          <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-base mb-1">Hero Display Mode</h2>
            <p className="text-white/40 text-sm mb-5">
              Choose whether the home page hero shows the image carousel or a background video.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleSetMode("slides")}
                disabled={isPending || currentMode === "slides"}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition ${
                  currentMode === "slides"
                    ? "bg-primary text-white border-2 border-accent"
                    : "bg-white/10 text-white/60 hover:bg-white/20 border-2 border-transparent"
                }`}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
                Image Slides
                {currentMode === "slides" && <span className="text-[10px] bg-accent/30 text-accent px-1.5 py-0.5 rounded-full">Active</span>}
              </button>
              <button
                onClick={() => handleSetMode("video")}
                disabled={isPending || currentMode === "video"}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition ${
                  currentMode === "video"
                    ? "bg-primary text-white border-2 border-accent"
                    : "bg-white/10 text-white/60 hover:bg-white/20 border-2 border-transparent"
                }`}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Background Video
                {currentMode === "video" && <span className="text-[10px] bg-accent/30 text-accent px-1.5 py-0.5 rounded-full">Active</span>}
              </button>
            </div>
            {isPending && <p className="text-white/40 text-xs mt-3">Saving...</p>}
          </div>

          {/* Video upload */}
          <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-base mb-1">Hero Video</h2>
            <p className="text-white/40 text-sm mb-5">
              Upload a full-bleed background video (MP4 recommended, max 50 MB). The video plays looped and muted. Visitors can pause/resume it.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Video File *</label>
                <VideoUpload onUpload={setVideoUrl} currentUrl={videoUrl} />
              </div>

              <div>
                <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Fallback Thumbnail (optional)</label>
                <p className="text-white/30 text-xs mb-2">Shown on mobile or while the video loads.</p>
                <ImageUpload bucket="city-images" folder="hero/video-thumb" onUpload={setVideoThumbUrl} currentUrl={videoThumbUrl} />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              {videoSaved && <p className="text-green-400 text-sm font-semibold">✓ Video saved successfully.</p>}

              <button
                type="button"
                onClick={handleSaveVideo}
                disabled={isPending || !videoUrl}
                className="px-6 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Save Video"}
              </button>
            </div>
          </div>

          {/* Current video preview */}
          {heroSettings.video_url && (
            <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-3">Current Saved Video</h2>
              <video
                src={heroSettings.video_url}
                className="w-full max-h-52 rounded-xl object-cover border border-white/10"
                controls
                muted
                playsInline
                preload="metadata"
              />
              <p className="text-white/30 text-xs mt-2 break-all">{heroSettings.video_url}</p>
            </div>
          )}
        </div>
      )}

      {/* ═══════════ STATS TAB ═══════════ */}
      {tab === "stats" && (
        <div>
          <button
            onClick={() => { setShowStatForm(true); setError(null); }}
            className="mb-6 px-5 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition"
          >
            + New Stat
          </button>

          <AdminSlidePanel isOpen={showStatForm && !editingStat} onClose={() => setShowStatForm(false)} title="New Stat">
            {renderStatForm("create")}
          </AdminSlidePanel>
          <AdminSlidePanel isOpen={!!editingStat} onClose={() => setEditingStat(null)} title="Edit Stat">
            {editingStat && renderStatForm("edit", editingStat)}
          </AdminSlidePanel>

          {stats.length === 0 ? (
            <p className="text-white/30 text-sm">No stats yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className={`bg-white/[0.05] border rounded-2xl p-4 flex items-center justify-between transition ${
                    stat.is_active ? "border-white/10" : "border-white/5 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-accent font-extrabold text-xl" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {stat.value}
                    </span>
                    <span className="text-white/60 text-sm">{stat.label}</span>
                    {!stat.is_active && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Inactive</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingStat(stat); setShowStatForm(false); setError(null); }} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition disabled:opacity-50">
                      Edit
                    </button>
                    <button onClick={() => handleToggleStat(stat.id, stat.is_active)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition disabled:opacity-50">
                      {stat.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => handleDeleteStat(stat.id)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition disabled:opacity-50">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
