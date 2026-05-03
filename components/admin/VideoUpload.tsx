"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface VideoUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

const MAX_SIZE = 52428800; // 50 MB
const ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/ogg"];

export default function VideoUpload({ onUpload, currentUrl }: VideoUploadProps) {
  const [preview, setPreview] = useState<string>(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Only MP4, WebM, or OGG videos are allowed.");
        return;
      }
      if (file.size > MAX_SIZE) {
        setError("File must be under 50 MB.");
        return;
      }

      setUploading(true);
      setProgress(10);

      try {
        const supabase = createClient();
        const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
        const storagePath = `hero/${Date.now()}-${sanitized}`;

        setProgress(30);

        const { error: uploadError } = await supabase.storage
          .from("hero-videos")
          .upload(storagePath, file, { contentType: file.type, upsert: true });

        if (uploadError) {
          setError(uploadError.message);
          return;
        }

        setProgress(90);
        const { data } = supabase.storage.from("hero-videos").getPublicUrl(storagePath);
        setPreview(data.publicUrl);
        onUpload(data.publicUrl);
        setProgress(100);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 800);
      }
    },
    [onUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleRemove = () => {
    setPreview("");
    setError(null);
    onUpload("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 cursor-pointer transition-all
          ${dragOver ? "border-accent bg-accent/10" : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"}
          ${uploading ? "pointer-events-none" : ""}`}
      >
        {uploading ? (
          <div className="w-full space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-sm font-medium justify-center">
              <svg className="animate-spin h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
              Uploading video...
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div
                className="bg-accent h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-white/40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className="text-white/50 text-sm text-center">
              <span className="text-accent font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-white/30 text-xs">MP4, WebM or OGG · max 50 MB</p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {error && <p className="text-red-400 text-xs font-medium">{error}</p>}

      {preview && !uploading && (
        <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-black">
          <video
            src={preview}
            className="w-full max-h-40 object-cover"
            muted
            playsInline
            preload="metadata"
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleRemove(); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-xs font-bold transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
