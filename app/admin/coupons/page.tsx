import { createClient } from "@/lib/supabase/server";
import ReviewCard from "@/components/admin/ReviewCard";
import CouponsManager from "@/components/admin/CouponsManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Coupons Management" };

export default async function AdminCouponsPage() {
  const supabase = createClient();

  const [{ data: requestsData }, { data: categoriesData }, { data: couponsData }] = await Promise.all([
    supabase
      .from("coupon_requests")
      .select("id, product_service_name, category_id, email, phone, address, description, coupon_code, website, image_url, status, admin_notes, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("coupon_categories")
      .select("id, name, slug, icon, description, display_order, is_active")
      .order("display_order", { ascending: true }),
    supabase
      .from("coupons")
      .select("id, product_service_name, coupon_code, phone, email, address, description, website, image_url, is_active, category_id, category:coupon_categories(name)")
      .order("product_service_name", { ascending: true }),
  ]);

  const categories = (categoriesData ?? []) as Array<{
    id: string; name: string; slug: string; icon: string | null;
    description: string | null; display_order: number; is_active: boolean;
  }>;
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const requests = requestsData ?? [];
  const pending  = requests.filter((r) => r.status === "pending");
  const rest     = requests.filter((r) => r.status !== "pending");
  const coupons = (couponsData ?? []).map((c: Record<string, unknown>) => ({
    ...c,
    category: Array.isArray(c.category) ? (c.category[0] as { name: string } | undefined) ?? null : c.category ?? null,
  })) as Array<{
    id: string; product_service_name: string; coupon_code: string | null;
    phone: string | null; email: string | null; address: string | null;
    description: string | null; website: string | null; image_url: string | null;
    is_active: boolean; category_id: string | null; category: { name: string } | null;
  }>;

  return (
    <div className="px-8 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Coupons Management
        </h1>
        <p className="text-white/40 text-sm">
          {pending.length} pending requests · {coupons.length} coupons · {categories.length} categories
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
                type="coupon"
                title={req.product_service_name}
                status={req.status as "pending"}
                adminNotes={req.admin_notes}
                createdAt={req.created_at}
                submittedBy={req.email}
                details={[
                  { label: "Category",     value: req.category_id ? catMap[req.category_id] ?? req.category_id : null },
                  { label: "Coupon Code",  value: req.coupon_code },
                  { label: "Address",      value: req.address },
                  { label: "Phone",        value: req.phone },
                  { label: "Email",        value: req.email },
                  { label: "Website",      value: req.website },
                  { label: "Image URL",    value: req.image_url },
                  { label: "Description",  value: req.description },
                ]}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Coupons & Categories Manager ── */}
      <section className="mb-10">
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">
          Manage Coupons & Categories
        </p>
        <CouponsManager coupons={coupons} categories={categories} />
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
                type="coupon"
                title={req.product_service_name}
                status={req.status as "approved" | "rejected" | "needs_changes"}
                adminNotes={req.admin_notes}
                createdAt={req.created_at}
                submittedBy={req.email}
                details={[
                  { label: "Category",    value: req.category_id ? catMap[req.category_id] ?? req.category_id : null },
                  { label: "Coupon Code", value: req.coupon_code },
                  { label: "Address",     value: req.address },
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
