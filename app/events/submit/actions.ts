"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { eventRequestSchema, formatZodErrors } from "@/lib/validations";

export async function submitEventRequest(
  _prev: { error: string },
  formData: FormData
): Promise<{ error: string }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to submit an event." };
  }

  // ── Zod validation ──────────────────────────────────────────
  const raw = {
    event_name:  formData.get("event_name"),
    email:       formData.get("email"),
    phone:       formData.get("phone"),
    event_date:  formData.get("event_date"),
    event_time:  formData.get("event_time"),
    address:     formData.get("address"),
    price:       formData.get("price"),
    description: formData.get("description"),
    website:     formData.get("website"),
    image_url:   formData.get("image_url"),
  };

  const parsed = eventRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: formatZodErrors(parsed.error) };
  }

  const data = parsed.data;

  // ── Rate limit: max 5 pending event requests per user ───────
  const { count } = await supabase
    .from("event_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "pending");

  if ((count ?? 0) >= 5) {
    return { error: "You already have 5 pending event requests. Please wait for them to be reviewed before submitting more." };
  }

  // ── Insert ──────────────────────────────────────────────────
  const { error: dbError } = await supabase.from("event_requests").insert({
    user_id:    user.id,
    event_name: data.event_name,
    email:      data.email,
    phone:      data.phone || null,
    event_date: data.event_date || null,
    event_time: data.event_time || null,
    address:    data.address || null,
    price:      data.price || "Free",
    description:data.description || null,
    website:    data.website || null,
    image_url:  data.image_url || null,
    status:     "pending",
  });

  if (dbError) {
    console.error("[submitEventRequest]", dbError.message);
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/events/submit?success=1");
}
