"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitEventRequest } from "./actions";
import Link from "next/link";
import { useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

const initialState = { error: "" };

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 bg-accent hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-[#020C1B] font-black text-sm py-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-amber-500/20"
    >
      {pending ? "Submitting..." : "Submit Event for Review"}
    </button>
  );
}

export default function EventSubmitForm() {
  const [state, formAction] = useFormState(submitEventRequest, initialState);
  const [imageUrl, setImageUrl] = useState("");

  return (
    <form action={formAction} className="space-y-5">
      <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-5">

        {/* Event Name */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Event Name <span className="text-red-400">*</span>
          </label>
          <input
            name="event_name"
            type="text"
            required
            placeholder="Columbus Food Truck Festival"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
              Event Date
            </label>
            <input
              name="event_date"
              type="date"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
              Event Time
            </label>
            <input
              name="event_time"
              type="time"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Location / Venue
          </label>
          <input
            name="address"
            type="text"
            placeholder="123 Main St, Columbus, OH"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Price
          </label>
          <input
            name="price"
            type="text"
            placeholder="Free · $10 · $5–$20"
            defaultValue="Free"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Tell us about the event — what to expect, who it's for, what's included..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all resize-none"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Website / Tickets URL
          </label>
          <input
            name="website"
            type="url"
            placeholder="https://your-event-site.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Event Image Upload */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Event Image
          </label>
          <ImageUpload
            bucket="event-images"
            folder="submissions"
            onUpload={(url) => setImageUrl(url)}
          />
          <input type="hidden" name="image_url" value={imageUrl} />
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-5 space-y-4">
          <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Your Contact Info</p>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
              Phone
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="(614) 555-0100"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-400 text-sm font-medium">
          {state.error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <SubmitBtn />
        <Link
          href="/events"
          className="px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-semibold transition-all"
        >
          Cancel
        </Link>
      </div>

      <p className="text-xs text-white/30 text-center">
        Submissions are reviewed within 1–2 business days. You&apos;ll be notified of the decision.
      </p>
    </form>
  );
}
