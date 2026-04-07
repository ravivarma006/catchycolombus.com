"use client";

import { useState, useTransition } from "react";
import { updateEvent, toggleEventActive, deleteEvent, createEvent } from "@/app/admin/actions";
import ImageUpload from "@/components/admin/ImageUpload";
import AdminSlidePanel from "@/components/admin/AdminSlidePanel";

interface ApprovedEvent {
  id: string;
  title: string;
  slug: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  description: string | null;
  price: string | null;
  website: string | null;
  image_url: string | null;
  category: string | null;
  is_featured: boolean;
  is_active: boolean;
}

const INPUT_CLS =
  "w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent";

export default function EventsManager({ events }: { events: ApprovedEvent[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<ApprovedEvent | null>(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createImageUrl, setCreateImageUrl] = useState("");

  // ── Handlers ──

  function openEdit(evt: ApprovedEvent) {
    setEditingEvent(evt);
    setEditImageUrl(evt.image_url || "");
    setError(null);
  }

  function handleUpdate(formData: FormData) {
    if (!editingEvent) return;
    setError(null);
    startTransition(async () => {
      const result = await updateEvent(editingEvent.id, formData);
      if (result.error) setError(result.error);
      else {
        setEditingEvent(null);
        setEditImageUrl("");
      }
    });
  }

  function handleToggleActive(id: string, current: boolean) {
    startTransition(async () => {
      await toggleEventActive(id, current);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteEvent(id);
    });
  }

  function handleCreate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createEvent(formData);
      if (result.error) setError(result.error);
      else {
        setIsCreating(false);
        setCreateImageUrl("");
      }
    });
  }

  // ── Edit form ──

  function renderEditForm(evt: ApprovedEvent) {
    return (
      <form
        action={handleUpdate}
        className="grid grid-cols-1 gap-4"
      >
        <div className="col-span-1">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Title *
          </label>
          <input
            name="title"
            required
            defaultValue={evt.title}
            className={INPUT_CLS}
            placeholder="Event title"
          />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Date *
          </label>
          <input
            name="event_date"
            type="date"
            required
            defaultValue={evt.event_date}
            className={INPUT_CLS}
          />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Time
          </label>
          <input
            name="event_time"
            defaultValue={evt.event_time || ""}
            className={INPUT_CLS}
            placeholder="e.g. 7:00 PM - 10:00 PM"
          />
        </div>

        <div className="col-span-1">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Location
          </label>
          <input
            name="location"
            defaultValue={evt.location || ""}
            className={INPUT_CLS}
            placeholder="Venue name and address"
          />
        </div>

        <div className="col-span-1">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={evt.description || ""}
            className={`${INPUT_CLS} resize-none`}
            placeholder="Event description..."
          />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Price
          </label>
          <input
            name="price"
            defaultValue={evt.price || ""}
            className={INPUT_CLS}
            placeholder="e.g. Free, $25"
          />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Website
          </label>
          <input
            name="website"
            type="url"
            defaultValue={evt.website || ""}
            className={INPUT_CLS}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Category
          </label>
          <input
            name="category"
            defaultValue={evt.category || ""}
            className={INPUT_CLS}
            placeholder="e.g. SPORTS, MUSIC"
          />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Image
          </label>
          <ImageUpload
            bucket="event-images"
            folder="events"
            onUpload={setEditImageUrl}
            currentUrl={editImageUrl}
          />
          <input type="hidden" name="image_url" value={editImageUrl} />
        </div>

        <div className="flex items-center gap-2 col-span-1">
          <input
            type="checkbox"
            name="is_featured"
            value="true"
            id="edit_is_featured"
            defaultChecked={evt.is_featured}
            className="rounded border-white/20"
          />
          <label htmlFor="edit_is_featured" className="text-white/60 text-sm">
            Featured event
          </label>
        </div>

        <div className="col-span-1 flex gap-3">
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
              setEditingEvent(null);
              setEditImageUrl("");
            }}
            className="px-6 py-2.5 bg-white/10 text-white/60 font-bold rounded-xl text-sm hover:bg-white/20 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  function renderCreateForm() {
    return (
      <form
        action={handleCreate}
        className="grid grid-cols-1 gap-4"
      >
        <div className="col-span-1">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Title *
          </label>
          <input name="title" required className={INPUT_CLS} placeholder="Event title" />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Date *
          </label>
          <input name="event_date" type="date" required className={INPUT_CLS} />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Time
          </label>
          <input name="event_time" className={INPUT_CLS} placeholder="e.g. 7:00 PM - 10:00 PM" />
        </div>

        <div className="col-span-1">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Location
          </label>
          <input name="location" className={INPUT_CLS} placeholder="Venue name and address" />
        </div>

        <div className="col-span-1">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Description
          </label>
          <textarea name="description" rows={3} className={`${INPUT_CLS} resize-none`} placeholder="Event description..." />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Price
          </label>
          <input name="price" className={INPUT_CLS} placeholder="e.g. Free, $25" />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Website
          </label>
          <input name="website" type="url" className={INPUT_CLS} placeholder="https://..." />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Category
          </label>
          <input name="category" className={INPUT_CLS} placeholder="e.g. SPORTS, MUSIC" />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
            Image
          </label>
          <ImageUpload
            bucket="event-images"
            folder="events"
            onUpload={setCreateImageUrl}
            currentUrl={createImageUrl}
          />
          <input type="hidden" name="image_url" value={createImageUrl} />
        </div>

        <div className="flex items-center gap-2 col-span-1">
          <input type="checkbox" name="is_featured" value="true" id="create_is_featured" className="rounded border-white/20" />
          <label htmlFor="create_is_featured" className="text-white/60 text-sm">
            Featured event
          </label>
        </div>

        <div className="col-span-1 flex gap-3">
          <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-green-500 text-white font-bold rounded-xl text-sm hover:bg-green-400 transition disabled:opacity-50">
            {isPending ? "Creating..." : "Create Event"}
          </button>
          <button type="button" onClick={() => { setIsCreating(false); setCreateImageUrl(""); }} className="px-6 py-2.5 bg-white/10 text-white/60 font-bold rounded-xl text-sm hover:bg-white/20 transition">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  // ── Render ──

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-yellow-400 transition ml-auto"
        >
          + Add New Event
        </button>
      </div>

      <AdminSlidePanel isOpen={isCreating} onClose={() => { setIsCreating(false); setCreateImageUrl(""); }} title="New Event">
        {renderCreateForm()}
      </AdminSlidePanel>
      <AdminSlidePanel isOpen={!!editingEvent} onClose={() => { setEditingEvent(null); setEditImageUrl(""); }} title="Edit Event">
        {editingEvent && renderEditForm(editingEvent)}
      </AdminSlidePanel>

      {events.length === 0 ? (
        <p className="text-white/30 text-sm">No approved events yet.</p>
      ) : (
        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              className={`bg-white/[0.05] border rounded-2xl p-5 transition ${
                evt.is_active ? "border-white/10" : "border-white/5 opacity-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {evt.category && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                        {evt.category}
                      </span>
                    )}
                    {evt.is_featured && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                    {!evt.is_active && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                    {evt.price && (
                      <span className="text-[10px] font-bold text-white/30">
                        {evt.price}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-lg truncate">
                    {evt.title}
                  </h3>
                  <p className="text-white/30 text-xs">
                    {evt.event_date}
                    {evt.event_time ? ` · ${evt.event_time}` : ""}
                    {evt.location ? ` · ${evt.location}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  <button
                    onClick={() => openEdit(evt)}
                    disabled={isPending}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(evt.id, evt.is_active)}
                    disabled={isPending}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition disabled:opacity-50"
                  >
                    {evt.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(evt.id)}
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
  );
}
