"use server";

import { createClient } from "@/lib/supabase/server";

export async function unsubscribe(
  email: string
): Promise<{ success: boolean; error?: string }> {
  if (!email || typeof email !== "string") {
    return { success: false, error: "Invalid email address." };
  }

  const supabase = createClient();

  const { error } = await supabase
    .from("subscribers")
    .update({ is_active: false })
    .eq("email", email.toLowerCase().trim());

  if (error) {
    console.error("[unsubscribe]", error.message);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
