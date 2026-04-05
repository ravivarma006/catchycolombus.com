"use client";

import { useState, useTransition } from "react";
import {
  createCouponCategory,
  updateCouponCategory,
  toggleCouponCategoryActive,
  deleteCouponCategory,
  updateCoupon,
  toggleCouponActive,
  deleteCoupon,
} from "@/app/admin/actions";
import ImageUpload from "@/components/admin/ImageUpload";

interface CouponCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

interface ApprovedCoupon {
  id: string;
  product_service_name: string;
  coupon_code: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  description: string | null;
  website: string | null;
  image_url: string | null;
  is_active: boolean;
  category_id: string | null;
  category: { name: string } | null;
  is_premium: boolean;
  expires_at: string | null;
  max_redemptions: number | null;
  current_redemptions: number;
}

const INPUT_CLS = "w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent";

export default function CouponsManager({
  coupons,
  categories,
}: {
  coupons: ApprovedCoupon[];
  categories: CouponCategory[];
}) {
  const [tab, setTab] = useState<"categories" | "coupons">("categories");
  const [showCatForm, setShowCatForm] = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editingCat, setEditingCat] = useState<CouponCategory | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<ApprovedCoupon | null>(null);
  const [editCouponImageUrl, setEditCouponImageUrl] = useState("");

  // ── Category handlers ──
  function handleCreateCategory(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createCouponCategory(formData);
      if (result.error) setError(result.error);
      else setShowCatForm(false);
    });
  }

  function handleUpdateCategory(formData: FormData) {
    if (!editingCat) return;
    setError(null);
    startTransition(async () => {
      const result = await updateCouponCategory(editingCat.id, formData);
      if (result.error) setError(result.error);
      else setEditingCat(null);
    });
  }

  function openEditCat(cat: CouponCategory) {
    setEditingCat(cat);
    setShowCatForm(false);
    setError(null);
  }

  function handleToggleCat(id: string, current: boolean) {
    startTransition(async () => { await toggleCouponCategoryActive(id, current); });
  }

  function handleDeleteCat(id: string) {
    if (!confirm("Delete this category? Coupons in it will become uncategorized.")) return;
    startTransition(async () => { await deleteCouponCategory(id); });
  }

  // ── Coupon handlers ──
  function handleUpdateCoupon(formData: FormData) {
    if (!editingCoupon) return;
    setError(null);
    startTransition(async () => {
      const result = await updateCoupon(editingCoupon.id, formData);
      if (result.error) setError(result.error);
      else { setEditingCoupon(null); setEditCouponImageUrl(""); }
    });
  }

  function openEditCoupon(coupon: ApprovedCoupon) {
    setEditingCoupon(coupon);
    setEditCouponImageUrl(coupon.image_url || "");
    setError(null);
  }

  function handleToggleCouponActive(id: string, current: boolean) {
    startTransition(async () => { await toggleCouponActive(id, current); });
  }

  function handleDeleteCoupon(id: string) {
    if (!confirm("Delete this coupon?")) return;
    startTransition(async () => { await deleteCoupon(id); });
  }

  const filteredCoupons = catFilter === "all"
    ? coupons
    : coupons.filter((c) => c.category_id === catFilter);

  // ── Category form ──
  function renderCategoryForm(mode: "create" | "edit", cat?: CouponCategory) {
    const isEdit = mode === "edit" && cat;

    return (
      <form
        action={isEdit ? handleUpdateCategory : handleCreateCategory}
        className="bg-white/[0.05] border border-white/10 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Name *</label>
          <input name="name" required defaultValue={cat?.name || ""} className={INPUT_CLS} placeholder="e.g. Food" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Icon (emoji)</label>
          <input name="icon" defaultValue={cat?.icon || ""} className={INPUT_CLS} placeholder="🍔" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Display Order</label>
          <input name="display_order" type="number" defaultValue={cat?.display_order ?? 0} className={INPUT_CLS} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Description</label>
          <input name="description" defaultValue={cat?.description || ""} className={INPUT_CLS} placeholder="Short description" />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition disabled:opacity-50">
            {isPending ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Category")}
          </button>
          <button type="button" onClick={() => isEdit ? setEditingCat(null) : setShowCatForm(false)} className="px-6 py-2.5 bg-white/10 text-white/60 font-bold rounded-xl text-sm hover:bg-white/20 transition">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  // ── Coupon edit form ──
  function renderCouponForm(coupon: ApprovedCoupon) {
    return (
      <form
        action={handleUpdateCoupon}
        className="bg-white/[0.05] border border-white/10 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Product / Service Name *</label>
          <input name="product_service_name" required defaultValue={coupon.product_service_name} className={INPUT_CLS} placeholder="Product or service name" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Category</label>
          <select name="category_id" defaultValue={coupon.category_id || ""} className={INPUT_CLS}>
            <option value="" className="bg-[#0D1B3E] text-white">-- Select --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#0D1B3E] text-white">{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Coupon Code</label>
          <input name="coupon_code" defaultValue={coupon.coupon_code || ""} className={INPUT_CLS} placeholder="e.g. SAVE20" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Phone</label>
          <input name="phone" defaultValue={coupon.phone || ""} className={INPUT_CLS} placeholder="(614) 555-0000" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Email</label>
          <input name="email" type="email" defaultValue={coupon.email || ""} className={INPUT_CLS} placeholder="info@example.com" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Address</label>
          <input name="address" defaultValue={coupon.address || ""} className={INPUT_CLS} placeholder="Full address" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Description</label>
          <textarea name="description" rows={3} defaultValue={coupon.description || ""} className={`${INPUT_CLS} resize-none`} placeholder="Describe the coupon offer..." />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Website</label>
          <input name="website" type="url" defaultValue={coupon.website || ""} className={INPUT_CLS} placeholder="https://..." />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input type="hidden" name="is_premium" value="false" />
          <input type="checkbox" name="is_premium" value="true" defaultChecked={coupon.is_premium} id={`premium-${coupon.id}`} className="w-5 h-5 accent-yellow-400 bg-white/10" />
          <label htmlFor={`premium-${coupon.id}`} className="text-sm font-bold text-yellow-400 uppercase tracking-widest">
            Premium Deal (Paid Members Only)
          </label>
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Expiration Date</label>
          <input name="expires_at" type="date" defaultValue={coupon.expires_at || ""} className={INPUT_CLS} />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Max Redemptions</label>
          <input name="max_redemptions" type="number" min="1" defaultValue={coupon.max_redemptions || ""} className={INPUT_CLS} placeholder="Leave blank for unlimited" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Image</label>
          <ImageUpload bucket="coupon-images" folder="coupons" onUpload={setEditCouponImageUrl} currentUrl={editCouponImageUrl} />
          <input type="hidden" name="image_url" value={editCouponImageUrl} />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition disabled:opacity-50">
            {isPending ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={() => { setEditingCoupon(null); setEditCouponImageUrl(""); }} className="px-6 py-2.5 bg-white/10 text-white/60 font-bold rounded-xl text-sm hover:bg-white/20 transition">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["categories", "coupons"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(null); setEditingCat(null); setEditingCoupon(null); }}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
              tab === t
                ? "bg-accent text-primary"
                : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
            }`}
          >
            {t === "categories" ? `Categories (${categories.length})` : `Coupons (${coupons.length})`}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {/* ════════════════════════════════════════ */}
      {/* CATEGORIES TAB                          */}
      {/* ════════════════════════════════════════ */}
      {tab === "categories" && (
        <div>
          {!editingCat && (
            <button
              onClick={() => setShowCatForm(!showCatForm)}
              className="mb-6 px-5 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition"
            >
              {showCatForm ? "Cancel" : "+ New Category"}
            </button>
          )}

          {showCatForm && !editingCat && renderCategoryForm("create")}
          {editingCat && renderCategoryForm("edit", editingCat)}

          {/* Category list */}
          {categories.length === 0 ? (
            <p className="text-white/30 text-sm">No categories yet.</p>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`bg-white/[0.05] border rounded-2xl p-5 flex items-center justify-between gap-4 transition ${
                    cat.is_active ? "border-white/10" : "border-white/5 opacity-50"
                  } ${editingCat?.id === cat.id ? "ring-2 ring-accent" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                    <div className="min-w-0">
                      <h3 className="text-white font-bold truncate">{cat.name}</h3>
                      <p className="text-white/30 text-xs">
                        /{cat.slug} · order {cat.display_order}
                        {!cat.is_active && " · inactive"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEditCat(cat)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition disabled:opacity-50">
                      Edit
                    </button>
                    <button onClick={() => handleToggleCat(cat.id, cat.is_active)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition disabled:opacity-50">
                      {cat.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => handleDeleteCat(cat.id)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition disabled:opacity-50">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════ */}
      {/* COUPONS TAB                             */}
      {/* ════════════════════════════════════════ */}
      {tab === "coupons" && (
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all" className="bg-[#0D1B3E] text-white">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0D1B3E] text-white">{cat.name}</option>
              ))}
            </select>
          </div>

          {editingCoupon && renderCouponForm(editingCoupon)}

          {/* Coupon list */}
          {filteredCoupons.length === 0 ? (
            <p className="text-white/30 text-sm">No coupons found.</p>
          ) : (
            <div className="space-y-3">
              {filteredCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`bg-white/[0.05] border rounded-2xl p-5 transition ${
                    coupon.is_active ? "border-white/10" : "border-white/5 opacity-50"
                  } ${editingCoupon?.id === coupon.id ? "ring-2 ring-accent" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {coupon.category && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                            {coupon.category.name}
                          </span>
                        )}
                        {coupon.coupon_code && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                            {coupon.coupon_code}
                          </span>
                        )}
                        {!coupon.is_active && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                            Inactive
                          </span>
                        )}
                        {coupon.is_premium && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full ring-1 ring-yellow-400/50">
                            🌟 Premium
                          </span>
                        )}
                        {coupon.expires_at && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                            Expires: {new Date(coupon.expires_at).toLocaleDateString()}
                          </span>
                        )}
                        {coupon.max_redemptions && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                            {coupon.current_redemptions} / {coupon.max_redemptions} Uses
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-bold text-lg truncate">{coupon.product_service_name}</h3>
                      {coupon.description && (
                        <p className="text-white/30 text-xs mt-0.5 line-clamp-2">{coupon.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      <button onClick={() => openEditCoupon(coupon)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition disabled:opacity-50">
                        Edit
                      </button>
                      <button onClick={() => handleToggleCouponActive(coupon.id, coupon.is_active)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition disabled:opacity-50">
                        {coupon.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => handleDeleteCoupon(coupon.id)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition disabled:opacity-50">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
