"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { providerRequestSchema, formatZodErrors } from "@/lib/validations";

export async function submitProviderRequest(
  _prev: { error: string },
  formData: FormData
): Promise<{ error: string }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to submit a business listing." };
  }

  // ── Zod validation ──────────────────────────────────────────
  const raw = {
    business_name: formData.get("business_name"),
    business_type: formData.get("business_type"),
    category_id:   formData.get("category_id"),
    email:         formData.get("email"),
    phone:         formData.get("phone"),
    address:       formData.get("address"),
    description:   formData.get("description"),
    website:       formData.get("website"),
    image_url:     formData.get("image_url"),
  };

  // Collect optional extras not in Zod schema
  const neighborhood = (formData.get("neighborhood") as string)?.trim() || null;
  const hours        = (formData.get("hours")        as string)?.trim() || null;
  const facebook     = (formData.get("facebook")     as string)?.trim() || null;
  const instagram    = (formData.get("instagram")    as string)?.trim() || null;
  const twitter      = (formData.get("twitter")      as string)?.trim() || null;
  const social_links = { facebook, instagram, twitter };

  const parsed = providerRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: formatZodErrors(parsed.error) };
  }

  const data = parsed.data;
  const editId = (formData.get("id") as string)?.trim() || null;

  const payload = {
    business_name: data.business_name,
    business_type: data.business_type || null,
    category_id:   data.category_id   || null,
    email:         data.email,
    phone:         data.phone         || null,
    address:       data.address       || null,
    description:   data.description   || null,
    website:       data.website       || null,
    image_url:     data.image_url     || null,
    neighborhood,
    hours,
    social_links,
  };

  // ── Update existing request if editing ──────────────────────
  if (editId) {
    // Verify caller owns the request and it is in an editable state
    const { data: existing, error: fetchErr } = await supabase
      .from("provider_requests")
      .select("id, user_id, status")
      .eq("id", editId)
      .single();

    if (fetchErr || !existing) {
      return { error: "Request not found." };
    }
    if (existing.user_id !== user.id) {
      return { error: "You cannot edit someone else's submission." };
    }
    if (!["pending", "needs_changes"].includes(existing.status)) {
      return { error: "This submission can no longer be edited." };
    }

    const { error: updateErr } = await supabase
      .from("provider_requests")
      .update({
        ...payload,
        // Re-queue for review; clear old admin feedback so the card reflects the new state
        status:      "pending",
        admin_notes: null,
        updated_at:  new Date().toISOString(),
      })
      .eq("id", editId)
      .eq("user_id", user.id);

    if (updateErr) {
      console.error("[submitProviderRequest:update]", updateErr.message);
      return { error: "Could not save your changes. Please try again." };
    }

    redirect("/dashboard/submissions?updated=1");
  }

  // ── Rate limit: max 5 pending provider requests per user ────
  const { count } = await supabase
    .from("provider_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "pending");

  if ((count ?? 0) >= 5) {
    return { error: "You already have 5 pending business requests. Please wait for them to be reviewed before submitting more." };
  }

  // ── Insert (new submission) ─────────────────────────────────
  const { error: dbError } = await supabase.from("provider_requests").insert({
    user_id: user.id,
    ...payload,
    status:  "pending",
  });

  if (dbError) {
    console.error("[submitProviderRequest]", dbError.message);
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/services/submit?success=1");
}
