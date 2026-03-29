"use client";

import { useState, useTransition } from "react";
import {
  createServiceCategory,
  updateServiceCategory,
  toggleServiceCategoryActive,
  deleteServiceCategory,
  updateProvider,
  toggleProviderActive,
  deleteProvider,
} from "@/app/admin/actions";
import ImageUpload from "@/components/admin/ImageUpload";

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

interface ApprovedProvider {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  description: string | null;
  website: string | null;
  image_url: string | null;
  is_active: boolean;
  category_id: string | null;
  category: { name: string } | null;
}

const INPUT_CLS =
  "w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent";

export default function ProvidersManager({
  providers,
  categories,
}: {
  providers: ApprovedProvider[];
  categories: ServiceCategory[];
}) {
  const [tab, setTab] = useState<"providers" | "categories">("providers");
  const [showCatForm, setShowCatForm] = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [catImageUrl, setCatImageUrl] = useState("");

  // Edit state – categories
  const [editingCat, setEditingCat] = useState<ServiceCategory | null>(null);
  const [editCatImageUrl, setEditCatImageUrl] = useState("");

  // Edit state – providers
  const [editingProv, setEditingProv] = useState<ApprovedProvider | null>(null);
  const [editProvImageUrl, setEditProvImageUrl] = useState("");

  // ── Category handlers ──────────────────────────────────────────────
  function handleCreateCategory(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createServiceCategory(formData);
      if (result.error) setError(result.error);
      else {
        setShowCatForm(false);
        setCatImageUrl("");
      }
    });
  }

  function handleUpdateCategory(formData: FormData) {
    if (!editingCat) return;
    setError(null);
    startTransition(async () => {
      const result = await updateServiceCategory(editingCat.id, formData);
      if (result.error) setError(result.error);
      else {
        setEditingCat(null);
        setEditCatImageUrl("");
      }
    });
  }

  function openEditCat(cat: ServiceCategory) {
    setEditingCat(cat);
    setEditCatImageUrl(cat.image_url || "");
    setShowCatForm(false);
    setError(null);
  }

  function handleToggleCat(id: string, current: boolean) {
    startTransition(async () => {
      await toggleServiceCategoryActive(id, current);
    });
  }

  function handleDeleteCat(id: string) {
    if (!confirm("Delete this category? Providers in it will become uncategorized.")) return;
    startTransition(async () => {
      await deleteServiceCategory(id);
    });
  }

  // ── Provider handlers ──────────────────────────────────────────────
  function handleUpdateProvider(formData: FormData) {
    if (!editingProv) return;
    setError(null);
    startTransition(async () => {
      const result = await updateProvider(editingProv.id, formData);
      if (result.error) setError(result.error);
      else {
        setEditingProv(null);
        setEditProvImageUrl("");
      }
    });
  }

  function openEditProv(prov: ApprovedProvider) {
    setEditingProv(prov);
    setEditProvImageUrl(prov.image_url || "");
    setError(null);
  }

  function handleToggleProvider(id: string, current: boolean) {
    startTransition(async () => {
      await toggleProviderActive(id, current);
    });
  }

  function handleDeleteProvider(id: string) {
    if (!confirm("Delete this provider?")) return;
    startTransition(async () => {
      await deleteProvider(id);
    });
  }

  const filteredProviders =
    catFilter === "all"
      ? providers
      : providers.filter((p) => p.category_id === catFilter);

  // ── Category form ──────────────────────────────────────────────────
  function renderCategoryForm(mode: "create" | "edit", cat?: ServiceCategory) {
    const isEdit = mode === "edit" && cat;
    const imgUrl = isEdit ? editCatImageUrl : catImageUrl;
    const setImgUrl = isEdit ? setEditCatImageUrl : setCatImageUrl;

    return (
      <form
        action={isEdit ? handleUpdateCategory : handleCreateCategory}
        className="bg-white/[0.05] border border-white/10 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Name *
          </label>
          <input
            name="name"
            required
            defaultValue={cat?.name || ""}
            className={INPUT_CLS}
            placeholder="e.g. Plumbing"
          />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Icon (emoji)
          </label>
          <input
            name="icon"
            defaultValue={cat?.icon || ""}
            className={INPUT_CLS}
            placeholder="🔧"
          />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Display Order
          </label>
          <input
            name="display_order"
            type="number"
            defaultValue={cat?.display_order ?? 0}
            className={INPUT_CLS}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Description
          </label>
          <input
            name="description"
            defaultValue={cat?.description || ""}
            className={INPUT_CLS}
            placeholder="Short description"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Image
          </label>
          <ImageUpload
            bucket="categories"
            folder="services"
            onUpload={setImgUrl}
            currentUrl={imgUrl}
          />
          <input type="hidden" name="image_url" value={imgUrl} />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {isPending
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save Changes"
                : "Create Category"}
          </button>
          <button
            type="button"
            onClick={() => (isEdit ? setEditingCat(null) : setShowCatForm(false))}
            className="px-6 py-2.5 bg-white/10 text-white/60 font-bold rounded-xl text-sm hover:bg-white/20 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  // ── Provider edit form ─────────────────────────────────────────────
  function renderProviderForm(prov: ApprovedProvider) {
    return (
      <form
        action={handleUpdateProvider}
        className="bg-white/[0.05] border border-white/10 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Name *
          </label>
          <input
            name="name"
            required
            defaultValue={prov.name}
            className={INPUT_CLS}
            placeholder="Provider name"
          />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Category
          </label>
          <select
            name="category_id"
            defaultValue={prov.category_id || ""}
            className={INPUT_CLS}
          >
            <option value="" className="bg-[#0D1B3E]">
              — Select —
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#0D1B3E]">
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Phone
          </label>
          <input
            name="phone"
            defaultValue={prov.phone || ""}
            className={INPUT_CLS}
            placeholder="(614) 555-0000"
          />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            defaultValue={prov.email || ""}
            className={INPUT_CLS}
            placeholder="info@example.com"
          />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Website
          </label>
          <input
            name="website"
            type="url"
            defaultValue={prov.website || ""}
            className={INPUT_CLS}
            placeholder="https://..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Address
          </label>
          <input
            name="address"
            defaultValue={prov.address || ""}
            className={INPUT_CLS}
            placeholder="Full address"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={prov.description || ""}
            className={`${INPUT_CLS} resize-none`}
            placeholder="About this provider..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Image
          </label>
          <ImageUpload
            bucket="provider-images"
            folder="providers"
            onUpload={setEditProvImageUrl}
            currentUrl={editProvImageUrl}
          />
          <input type="hidden" name="image_url" value={editProvImageUrl} />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Facebook URL
          </label>
          <input
            name="facebook"
            type="url"
            defaultValue=""
            className={INPUT_CLS}
            placeholder="https://facebook.com/..."
          />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Instagram URL
          </label>
          <input
            name="instagram"
            type="url"
            defaultValue=""
            className={INPUT_CLS}
            placeholder="https://instagram.com/..."
          />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Twitter URL
          </label>
          <input
            name="twitter"
            type="url"
            defaultValue=""
            className={INPUT_CLS}
            placeholder="https://twitter.com/..."
          />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingProv(null);
              setEditProvImageUrl("");
            }}
            className="px-6 py-2.5 bg-white/10 text-white/60 font-bold rounded-xl text-sm hover:bg-white/20 transition"
          >
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
        {(["providers", "categories"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setError(null);
              setEditingCat(null);
              setEditingProv(null);
            }}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
              tab === t
                ? "bg-accent text-primary"
                : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
            }`}
          >
            {t === "providers"
              ? `Providers (${providers.length})`
              : `Categories (${categories.length})`}
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
                    <button
                      onClick={() => openEditCat(cat)}
                      disabled={isPending}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleCat(cat.id, cat.is_active)}
                      disabled={isPending}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition disabled:opacity-50"
                    >
                      {cat.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDeleteCat(cat.id)}
                      disabled={isPending}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition disabled:opacity-50"
                    >
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
      {/* PROVIDERS TAB                           */}
      {/* ════════════════════════════════════════ */}
      {tab === "providers" && (
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all" className="bg-[#0D1B3E]">
                All Categories
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0D1B3E]">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {editingProv && renderProviderForm(editingProv)}

          {/* Provider list */}
          {filteredProviders.length === 0 ? (
            <p className="text-white/30 text-sm">No providers found.</p>
          ) : (
            <div className="space-y-3">
              {filteredProviders.map((prov) => (
                <div
                  key={prov.id}
                  className={`bg-white/[0.05] border rounded-2xl p-5 transition ${
                    prov.is_active ? "border-white/10" : "border-white/5 opacity-50"
                  } ${editingProv?.id === prov.id ? "ring-2 ring-accent" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {prov.category && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                            {prov.category.name}
                          </span>
                        )}
                        {!prov.is_active && (
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-bold text-lg truncate">{prov.name}</h3>
                      {prov.address && (
                        <p className="text-white/30 text-xs">{prov.address}</p>
                      )}
                      {(prov.phone || prov.email) && (
                        <p className="text-white/30 text-xs mt-0.5">
                          {prov.phone}
                          {prov.phone && prov.email && " · "}
                          {prov.email}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      <button
                        onClick={() => openEditProv(prov)}
                        disabled={isPending}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleProvider(prov.id, prov.is_active)}
                        disabled={isPending}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition disabled:opacity-50"
                      >
                        {prov.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDeleteProvider(prov.id)}
                        disabled={isPending}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition disabled:opacity-50"
                      >
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
