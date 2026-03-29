"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

function revalidate() {
  revalidatePath("/admin/hero");
  revalidatePath("/admin");
  revalidatePath("/");
}

// ─────────────────────────────────────────
// SLIDES — CREATE
// ─────────────────────────────────────────
export async function createHeroSlide(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const image_url = (formData.get("image_url") as string)?.trim();
  const thumb_url = (formData.get("thumb_url") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const tag = (formData.get("tag") as string)?.trim();
  const headlineRaw = (formData.get("headline") as string) || "[]";
  const subtitle = (formData.get("subtitle") as string)?.trim();
  const overlay_from = (formData.get("overlay_from") as string)?.trim() || "rgba(0,20,50,0.48)";
  const overlay_to = (formData.get("overlay_to") as string)?.trim() || "rgba(0,20,50,0.50)";

  let headline: string[];
  try { headline = JSON.parse(headlineRaw); } catch { return { error: "Invalid headline format." }; }
  if (!headline.length) return { error: "At least one headline line is required." };
  if (!image_url) return { error: "Image is required." };
  if (!thumb_url) return { error: "Thumbnail is required." };
  if (!location) return { error: "Location is required." };
  if (!tag) return { error: "Tag is required." };
  if (!subtitle) return { error: "Subtitle is required." };

  // Get next display_order
  const { data: last } = await supabase
    .from("hero_slides")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const display_order = (last?.display_order ?? -1) + 1;

  const { error } = await supabase.from("hero_slides").insert({
    image_url, thumb_url, location, tag, headline, subtitle,
    overlay_from, overlay_to, is_active: true, display_order,
  });

  if (error) {
    console.error("[createHeroSlide]", error.message);
    return { error: "Could not create slide." };
  }

  revalidate();
  return { success: true };
}

// ─────────────────────────────────────────
// SLIDES — UPDATE
// ─────────────────────────────────────────
export async function updateHeroSlide(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const image_url = (formData.get("image_url") as string)?.trim();
  const thumb_url = (formData.get("thumb_url") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const tag = (formData.get("tag") as string)?.trim();
  const headlineRaw = (formData.get("headline") as string) || "[]";
  const subtitle = (formData.get("subtitle") as string)?.trim();
  const overlay_from = (formData.get("overlay_from") as string)?.trim() || "rgba(0,20,50,0.48)";
  const overlay_to = (formData.get("overlay_to") as string)?.trim() || "rgba(0,20,50,0.50)";

  let headline: string[];
  try { headline = JSON.parse(headlineRaw); } catch { return { error: "Invalid headline format." }; }
  if (!headline.length) return { error: "At least one headline line is required." };
  if (!image_url) return { error: "Image is required." };
  if (!thumb_url) return { error: "Thumbnail is required." };
  if (!location) return { error: "Location is required." };
  if (!tag) return { error: "Tag is required." };
  if (!subtitle) return { error: "Subtitle is required." };

  const { error } = await supabase
    .from("hero_slides")
    .update({
      image_url, thumb_url, location, tag, headline, subtitle,
      overlay_from, overlay_to, updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("[updateHeroSlide]", error.message);
    return { error: "Could not update slide." };
  }

  revalidate();
  return { success: true };
}

// ─────────────────────────────────────────
// SLIDES — TOGGLE ACTIVE
// ─────────────────────────────────────────
export async function toggleHeroSlideActive(
  id: string,
  currentActive: boolean
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("hero_slides")
    .update({ is_active: !currentActive })
    .eq("id", id);

  if (error) {
    console.error("[toggleHeroSlideActive]", error.message);
    return { error: "Could not toggle slide." };
  }

  revalidate();
  return { success: true };
}

// ─────────────────────────────────────────
// SLIDES — DELETE
// ─────────────────────────────────────────
export async function deleteHeroSlide(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("hero_slides")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[deleteHeroSlide]", error.message);
    return { error: "Could not delete slide." };
  }

  revalidate();
  return { success: true };
}

// ─────────────────────────────────────────
// SLIDES — REORDER (move up/down)
// ─────────────────────────────────────────
export async function reorderHeroSlides(
  orderedIds: string[]
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("hero_slides")
      .update({ display_order: i })
      .eq("id", orderedIds[i]);

    if (error) {
      console.error("[reorderHeroSlides]", error.message);
      return { error: "Could not reorder slides." };
    }
  }

  revalidate();
  return { success: true };
}

// ─────────────────────────────────────────
// STATS — CREATE
// ─────────────────────────────────────────
export async function createHeroStat(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const value = (formData.get("value") as string)?.trim();
  const label = (formData.get("label") as string)?.trim();

  if (!value) return { error: "Value is required." };
  if (!label) return { error: "Label is required." };

  const { data: last } = await supabase
    .from("hero_stats")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const display_order = (last?.display_order ?? -1) + 1;

  const { error } = await supabase.from("hero_stats").insert({
    value, label, display_order, is_active: true,
  });

  if (error) {
    console.error("[createHeroStat]", error.message);
    return { error: "Could not create stat." };
  }

  revalidate();
  return { success: true };
}

// ─────────────────────────────────────────
// STATS — UPDATE
// ─────────────────────────────────────────
export async function updateHeroStat(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const value = (formData.get("value") as string)?.trim();
  const label = (formData.get("label") as string)?.trim();

  if (!value) return { error: "Value is required." };
  if (!label) return { error: "Label is required." };

  const { error } = await supabase
    .from("hero_stats")
    .update({ value, label })
    .eq("id", id);

  if (error) {
    console.error("[updateHeroStat]", error.message);
    return { error: "Could not update stat." };
  }

  revalidate();
  return { success: true };
}

// ─────────────────────────────────────────
// STATS — TOGGLE ACTIVE
// ─────────────────────────────────────────
export async function toggleHeroStatActive(
  id: string,
  currentActive: boolean
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("hero_stats")
    .update({ is_active: !currentActive })
    .eq("id", id);

  if (error) {
    console.error("[toggleHeroStatActive]", error.message);
    return { error: "Could not toggle stat." };
  }

  revalidate();
  return { success: true };
}

// ─────────────────────────────────────────
// STATS — DELETE
// ─────────────────────────────────────────
export async function deleteHeroStat(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("hero_stats")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[deleteHeroStat]", error.message);
    return { error: "Could not delete stat." };
  }

  revalidate();
  return { success: true };
}
