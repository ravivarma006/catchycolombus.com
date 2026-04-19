"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitProviderRequest } from "./actions";
import Link from "next/link";
import { useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface ExistingRequest {
  id: string;
  business_name: string | null;
  business_type: string | null;
  category_id: string | null;
  description: string | null;
  address: string | null;
  neighborhood: string | null;
  hours: string | null;
  image_url: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  social_links: { facebook?: string; instagram?: string; twitter?: string } | null;
}

const initialState = { error: "" };

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all";

const labelClass = "block text-xs font-bold text-white/50 uppercase tracking-widest mb-2";

function SubmitBtn({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 bg-accent hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-[#020C1B] font-black text-sm py-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-amber-500/20"
    >
      {pending
        ? (editing ? "Saving…" : "Submitting…")
        : (editing ? "Save Changes & Resubmit" : "Submit Business for Review")}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-5">
      <p className="text-xs text-white/30 uppercase tracking-widest font-bold border-b border-white/10 pb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

export default function ProviderSubmitForm({
  categories,
  existing,
  adminNote,
}: {
  categories: Category[];
  existing?: ExistingRequest;
  adminNote?: string | null;
}) {
  const [state, formAction] = useFormState(submitProviderRequest, initialState);
  const [imageUrl, setImageUrl] = useState(existing?.image_url ?? "");
  const editing = Boolean(existing);
  const social = existing?.social_links ?? {};

  return (
    <form action={formAction} className="space-y-5">

      {/* Hidden id for edit mode */}
      {editing && <input type="hidden" name="id" value={existing!.id} />}

      {/* Admin feedback banner (if editing after needs_changes) */}
      {editing && adminNote && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80 mb-1">
            Admin Feedback
          </p>
          <p className="text-amber-200 text-sm leading-relaxed">{adminNote}</p>
          <p className="text-amber-300/60 text-xs mt-2">
            Update the fields below and click <strong>Save Changes &amp; Resubmit</strong> — your listing will be re-queued for review.
          </p>
        </div>
      )}

      {/* ── Basic Info ── */}
      <Section title="Business Information">
        {/* Business Name */}
        <div>
          <label className={labelClass}>
            Business Name <span className="text-red-400">*</span>
          </label>
          <input
            name="business_name"
            type="text"
            required
            defaultValue={existing?.business_name ?? ""}
            placeholder="Short North Plumbing Co."
            className={inputClass}
          />
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>Category</label>
          <select
            name="category_id"
            className={`${inputClass} [color-scheme:dark]`}
            defaultValue={existing?.category_id ?? ""}
          >
            <option value="" disabled className="bg-[#0D1B3E] text-white">
              Select a category…
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#0D1B3E] text-white">
                {cat.icon ? `${cat.icon} ` : ""}{cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Business Type */}
        <div>
          <label className={labelClass}>Business Type / Specialty</label>
          <input
            name="business_type"
            type="text"
            defaultValue={existing?.business_type ?? ""}
            placeholder="e.g. Residential Plumber, Family Restaurant"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={existing?.description ?? ""}
            placeholder="Tell us about your business — services offered, years in operation, what makes you stand out…"
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Business Address</label>
            <input
              name="address"
              type="text"
              defaultValue={existing?.address ?? ""}
              placeholder="123 Main St, Columbus, OH 43215"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Neighborhood / Area</label>
            <input
              name="neighborhood"
              type="text"
              defaultValue={existing?.neighborhood ?? ""}
              placeholder="e.g. Short North, German Village"
              className={inputClass}
            />
          </div>
        </div>

        {/* Hours */}
        <div>
          <label className={labelClass}>Hours of Operation</label>
          <input
            name="hours"
            type="text"
            defaultValue={existing?.hours ?? ""}
            placeholder="e.g. Mon–Fri 9am–6pm, Sat 10am–4pm, Closed Sun"
            className={inputClass}
          />
        </div>

        {/* Logo / Image */}
        <div>
          <label className={labelClass}>Logo / Business Photo</label>
          {imageUrl && (
            <div className="mb-3 relative rounded-xl overflow-hidden border border-white/10 max-w-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Current logo" className="w-full h-40 object-cover" />
              <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/60 text-white/80 px-2 py-1 rounded-md backdrop-blur-sm">
                Current image
              </span>
            </div>
          )}
          <ImageUpload
            bucket="provider-images"
            folder="submissions"
            onUpload={(url) => setImageUrl(url)}
          />
          <input type="hidden" name="image_url" value={imageUrl} />
          <p className="text-white/25 text-xs mt-2">
            {editing
              ? "Upload a new image to replace the current one, or leave as is."
              : "Upload a logo or a clear photo of your business. Max 5 MB (JPG, PNG, WebP)."}
          </p>
        </div>
      </Section>

      {/* ── Contact Info ── */}
      <Section title="Contact Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Email <span className="text-red-400">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              defaultValue={existing?.email ?? ""}
              placeholder="owner@yourbusiness.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              name="phone"
              type="tel"
              defaultValue={existing?.phone ?? ""}
              placeholder="(614) 555-0100"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Website</label>
          <input
            name="website"
            type="url"
            defaultValue={existing?.website ?? ""}
            placeholder="https://yourbusiness.com"
            className={inputClass}
          />
        </div>
      </Section>

      {/* ── Social Media ── */}
      <Section title="Social Media (optional)">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>
              <span className="mr-1">📘</span> Facebook
            </label>
            <input
              name="facebook"
              type="url"
              defaultValue={social.facebook ?? ""}
              placeholder="https://facebook.com/yourbiz"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              <span className="mr-1">📸</span> Instagram
            </label>
            <input
              name="instagram"
              type="url"
              defaultValue={social.instagram ?? ""}
              placeholder="https://instagram.com/yourbiz"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              <span className="mr-1">🐦</span> Twitter / X
            </label>
            <input
              name="twitter"
              type="url"
              defaultValue={social.twitter ?? ""}
              placeholder="https://twitter.com/yourbiz"
              className={inputClass}
            />
          </div>
        </div>
      </Section>

      {/* Error */}
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 text-sm font-medium">
          {state.error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <SubmitBtn editing={editing} />
        <Link
          href={editing ? "/dashboard/submissions" : "/services"}
          className="px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-semibold transition-all"
        >
          Cancel
        </Link>
      </div>

      <p className="text-xs text-white/30 text-center">
        {editing
          ? "Your changes will put this listing back in review. Admin will notify you once it's approved."
          : "Submissions are reviewed within 1–2 business days. You'll see the status update in your dashboard."}
      </p>
    </form>
  );
}
