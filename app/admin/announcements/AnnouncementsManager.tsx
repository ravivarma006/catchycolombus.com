"use client";

import { useState, useTransition } from "react";
import {
  createAnnouncement,
  updateAnnouncement,
  toggleAnnouncementActive,
  toggleAnnouncementPinned,
  deleteAnnouncement,
} from "./actions";
import ImageUpload from "@/components/admin/ImageUpload";
import AdminSlidePanel from "@/components/admin/AdminSlidePanel";

interface Announcement {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  is_pinned: boolean;
  is_active: boolean;
  published_at: string;
}

const INPUT_CLS = "w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent";

export default function AnnouncementsManager({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [editImageUrl, setEditImageUrl] = useState("");

  function handleCreate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createAnnouncement(formData);
      if (result.error) setError(result.error);
      else { setShowForm(false); setImageUrl(""); }
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editing) return;
    setError(null);
    startTransition(async () => {
      const result = await updateAnnouncement(editing.id, formData);
      if (result.error) setError(result.error);
      else { setEditing(null); setEditImageUrl(""); }
    });
  }

  function openEdit(item: Announcement) {
    setEditing(item);
    setEditImageUrl(item.image_url || "");
    setShowForm(false);
    setError(null);
  }

  function handleToggleActive(id: string, current: boolean) {
    startTransition(async () => { await toggleAnnouncementActive(id, current); });
  }

  function handleTogglePin(id: string, current: boolean) {
    startTransition(async () => { await toggleAnnouncementPinned(id, current); });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    startTransition(async () => { await deleteAnnouncement(id); });
  }

  function renderForm(mode: "create" | "edit", item?: Announcement) {
    const isEdit = mode === "edit" && item;
    const imgUrl = isEdit ? editImageUrl : imageUrl;
    const setImgUrl = isEdit ? setEditImageUrl : setImageUrl;

    return (
      <form
        action={isEdit ? handleUpdate : handleCreate}
        className="space-y-4"
      >
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Title *</label>
          <input name="title" required defaultValue={item?.title || ""} className={INPUT_CLS} placeholder="Announcement title" />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Content</label>
          <textarea name="content" rows={4} defaultValue={item?.content || ""} className={`${INPUT_CLS} resize-none`} placeholder="Announcement details..." />
        </div>
        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Image</label>
          <ImageUpload bucket="city-images" folder="announcements" onUpload={setImgUrl} currentUrl={imgUrl} />
          <input type="hidden" name="image_url" value={imgUrl} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_pinned" value="true" id={isEdit ? "edit_pinned" : "is_pinned"} defaultChecked={item?.is_pinned || false} className="rounded border-white/20" />
          <label htmlFor={isEdit ? "edit_pinned" : "is_pinned"} className="text-white/60 text-sm">Pin to top</label>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition disabled:opacity-50">
            {isPending ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Announcement")}
          </button>
          <button type="button" onClick={() => isEdit ? setEditing(null) : setShowForm(false)} className="px-6 py-2.5 bg-white/10 text-white/60 font-bold rounded-xl text-sm hover:bg-white/20 transition">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <button
        onClick={() => { setShowForm(true); setError(null); }}
        className="mb-6 px-5 py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition"
      >
        + New Announcement
      </button>

      <AdminSlidePanel isOpen={showForm && !editing} onClose={() => setShowForm(false)} title="New Announcement">
        {renderForm("create")}
      </AdminSlidePanel>
      <AdminSlidePanel isOpen={!!editing} onClose={() => { setEditing(null); setEditImageUrl(""); }} title="Edit Announcement">
        {editing && renderForm("edit", editing)}
      </AdminSlidePanel>

      {/* List */}
      {announcements.length === 0 ? (
        <p className="text-white/30 text-sm">No announcements yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className={`bg-white/[0.05] border rounded-2xl p-5 transition ${
                item.is_active ? "border-white/10" : "border-white/5 opacity-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.is_pinned && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/20 text-accent px-2 py-0.5 rounded-full">Pinned</span>
                    )}
                    {!item.is_active && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Inactive</span>
                    )}
                    <span className="text-xs text-white/30">
                      {new Date(item.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg truncate">{item.title}</h3>
                  {item.content && (
                    <p className="text-white/40 text-sm mt-1 line-clamp-2">{item.content}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  <button onClick={() => openEdit(item)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition disabled:opacity-50">
                    Edit
                  </button>
                  <button onClick={() => handleTogglePin(item.id, item.is_pinned)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition disabled:opacity-50" title={item.is_pinned ? "Unpin" : "Pin"}>
                    {item.is_pinned ? "Unpin" : "Pin"}
                  </button>
                  <button onClick={() => handleToggleActive(item.id, item.is_active)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition disabled:opacity-50">
                    {item.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleDelete(item.id)} disabled={isPending} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition disabled:opacity-50">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
