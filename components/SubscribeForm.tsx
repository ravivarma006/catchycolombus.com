"use client";

import { useState, useTransition } from "react";
import { subscribe } from "@/app/subscribe/actions";

export default function SubscribeForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await subscribe(formData);
      if (result.success) {
        setMessage({ type: "success", text: "You're subscribed! Thanks for joining." });
      } else {
        setMessage({ type: "error", text: result.error ?? "Something went wrong." });
      }
    });
  }

  return (
    <section className="py-14 bg-primary">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-2">
          Newsletter
        </p>
        <h2
          className="text-2xl md:text-3xl font-black text-white mb-2"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Stay in the Loop
        </h2>
        <p className="text-white/60 mb-6 max-w-md mx-auto">
          Get the latest Columbus events, deals, and announcements delivered to your inbox.
        </p>

        <form action={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-6 py-3 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {isPending ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm font-medium ${
              message.type === "success" ? "text-green-300" : "text-red-300"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </section>
  );
}
