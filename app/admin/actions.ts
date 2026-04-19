"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ─────────────────────────────────────────
// Guard: ensure caller is an admin
// ─────────────────────────────────────────
async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, error: "Not authenticated." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { supabase, user: null, error: "Access denied." };
  }

  return { supabase, user, error: null };
}

// ─────────────────────────────────────────
// Slug helper
// ─────────────────────────────────────────
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Make slug unique by appending a short timestamp suffix if needed
async function uniqueSlug(
  supabase: ReturnType<typeof createClient>,
  table: string,
  base: string
): Promise<string> {
  const slug = toSlug(base);
  const { data } = await supabase
    .from(table)
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return slug;
  return `${slug}-${Date.now().toString(36)}`;
}

// ─────────────────────────────────────────
// REJECT (all three types)
// ─────────────────────────────────────────
export async function rejectRequest(
  id: string,
  type: "event" | "provider" | "coupon",
  adminNotes: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const table =
    type === "event"
      ? "event_requests"
      : type === "provider"
      ? "provider_requests"
      : "coupon_requests";

  const { error } = await supabase
    .from(table)
    .update({
      status: "rejected",
      admin_notes: adminNotes.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("[rejectRequest]", error.message);
    return { error: "Could not reject request." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${type === "event" ? "events" : type === "provider" ? "services" : "coupons"}`);
  return { success: true };
}

// ─────────────────────────────────────────
// NEEDS CHANGES (all three types)
// ─────────────────────────────────────────
export async function requestChanges(
  id: string,
  type: "event" | "provider" | "coupon",
  adminNotes: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  if (!adminNotes.trim()) {
    return { error: "Please enter notes explaining what needs to change." };
  }

  const table =
    type === "event"
      ? "event_requests"
      : type === "provider"
      ? "provider_requests"
      : "coupon_requests";

  const { error } = await supabase
    .from(table)
    .update({
      status: "needs_changes",
      admin_notes: adminNotes.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("[requestChanges]", error.message);
    return { error: "Could not update request." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${type === "event" ? "events" : type === "provider" ? "services" : "coupons"}`);
  return { success: true };
}

// ─────────────────────────────────────────
// APPROVE EVENT REQUEST
// ─────────────────────────────────────────
export async function approveEventRequest(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  // Fetch the request
  const { data: req, error: fetchErr } = await supabase
    .from("event_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !req) return { error: "Request not found." };

  const slug = await uniqueSlug(supabase, "events", req.event_name);

  // Insert into events table
  const { error: insertErr } = await supabase.from("events").insert({
    title:       req.event_name,
    slug,
    event_date:  req.event_date,
    event_time:  req.event_time,
    location:    req.address,
    description: req.description,
    image_url:   req.image_url,
    price:       req.price ?? "Free",
    website:     req.website,
    is_featured: false,
    is_active:   true,
    created_by:  req.user_id,
  });

  if (insertErr) {
    console.error("[approveEventRequest insert]", insertErr.message);
    return { error: `Could not create event listing: ${insertErr.message}` };
  }

  // Mark request approved
  await supabase
    .from("event_requests")
    .update({ status: "approved", admin_notes: null, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: true };
}

// ─────────────────────────────────────────
// APPROVE PROVIDER REQUEST
// ─────────────────────────────────────────
export async function approveProviderRequest(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { data: req, error: fetchErr } = await supabase
    .from("provider_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !req) return { error: "Request not found." };

  const slug = await uniqueSlug(supabase, "service_providers", req.business_name);

  const { error: insertErr } = await supabase.from("service_providers").insert({
    category_id:  req.category_id,
    name:         req.business_name,
    slug,
    phone:        req.phone,
    email:        req.email,
    address:      req.address,
    description:  req.description,
    website:      req.website,
    image_url:    req.image_url,
    social_links: req.social_links ?? {},
    user_id:      req.user_id ?? null,   // link listing back to its owner
    is_active:    true,
    approved_at:  new Date().toISOString(),
  });

  if (insertErr) {
    console.error("[approveProviderRequest insert]", insertErr.message);
    return { error: `Could not create business listing: ${insertErr.message}` };
  }

  await supabase
    .from("provider_requests")
    .update({ status: "approved", admin_notes: null, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

// ─────────────────────────────────────────
// APPROVE COUPON REQUEST
// ─────────────────────────────────────────
export async function approveCouponRequest(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { data: req, error: fetchErr } = await supabase
    .from("coupon_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !req) return { error: "Request not found." };

  const { error: insertErr } = await supabase.from("coupons").insert({
    category_id:          req.category_id,
    product_service_name: req.product_service_name,
    phone:                req.phone,
    email:                req.email,
    address:              req.address,
    description:          req.description,
    coupon_code:          req.coupon_code,
    website:              req.website,
    image_url:            req.image_url,
    social_links:         req.social_links ?? {},
    is_active:            true,
    approved_at:          new Date().toISOString(),
  });

  if (insertErr) {
    console.error("[approveCouponRequest insert]", insertErr.message);
    return { error: `Could not create coupon listing: ${insertErr.message}` };
  }

  await supabase
    .from("coupon_requests")
    .update({ status: "approved", admin_notes: null, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/admin/coupons");
  revalidatePath("/coupons");
  return { success: true };
}

// ═══════════════════════════════════════════
// MANAGE APPROVED EVENTS
// ═══════════════════════════════════════════

export async function updateEvent(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Event title is required." };

  const { error } = await supabase
    .from("events")
    .update({
      title,
      slug: toSlug(title),
      event_date: (formData.get("event_date") as string)?.trim() || null,
      event_time: (formData.get("event_time") as string)?.trim() || null,
      location: (formData.get("location") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      price: (formData.get("price") as string)?.trim() || null,
      website: (formData.get("website") as string)?.trim() || null,
      image_url: (formData.get("image_url") as string)?.trim() || null,
      category: (formData.get("category") as string)?.trim() || null,
      is_featured: formData.get("is_featured") === "true",
    })
    .eq("id", id);

  if (error) {
    console.error("[updateEvent]", error.message);
    return { error: "Could not update event." };
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

export async function createEvent(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Event title is required." };

  const slug = await uniqueSlug(supabase, "events", title);

  const { error } = await supabase
    .from("events")
    .insert({
      title,
      slug,
      event_date: (formData.get("event_date") as string)?.trim() || null,
      event_time: (formData.get("event_time") as string)?.trim() || null,
      location: (formData.get("location") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      price: (formData.get("price") as string)?.trim() || null,
      website: (formData.get("website") as string)?.trim() || null,
      image_url: (formData.get("image_url") as string)?.trim() || null,
      category: (formData.get("category") as string)?.trim() || null,
      is_featured: formData.get("is_featured") === "true",
      is_active: true,
    });

  if (error) {
    console.error("[createEvent]", error.message);
    return { error: "Could not create event." };
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

export async function toggleEventActive(
  id: string,
  currentActive: boolean
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("events")
    .update({ is_active: !currentActive })
    .eq("id", id);

  if (error) return { error: "Could not toggle event." };

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

export async function deleteEvent(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { error: "Could not delete event." };

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

// ═══════════════════════════════════════════
// MANAGE APPROVED SERVICE PROVIDERS
// ═══════════════════════════════════════════

export async function updateProvider(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Business name is required." };

  const facebook = (formData.get("facebook") as string)?.trim() || "";
  const instagram = (formData.get("instagram") as string)?.trim() || "";
  const twitter = (formData.get("twitter") as string)?.trim() || "";
  const social_links: Record<string, string> = {};
  if (facebook) social_links.facebook = facebook;
  if (instagram) social_links.instagram = instagram;
  if (twitter) social_links.twitter = twitter;

  const { error } = await supabase
    .from("service_providers")
    .update({
      name,
      slug: toSlug(name),
      category_id: (formData.get("category_id") as string)?.trim() || null,
      phone: (formData.get("phone") as string)?.trim() || null,
      email: (formData.get("email") as string)?.trim() || null,
      address: (formData.get("address") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      website: (formData.get("website") as string)?.trim() || null,
      image_url: (formData.get("image_url") as string)?.trim() || null,
      social_links,
    })
    .eq("id", id);

  if (error) {
    console.error("[updateProvider]", error.message);
    return { error: "Could not update provider." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

export async function toggleProviderActive(
  id: string,
  currentActive: boolean
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("service_providers")
    .update({ is_active: !currentActive })
    .eq("id", id);

  if (error) return { error: "Could not toggle provider." };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

export async function deleteProvider(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase.from("service_providers").delete().eq("id", id);
  if (error) return { error: "Could not delete provider." };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

// ═══════════════════════════════════════════
// MANAGE APPROVED COUPONS
// ═══════════════════════════════════════════

export async function updateCoupon(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const product_service_name = (formData.get("product_service_name") as string)?.trim();
  if (!product_service_name) return { error: "Product/service name is required." };

  const { error } = await supabase
    .from("coupons")
    .update({
      product_service_name,
      category_id: (formData.get("category_id") as string)?.trim() || null,
      coupon_code: (formData.get("coupon_code") as string)?.trim() || null,
      phone: (formData.get("phone") as string)?.trim() || null,
      email: (formData.get("email") as string)?.trim() || null,
      address: (formData.get("address") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      website: (formData.get("website") as string)?.trim() || null,
      image_url: (formData.get("image_url") as string)?.trim() || null,
      is_premium: formData.get("is_premium") === "true",
      expires_at: (formData.get("expires_at") as string)?.trim() || null,
      max_redemptions: parseInt(formData.get("max_redemptions") as string) || null,
    })
    .eq("id", id);

  if (error) {
    console.error("[updateCoupon]", error.message);
    return { error: "Could not update coupon." };
  }

  revalidatePath("/admin/coupons");
  revalidatePath("/coupons");
  return { success: true };
}

export async function toggleCouponActive(
  id: string,
  currentActive: boolean
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("coupons")
    .update({ is_active: !currentActive })
    .eq("id", id);

  if (error) return { error: "Could not toggle coupon." };

  revalidatePath("/admin/coupons");
  revalidatePath("/coupons");
  return { success: true };
}

export async function deleteCoupon(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return { error: "Could not delete coupon." };

  revalidatePath("/admin/coupons");
  revalidatePath("/coupons");
  return { success: true };
}

// ═══════════════════════════════════════════
// SERVICE CATEGORIES MANAGEMENT
// ═══════════════════════════════════════════

export async function createServiceCategory(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Category name is required." };

  const { error } = await supabase.from("service_categories").insert({
    name,
    slug: toSlug(name),
    icon: (formData.get("icon") as string)?.trim() || null,
    description: (formData.get("description") as string)?.trim() || null,
    image_url: (formData.get("image_url") as string)?.trim() || null,
    display_order: parseInt(formData.get("display_order") as string) || 0,
    is_active: true,
  });

  if (error) {
    if (error.code === "23505") return { error: "A category with this name already exists." };
    return { error: "Could not create category." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

export async function updateServiceCategory(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Category name is required." };

  const { error } = await supabase
    .from("service_categories")
    .update({
      name,
      slug: toSlug(name),
      icon: (formData.get("icon") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      image_url: (formData.get("image_url") as string)?.trim() || null,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    })
    .eq("id", id);

  if (error) return { error: "Could not update category." };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

export async function toggleServiceCategoryActive(
  id: string,
  currentActive: boolean
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("service_categories")
    .update({ is_active: !currentActive })
    .eq("id", id);

  if (error) return { error: "Could not toggle category." };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

export async function deleteServiceCategory(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { count } = await supabase
    .from("service_providers")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id)
    .eq("is_active", true);
  if ((count ?? 0) > 0) {
    return { error: `Cannot delete — ${count} active provider(s) still use this category.` };
  }

  const { error } = await supabase.from("service_categories").delete().eq("id", id);
  if (error) return { error: "Could not delete category." };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

// ═══════════════════════════════════════════
// COUPON CATEGORIES MANAGEMENT
// ═══════════════════════════════════════════

export async function createCouponCategory(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Category name is required." };

  const { error } = await supabase.from("coupon_categories").insert({
    name,
    slug: toSlug(name),
    icon: (formData.get("icon") as string)?.trim() || null,
    description: (formData.get("description") as string)?.trim() || null,
    display_order: parseInt(formData.get("display_order") as string) || 0,
    is_active: true,
  });

  if (error) {
    if (error.code === "23505") return { error: "A category with this name already exists." };
    return { error: "Could not create category." };
  }

  revalidatePath("/admin/coupons");
  revalidatePath("/coupons");
  return { success: true };
}

export async function updateCouponCategory(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Category name is required." };

  const { error } = await supabase
    .from("coupon_categories")
    .update({
      name,
      slug: toSlug(name),
      icon: (formData.get("icon") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    })
    .eq("id", id);

  if (error) return { error: "Could not update category." };

  revalidatePath("/admin/coupons");
  revalidatePath("/coupons");
  return { success: true };
}

export async function toggleCouponCategoryActive(
  id: string,
  currentActive: boolean
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("coupon_categories")
    .update({ is_active: !currentActive })
    .eq("id", id);

  if (error) return { error: "Could not toggle category." };

  revalidatePath("/admin/coupons");
  revalidatePath("/coupons");
  return { success: true };
}

export async function deleteCouponCategory(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { count } = await supabase
    .from("coupons")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id)
    .eq("is_active", true);
  if ((count ?? 0) > 0) {
    return { error: `Cannot delete — ${count} active coupon(s) still use this category.` };
  }

  const { error } = await supabase.from("coupon_categories").delete().eq("id", id);
  if (error) return { error: "Could not delete category." };

  revalidatePath("/admin/coupons");
  revalidatePath("/coupons");
  return { success: true };
}
