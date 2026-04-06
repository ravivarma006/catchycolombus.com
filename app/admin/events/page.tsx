import { createClient } from "@/lib/supabase/server";
import ReviewCard from "@/components/admin/ReviewCard";
import EventsManager from "@/components/admin/EventsManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Events Management" };

export default async function AdminEventsPage() {
  const supabase = createClient();

  const [{ data: requestsData }, { data: eventsData }] = await Promise.all([
    supabase
      .from("event_requests")
      .select("id, event_name, email, phone, event_date, event_time, address, description, price, website, image_url, status, admin_notes, created_at, user_id")
      .in("status", ["pending", "needs_changes", "rejected", "approved"])
      .order("created_at", { ascending: false }),
    supabase
      .from("events")
      .select("id, title, slug, event_date, event_time, location, description, price, website, image_url, category, is_featured, is_active")
      .order("event_date", { ascending: false }),
  ]);

  const requests = requestsData ?? [];
  const pending  = requests.filter((r) => r.status === "pending");
  const rest     = requests.filter((r) => r.status !== "pending");
  const events   = (eventsData ?? []) as Array<{
    id: string; title: string; slug: string; event_date: string;
    event_time: string | null; location: string | null; description: string | null;
    price: string | null; website: string | null; image_url: string | null;
    category: string | null; is_featured: boolean; is_active: boolean;
  }>;

  return (
    <div className="px-4 py-6 md:px-8 md:py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Events Management
        </h1>
        <p className="text-white/40 text-sm">
          {pending.length} pending requests · {events.length} approved events
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
                type="event"
                title={req.event_name}
                status={req.status as "pending"}
                adminNotes={req.admin_notes}
                createdAt={req.created_at}
                submittedBy={req.email}
                details={[
                  { label: "Event Date",   value: req.event_date },
                  { label: "Event Time",   value: req.event_time },
                  { label: "Location",     value: req.address },
                  { label: "Price",        value: req.price },
                  { label: "Email",        value: req.email },
                  { label: "Phone",        value: req.phone },
                  { label: "Website",      value: req.website },
                  { label: "Image URL",    value: req.image_url },
                  { label: "Description",  value: req.description },
                ]}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Approved Events (editable) ── */}
      <section className="mb-10">
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">
          Approved Events ({events.length})
        </p>
        <EventsManager events={events} />
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
                type="event"
                title={req.event_name}
                status={req.status as "approved" | "rejected" | "needs_changes"}
                adminNotes={req.admin_notes}
                createdAt={req.created_at}
                submittedBy={req.email}
                details={[
                  { label: "Event Date",  value: req.event_date },
                  { label: "Location",    value: req.address },
                  { label: "Price",       value: req.price },
                  { label: "Email",       value: req.email },
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
