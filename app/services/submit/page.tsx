import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import ProviderSubmitForm, { type ExistingRequest } from "./ProviderSubmitForm";

export const metadata: Metadata = {
  title: "List Your Business — Catch Columbus",
  description: "Submit your Columbus business to be listed in the Catch Columbus services directory.",
};

export default async function ProviderSubmitPage({
  searchParams,
}: {
  searchParams: { success?: string; edit?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/services/submit");

  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name, slug, icon")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const success = searchParams.success === "1";

  // If editing, load the existing request (must be owned by user and editable)
  let existing: ExistingRequest | undefined;
  let adminNote: string | null = null;
  const editId = searchParams.edit?.trim();
  if (editId) {
    const { data: row } = await supabase
      .from("provider_requests")
      .select("id, business_name, business_type, category_id, description, address, neighborhood, hours, image_url, email, phone, website, social_links, status, admin_notes, user_id")
      .eq("id", editId)
      .single();

    if (!row || row.user_id !== user.id) {
      redirect("/dashboard/submissions");
    }
    if (!["pending", "needs_changes"].includes(row.status)) {
      redirect("/dashboard/submissions");
    }
    existing = {
      id: row.id,
      business_name: row.business_name,
      business_type: row.business_type,
      category_id: row.category_id,
      description: row.description,
      address: row.address,
      neighborhood: row.neighborhood,
      hours: row.hours,
      image_url: row.image_url,
      email: row.email,
      phone: row.phone,
      website: row.website,
      social_links: row.social_links as ExistingRequest["social_links"],
    };
    adminNote = row.status === "needs_changes" ? row.admin_notes : null;
  }

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
            {existing ? (
              <>Edit Your <span style={{ color: "var(--accent)" }}>Listing</span></>
            ) : (
              <>List Your <span style={{ color: "var(--accent)" }}>Business</span></>
            )}
          </h1>
          <p className="text-white/50 mt-3 text-base leading-relaxed">
            {existing
              ? "Update your business details below. Saving will put this listing back in review."
              : "Submit your business for review. Once approved, it will appear in the Catch Columbus services directory."}
          </p>
        </div>

        {success ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-8 text-center">
            <div className="text-5xl mb-4">🏢</div>
            <h2 className="text-2xl font-black text-white mb-2">Listing Submitted!</h2>
            <p className="text-white/60 mb-6">
              Your business has been submitted for review. We&apos;ll notify you once it&apos;s approved.
            </p>
            <a
              href="/services"
              className="inline-flex items-center gap-2 bg-accent text-[#020C1B] font-bold text-sm px-6 py-3 rounded-2xl hover:bg-yellow-400 transition-all"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <ProviderSubmitForm
            categories={(categories ?? []) as { id: string; name: string; slug: string; icon: string | null }[]}
            existing={existing}
            adminNote={adminNote}
          />
        )}
      </div>
    </div>
  );
}
