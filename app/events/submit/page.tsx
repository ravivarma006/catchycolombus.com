import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import EventSubmitForm from "./EventSubmitForm";

export const metadata: Metadata = {
  title: "Submit an Event — Catch Columbus",
  description: "Submit your Columbus event to be featured on Catch Columbus.",
};

export default async function EventSubmitPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/events/submit");

  // Admin-only — events are created by admins from the admin panel
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const success = searchParams.success === "1";

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)" }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/15 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-accent" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">Columbus, Ohio</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Submit an <span style={{ color: "var(--accent)" }}>Event</span>
          </h1>
          <p className="text-white/50 mt-3 text-base leading-relaxed">
            Fill out the form below to submit your event for review. Once approved, it will appear on the Catch Columbus events page.
          </p>
        </div>

        {success ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-black text-white mb-2">Request Submitted!</h2>
            <p className="text-white/60 mb-6">
              Your event has been submitted for review. We&apos;ll notify you once it&apos;s approved.
            </p>
            <a
              href="/events"
              className="inline-flex items-center gap-2 bg-accent text-[#020C1B] font-bold text-sm px-6 py-3 rounded-2xl hover:bg-yellow-400 transition-all"
            >
              Browse Events
            </a>
          </div>
        ) : (
          <EventSubmitForm />
        )}
      </div>
    </div>
  );
}
