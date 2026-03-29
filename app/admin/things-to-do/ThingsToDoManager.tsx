"use client";

import { useState, useTransition } from "react";
import {
  createCategory,
  updateCategory,
  toggleCategoryActive,
  deleteCategory,
  createActivity,
  updateActivity,
  toggleActivityActive,
  toggleActivityFeatured,
  deleteActivity,
} from "./actions";
import ImageUpload from "@/components/admin/ImageUpload";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

interface Activity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  neighborhood: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  image_url: string | null;
  hours: string | null;
  price_range: string | null;
  is_featured: boolean;
  is_active: boolean;
  category_id: string | null;
  category: { name: string; slug: string } | null;
  social_links: { facebook?: string; instagram?: string; twitter?: string } | null;
}

const PRICE_OPTIONS = ["Free", "$", "$$", "$$$"];

const INPUT_CLS = "w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent";

export default function ThingsToDoManager({
  categories,
  activities,
}: {
  categories: Category[];
  activities: Activity[];
}) {
  const [tab, setTab] = useState<"categories" | "activities">("categories");
  const [showCatForm, setShowCatForm] = useState(false);
  const [showActForm, setShowActForm] = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [catImageUrl, setCatImageUrl] = useState("");
  const [actImageUrl, setActImageUrl] = useState("");

  // Edit state
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editCatImageUrl, setEditCatImageUrl] = useState("");
  const [editingAct, setEditingAct] = useState<Activity | null>(null);
  const [editActImageUrl, setEditActImageUrl] = useState("");

  // ── Category handlers ──
  function handleCreateCategory(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createCategory(formData);
      if (result.error) setError(result.error);
      else { setShowCatForm(false); setCatImageUrl(""); }
    });
  }

  function handleUpdateCategory(formData: FormData) {
    if (!editingCat) return;
    setError(null);
    startTransition(async () => {
      const result = await updateCategory(editingCat.id, formData);
      if (result.error) setError(result.error);
      else { setEditingCat(null); setEditCatImageUrl(""); }
    });
  }

  function openEditCat(cat: Category) {
    setEditingCat(cat);
    setEditCatImageUrl(cat.image_url || "");
    setShowCatForm(false);
    setError(null);
  }

  function handleToggleCat(id: string, current: boolean) {
    startTransition(async () => { await toggleCategoryActive(id, current); });
  }

  function handleDeleteCat(id: string) {
    if (!confirm("Delete this category? Activities in it will become uncategorized.")) return;
    startTransition(async () => { await deleteCategory(id); });
  }

  // ── Activity handlers ──
  function handleCreateActivity(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createActivity(formData);
      if (result.error) setError(result.error);
      else { setShowActForm(false); setActImageUrl(""); }
    });
  }

  function handleUpdateActivity(formData: FormData) {
    if (!editingAct) return;
    setError(null);
    startTransition(async () => {
      const result = await updateActivity(editingAct.id, formData);
      if (result.error) setError(result.error);
      else { setEditingAct(null); setEditActImageUrl(""); }
    });
  }

  function openEditAct(act: Activity) {
    setEditingAct(act);
    setEditActImageUrl(act.image_url || "");
    setShowActForm(false);
    setError(null);
  }

  function handleToggleActive(id: string, current: boolean) {
    startTransition(async () => { await toggleActivityActive(id, current); });
  }

  function handleToggleFeatured(id: string, current: boolean) {
    startTransition(async () => { await toggleActivityFeatured(id, current); });
  }

  function handleDeleteAct(id: string) {
    if (!confirm("Delete this activity?")) return;
    startTransition(async () => { await deleteActivity(id); });
  }

  const filteredActivities = catFilter === "all"
    ? activities
    : activities.filter((a) => a.category_id === catFilter);

  // ── Shared form fields ──
  function renderCategoryForm(mode: "create" | "edit", cat?: Category) {
    const isEdit = mode === "edit" && cat;
    const imgUrl = isEdit ? editCatImageUrl : catImageUrl;
    const setImgUrl = isEdit ? setEditCatImageUrl : setCatImageUrl;

    return (
      <form
        action={isEdit ? handleUpdateCategory : handleCreateCategory}
        className="bg-white/[0.05] border border-white/10 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Name *</label>
          <input name="name" required defaultValue={cat?.name || ""} className={INPUT_CLS} placeholder="e.g. Museums" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Icon (emoji)</label>
          <input name="icon" defaultValue={cat?.icon || ""} className={INPUT_CLS} placeholder="🏛️" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Display Order</label>
          <input name="display_order" type="number" defaultValue={cat?.display_order ?? 0} className={INPUT_CLS} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Description</label>
          <input name="description" defaultValue={cat?.description || ""} className={INPUT_CLS} placeholder="Short description" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Image</label>
          <ImageUpload bucket="things-to-do-images" folder="categories" onUpload={setImgUrl} currentUrl={imgUrl} />
          <input type="hidden" name="image_url" value={imgUrl} />
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

  function renderActivityForm(mode: "create" | "edit", act?: Activity) {
    const isEdit = mode === "edit" && act;
    const imgUrl = isEdit ? editActImageUrl : actImageUrl;
    const setImgUrl = isEdit ? setEditActImageUrl : setActImageUrl;
    const socials = act?.social_links || {};

    return (
      <form
        action={isEdit ? handleUpdateActivity : handleCreateActivity}
        className="bg-white/[0.05] border border-white/10 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Name *</label>
          <input name="name" required defaultValue={act?.name || ""} className={INPUT_CLS} placeholder="Activity name" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Category</label>
          <select name="category_id" defaultValue={act?.category_id || ""} className={INPUT_CLS}>
            <option value="" className="bg-[#0D1B3E]">— Select —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#0D1B3E]">{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Neighborhood</label>
          <input name="neighborhood" defaultValue={act?.neighborhood || ""} className={INPUT_CLS} placeholder="e.g. Short North" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Description</label>
          <textarea name="description" rows={3} defaultValue={act?.description || ""} className={`${INPUT_CLS} resize-none`} placeholder="What makes this place special..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Address</label>
          <input name="address" defaultValue={act?.address || ""} className={INPUT_CLS} placeholder="Full address" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Phone</label>
          <input name="phone" defaultValue={act?.phone || ""} className={INPUT_CLS} placeholder="(614) 555-0000" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Email</label>
          <input name="email" type="email" defaultValue={act?.email || ""} className={INPUT_CLS} placeholder="info@example.com" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Website</label>
          <input name="website" type="url" defaultValue={act?.website || ""} className={INPUT_CLS} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Image</label>
          <ImageUpload bucket="things-to-do-images" folder="activities" onUpload={setImgUrl} currentUrl={imgUrl} />
          <input type="hidden" name="image_url" value={imgUrl} />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Hours</label>
          <input name="hours" defaultValue={act?.hours || ""} className={INPUT_CLS} placeholder="Mon-Fri 9am-5pm" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Price Range</label>
          <select name="price_range" defaultValue={act?.price_range || ""} className={INPUT_CLS}>
            <option value="" className="bg-[#0D1B3E]">— Select —</option>
            {PRICE_OPTIONS.map((p) => (
              <option key={p} value={p} className="bg-[#0D1B3E]">{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Facebook URL</label>
          <input name="facebook" type="url" defaultValue={socials.facebook || ""} className={INPUT_CLS} placeholder="https://facebook.com/..." />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Instagram URL</label>
          <input name="instagram" type="url" defaultValue={socials.instagram || ""} className={INPUT_CLS} placeholder="https://instagram.com/..." />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Twitter URL</label>
          <input name="twitter" type="url" defaultValue={socials.twitter || ""} className={INPUT_CLS} placeholder="https://twitter.com/..." />
        </div>
        <div className="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" name="is_featured" value="true" id={isEdit ? "edit_is_featured" : "is_featured"} defaultChecked={act?.is_featured || false} className="rounded border-white/20" />
          <label htmlFor={isEdit ? "edit_is_featured" : "is_featured"} className="text-white/60 text-sm">Featured activity</label>
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition disabled:opacity-50">
            {isPending ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Activity")}
          </button>
          <button type="button" onClick={() => isEdit ? setEditingAct(null) : setShowActForm(false)} className="px-6 py-2.5 bg-white/10 text-white/60 font-bold rounded-xl text-sm hover:bg-white/20 transition">
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
        {(["categories", "activities"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(null); setEditingCat(null); setEditingAct(null); }}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
              tab === t
                ? "bg-accent text-primary"
                : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
            }`}
          >
            {t === "categories" ? `Categories (${categories.length})` : `Activities (${activities.length})`}
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
      {/* ACTIVITIES TAB                          */}
      {/* ════════════════════════════════════════ */}
      {tab === "activities" && (
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {!editingAct && (
              <button
                onClick={() => setShowActForm(!showActForm)}
                className="px-5 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition"
              >
                {showActForm ? "Cancel" : "+ New Activity"}
              </button>
            )}
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all" className="bg-[#0D1B3E]">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0D1B3E]">{cat.name}</option>
              ))}
            </select>
          </div>

          {showActForm && !editingAct && renderActivityForm("create")}
          {editingAct && renderActivityForm("edit", editingAct)}

          {/* Activity list */}
          {filteredActivities.length === 0 ? (
            <p className="text-white/30 text-sm">No activities found.</p>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className={`bg-white/[0.05] border rounded-2xl p-5 transition ${
                    act.is_active ? "border-white/10" : "border-white/5 opacity-50"
                  } ${editingAct?.id === act.id ? "ring-2 ring-accent" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {act.category && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                            {act.category.name}
                          </span>
                        )}
                        {act.is_featured && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                        {!act.is_active && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                            Inactive
                          </span>
                        )}
                        {act.price_range && (
                          <span className="text-[10px] font-bold text-white/30">{act.price_range}</span>
                        )}
                      </div>
                      <h3 className="text-white font-bold text-lg truncate">{act.name}</h3>
                      {act.neighborhood && (
                        <p className="text-white/30 text-xs">{act.neighborhood} · {act.address}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      <button onClick={() => openEditAct(act)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition disabled:opacity-50">
                        Edit
                      </button>
                      <button onClick={() => handleToggleFeatured(act.id, act.is_featured)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition disabled:opacity-50">
                        {act.is_featured ? "Unfeature" : "Feature"}
                      </button>
                      <button onClick={() => handleToggleActive(act.id, act.is_active)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition disabled:opacity-50">
                        {act.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => handleDeleteAct(act.id)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition disabled:opacity-50">
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
