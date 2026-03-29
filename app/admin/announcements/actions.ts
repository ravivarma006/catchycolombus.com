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

function revalidate() {
  revalidatePath("/admin/announcements");
  revalidatePath("/admin");
  revalidatePath("/announcements");
  revalidatePath("/");
}

// ─────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────
export async function createAnnouncement(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim() || null;
  const image_url = (formData.get("image_url") as string)?.trim() || null;
  const is_pinned = formData.get("is_pinned") === "true";

  if (!title) return { error: "Title is required." };

  const { error } = await supabase.from("announcements").insert({
    title,
    content,
    image_url,
    is_pinned,
    is_active: true,
  });

  if (error) {
    console.error("[createAnnouncement]", error.message);
    return { error: "Could not create announcement." };
  }

  revalidate();
  return { success: true };
}

// ─────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────
export async function updateAnnouncement(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim() || null;
  const image_url = (formData.get("image_url") as string)?.trim() || null;
  const is_pinned = formData.get("is_pinned") === "true";

  if (!title) return { error: "Title is required." };

  const { error } = await supabase
    .from("announcements")
    .update({ title, content, image_url, is_pinned })
    .eq("id", id);

  if (error) {
    console.error("[updateAnnouncement]", error.message);
    return { error: "Could not update announcement." };
  }

  revalidate();
  return { success: true };
}

// ─────────────────────────────────────────
// TOGGLE ACTIVE
// ─────────────────────────────────────────
export async function toggleAnnouncementActive(
  id: string,
  currentActive: boolean
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("announcements")
    .update({ is_active: !currentActive })
    .eq("id", id);

  if (error) {
    console.error("[toggleAnnouncementActive]", error.message);
    return { error: "Could not toggle announcement." };
  }

  revalidate();
  return { success: true };
}

// ─────────────────────────────────────────
// TOGGLE PINNED
// ─────────────────────────────────────────
export async function toggleAnnouncementPinned(
  id: string,
  currentPinned: boolean
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("announcements")
    .update({ is_pinned: !currentPinned })
    .eq("id", id);

  if (error) {
    console.error("[toggleAnnouncementPinned]", error.message);
    return { error: "Could not toggle pin." };
  }

  revalidate();
  return { success: true };
}

// ─────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────
export async function deleteAnnouncement(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[deleteAnnouncement]", error.message);
    return { error: "Could not delete announcement." };
  }

  revalidate();
  return { success: true };
}
