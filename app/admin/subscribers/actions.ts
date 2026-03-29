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

export async function toggleSubscriberActive(
  id: string,
  currentActive: boolean
): Promise<{ error?: string; success?: boolean }> {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("subscribers")
    .update({ is_active: !currentActive })
    .eq("id", id);

  if (error) {
    console.error("[toggleSubscriberActive]", error.message);
    return { error: "Could not update subscriber." };
  }

  revalidatePath("/admin/subscribers");
  revalidatePath("/admin");
  return { success: true };
}
