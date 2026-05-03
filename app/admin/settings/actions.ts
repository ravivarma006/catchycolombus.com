"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "Not authenticated." };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { supabase, error: "Access denied." };
  return { supabase, error: null };
}

function hexToRgbParts(hex: string): string | null {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export async function saveBrandColors(
  primaryColor: string,
  accentColor: string
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const primary = primaryColor.trim().toLowerCase();
  const accent  = accentColor.trim().toLowerCase();

  if (!/^#[0-9a-fA-F]{6}$/.test(primary)) return { error: "Invalid primary color format." };
  if (!/^#[0-9a-fA-F]{6}$/.test(accent))  return { error: "Invalid accent color format." };

  const { error } = await supabase
    .from("site_settings")
    .update({ primary_color: primary, accent_color: accent, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    console.error("[saveBrandColors]", error.message);
    return { error: "Could not save brand colors." };
  }

  // Revalidate entire site so the layout re-fetches colors
  revalidatePath("/", "layout");
  return { success: true };
}
