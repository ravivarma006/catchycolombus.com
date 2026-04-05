"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitCouponRequest } from "./actions";
import Link from "next/link";
import { useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const initialState = { error: "" };

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 bg-accent hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-[#020C1B] font-black text-sm py-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-amber-500/20"
    >
      {pending ? "Submitting..." : "Submit Coupon for Review"}
    </button>
  );
}

export default function CouponSubmitForm({ categories }: { categories: Category[] }) {
  const [state, formAction] = useFormState(submitCouponRequest, initialState);
  const [imageUrl, setImageUrl] = useState("");

  return (
    <form action={formAction} className="space-y-5">
      <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-5">

        {/* Business / Product Name */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Business / Product Name <span className="text-red-400">*</span>
          </label>
          <input
            name="product_service_name"
            type="text"
            required
            placeholder="Short North Pizza Co."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Category
          </label>
          <select
            name="category_id"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all [color-scheme:dark]"
            defaultValue=""
          >
            <option value="" disabled className="bg-[#0D1B3E] text-white">Select a category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#0D1B3E] text-white">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Coupon Code */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Coupon Code
            <span className="ml-2 normal-case font-normal text-white/30">(leave blank if customers should just mention Catch Columbus)</span>
          </label>
          <input
            name="coupon_code"
            type="text"
            placeholder="CATCHCOLUMBUS20"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all uppercase"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Offer Description
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="20% off your first order. Valid Mon–Thu. Dine-in only. Not combinable with other offers."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all resize-none"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Business Address
          </label>
          <input
            name="address"
            type="text"
            placeholder="123 High St, Columbus, OH 43215"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Website
          </label>
          <input
            name="website"
            type="url"
            placeholder="https://yourbusiness.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Coupon Image Upload */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
            Coupon / Product Image
          </label>
          <ImageUpload
            bucket="coupon-images"
            folder="submissions"
            onUpload={(url) => setImageUrl(url)}
          />
          <input type="hidden" name="image_url" value={imageUrl} />
        </div>

        {/* Contact info divider */}
        <div className="border-t border-white/10 pt-5 space-y-4">
          <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Your Contact Info</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          href="/coupons"
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
