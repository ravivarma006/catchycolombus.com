"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  bucket: string;
  folder: string;
  onUpload: (url: string) => void;
  currentUrl?: string;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUpload({
  bucket,
  folder,
  onUpload,
  currentUrl,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Only JPEG, PNG, and WebP images are allowed.");
        return;
      }
      if (file.size > MAX_SIZE) {
        setError("File must be under 5 MB.");
        return;
      }

      setUploading(true);
      try {
        const supabase = createClient();
        const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
        const storagePath = `${folder}/${Date.now()}-${sanitized}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(storagePath, file, { contentType: file.type, upsert: true });

        if (uploadError) {
          setError(uploadError.message);
          return;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
        setPreview(data.publicUrl);
        onUpload(data.publicUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [bucket, folder, onUpload],
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
      {/* Drop zone / picker */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 cursor-pointer transition-all
          ${dragOver ? "border-accent bg-accent/10" : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"}
          ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading ? (
          <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
            Uploading...
          </div>
        ) : (
          <>
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-white/40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 3.75 3.75 0 013.572 5.345A4.5 4.5 0 0118.75 19.5H6.75z" />
            </svg>
            <p className="text-white/50 text-sm text-center">
              <span className="text-accent font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-white/30 text-xs">PNG, JPG or WebP (max 5 MB)</p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-xs font-medium">{error}</p>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            sizes="400px"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-xs font-bold transition-colors"
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
