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

  const parsed = providerRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: formatZodErrors(parsed.error) };
  }

  const data = parsed.data;

  // ── Rate limit: max 5 pending provider requests per user ────
  const { count } = await supabase
    .from("provider_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "pending");

  if ((count ?? 0) >= 5) {
    return { error: "You already have 5 pending business requests. Please wait for them to be reviewed before submitting more." };
  }

  // ── Insert ──────────────────────────────────────────────────
  const { error: dbError } = await supabase.from("provider_requests").insert({
    user_id:       user.id,
    business_name: data.business_name,
    business_type: data.business_type || null,
    category_id:   data.category_id   || null,
    email:         data.email,
    phone:         data.phone         || null,
    address:       data.address       || null,
    description:   data.description   || null,
    website:       data.website       || null,
    image_url:     data.image_url     || null,
    status:        "pending",
  });

  if (dbError) {
    console.error("[submitProviderRequest]", dbError.message);
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/services/submit?success=1");
}
