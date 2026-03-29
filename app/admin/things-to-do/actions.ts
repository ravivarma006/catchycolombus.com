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

function revalidate() {
  revalidatePath("/admin/things-to-do");
  revalidatePath("/admin");
  revalidatePath("/things-to-do");
  revalidatePath("/");
}

// ═══════════════════════════════════════════
// CATEGORY CRUD
// ═══════════════════════════════════════════

export async function createCategory(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const name = (formData.get("name") as string)?.trim();
  const icon = (formData.get("icon") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const image_url = (formData.get("image_url") as string)?.trim() || null;
  const display_order = parseInt(formData.get("display_order") as string) || 0;

  if (!name) return { error: "Category name is required." };

  const slug = toSlug(name);

  const { error } = await supabase.from("activity_categories").insert({
    name,
    slug,
    icon,
    description,
    image_url,
    display_order,
    is_active: true,
  });

  if (error) {
    if (error.code === "23505") return { error: "A category with this name already exists." };
    console.error("[createCategory]", error.message);
    return { error: "Could not create category." };
  }

  revalidate();
  return { success: true };
}

export async function updateCategory(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const name = (formData.get("name") as string)?.trim();
  const icon = (formData.get("icon") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const image_url = (formData.get("image_url") as string)?.trim() || null;
  const display_order = parseInt(formData.get("display_order") as string) || 0;

  if (!name) return { error: "Category name is required." };

  const { error } = await supabase
    .from("activity_categories")
    .update({ name, slug: toSlug(name), icon, description, image_url, display_order })
    .eq("id", id);

  if (error) {
    console.error("[updateCategory]", error.message);
    return { error: "Could not update category." };
  }

  revalidate();
  return { success: true };
}

export async function toggleCategoryActive(
  id: string,
  currentActive: boolean
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("activity_categories")
    .update({ is_active: !currentActive })
    .eq("id", id);

  if (error) {
    console.error("[toggleCategoryActive]", error.message);
    return { error: "Could not toggle category." };
  }

  revalidate();
  return { success: true };
}

export async function deleteCategory(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("activity_categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[deleteCategory]", error.message);
    return { error: "Could not delete category." };
  }

  revalidate();
  return { success: true };
}

// ═══════════════════════════════════════════
// ACTIVITY CRUD
// ═══════════════════════════════════════════

export async function createActivity(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const name = (formData.get("name") as string)?.trim();
  const category_id = (formData.get("category_id") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim() || null;
  const neighborhood = (formData.get("neighborhood") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const website = (formData.get("website") as string)?.trim() || null;
  const image_url = (formData.get("image_url") as string)?.trim() || null;
  const hours = (formData.get("hours") as string)?.trim() || null;
  const price_range = (formData.get("price_range") as string)?.trim() || null;
  const is_featured = formData.get("is_featured") === "true";
  const facebook = (formData.get("facebook") as string)?.trim() || "";
  const instagram = (formData.get("instagram") as string)?.trim() || "";
  const twitter = (formData.get("twitter") as string)?.trim() || "";

  if (!name) return { error: "Activity name is required." };

  const slug = toSlug(name);
  const social_links: Record<string, string> = {};
  if (facebook) social_links.facebook = facebook;
  if (instagram) social_links.instagram = instagram;
  if (twitter) social_links.twitter = twitter;

  const { error } = await supabase.from("activities").insert({
    name,
    slug,
    category_id,
    description,
    address,
    neighborhood,
    phone,
    email,
    website,
    image_url,
    hours,
    price_range,
    is_featured,
    is_active: true,
    social_links,
  });

  if (error) {
    if (error.code === "23505") return { error: "An activity with this name already exists." };
    console.error("[createActivity]", error.message);
    return { error: "Could not create activity." };
  }

  revalidate();
  return { success: true };
}

export async function updateActivity(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const name = (formData.get("name") as string)?.trim();
  const category_id = (formData.get("category_id") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim() || null;
  const neighborhood = (formData.get("neighborhood") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const website = (formData.get("website") as string)?.trim() || null;
  const image_url = (formData.get("image_url") as string)?.trim() || null;
  const hours = (formData.get("hours") as string)?.trim() || null;
  const price_range = (formData.get("price_range") as string)?.trim() || null;
  const is_featured = formData.get("is_featured") === "true";
  const facebook = (formData.get("facebook") as string)?.trim() || "";
  const instagram = (formData.get("instagram") as string)?.trim() || "";
  const twitter = (formData.get("twitter") as string)?.trim() || "";

  if (!name) return { error: "Activity name is required." };

  const social_links: Record<string, string> = {};
  if (facebook) social_links.facebook = facebook;
  if (instagram) social_links.instagram = instagram;
  if (twitter) social_links.twitter = twitter;

  const { error } = await supabase
    .from("activities")
    .update({
      name,
      slug: toSlug(name),
      category_id,
      description,
      address,
      neighborhood,
      phone,
      email,
      website,
      image_url,
      hours,
      price_range,
      is_featured,
      social_links,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("[updateActivity]", error.message);
    return { error: "Could not update activity." };
  }

  revalidate();
  return { success: true };
}

export async function toggleActivityActive(
  id: string,
  currentActive: boolean
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("activities")
    .update({ is_active: !currentActive, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[toggleActivityActive]", error.message);
    return { error: "Could not toggle activity." };
  }

  revalidate();
  return { success: true };
}

export async function toggleActivityFeatured(
  id: string,
  currentFeatured: boolean
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("activities")
    .update({ is_featured: !currentFeatured, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[toggleActivityFeatured]", error.message);
    return { error: "Could not toggle featured." };
  }

  revalidate();
  return { success: true };
}

export async function deleteActivity(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[deleteActivity]", error.message);
    return { error: "Could not delete activity." };
  }

  revalidate();
  return { success: true };
}
