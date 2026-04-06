import { createClient } from "@/lib/supabase/server";
import ReviewCard from "@/components/admin/ReviewCard";
import ProvidersManager from "@/components/admin/ProvidersManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Services Management" };

export default async function AdminServicesPage() {
  const supabase = createClient();

  const [{ data: requestsData }, { data: categoriesData }, { data: providersData }] = await Promise.all([
    supabase
      .from("provider_requests")
      .select("id, business_name, business_type, category_id, email, phone, address, description, website, image_url, status, admin_notes, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("service_categories")
      .select("id, name, slug, icon, description, image_url, display_order, is_active")
      .order("display_order", { ascending: true }),
    supabase
      .from("service_providers")
      .select("id, name, slug, phone, email, address, description, website, image_url, is_active, category_id, category:service_categories(name)")
      .order("name", { ascending: true }),
  ]);

  const categories = (categoriesData ?? []) as Array<{
    id: string; name: string; slug: string; icon: string | null;
    description: string | null; image_url: string | null;
    display_order: number; is_active: boolean;
  }>;
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const requests = requestsData ?? [];
  const pending  = requests.filter((r) => r.status === "pending");
  const rest     = requests.filter((r) => r.status !== "pending");
  const providers = (providersData ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    category: Array.isArray(p.category) ? (p.category[0] as { name: string } | undefined) ?? null : p.category ?? null,
  })) as Array<{
    id: string; name: string; slug: string; phone: string | null;
    email: string | null; address: string | null; description: string | null;
    website: string | null; image_url: string | null; is_active: boolean;
    category_id: string | null; category: { name: string } | null;
  }>;

  return (
    <div className="px-4 py-6 md:px-8 md:py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Services Management
        </h1>
        <p className="text-white/40 text-sm">
          {pending.length} pending requests · {providers.length} providers · {categories.length} categories
        </p>
      </div>

      {/* ── Pending Requests ── */}
      {pending.length > 0 && (
        <section className="mb-10">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">
            Pending Requests ({pending.length})
          </p>
          <div className="space-y-3">
            {pending.map((req) => (
              <ReviewCard
                key={req.id}
                id={req.id}
                type="provider"
                title={req.business_name}
                status={req.status as "pending"}
                adminNotes={req.admin_notes}
                createdAt={req.created_at}
                submittedBy={req.email}
                details={[
                  { label: "Business Type", value: req.business_type },
                  { label: "Category",      value: req.category_id ? catMap[req.category_id] ?? req.category_id : null },
                  { label: "Address",       value: req.address },
                  { label: "Phone",         value: req.phone },
                  { label: "Email",         value: req.email },
                  { label: "Website",       value: req.website },
                  { label: "Image URL",     value: req.image_url },
                  { label: "Description",   value: req.description },
                ]}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Providers & Categories Manager ── */}
      <section className="mb-10">
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">
          Manage Providers & Categories
        </p>
        <ProvidersManager providers={providers} categories={categories} />
      </section>

      {/* ── Previously Reviewed Requests ── */}
      {rest.length > 0 && (
        <section>
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">
            Previously Reviewed ({rest.length})
          </p>
          <div className="space-y-3">
            {rest.map((req) => (
              <ReviewCard
                key={req.id}
                id={req.id}
                type="provider"
                title={req.business_name}
                status={req.status as "approved" | "rejected" | "needs_changes"}
                adminNotes={req.admin_notes}
                createdAt={req.created_at}
                submittedBy={req.email}
                details={[
                  { label: "Category",    value: req.category_id ? catMap[req.category_id] ?? req.category_id : null },
                  { label: "Address",     value: req.address },
                  { label: "Phone",       value: req.phone },
                  { label: "Email",       value: req.email },
                  { label: "Website",     value: req.website },
                  { label: "Description", value: req.description },
                ]}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
