"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribe(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = createClient();

  const { error } = await supabase.from("subscribers").insert({ email });

  if (error) {
    // Unique constraint violation = already subscribed
    if (error.code === "23505") {
      return { success: true }; // Treat as success silently
    }
    console.error("[subscribe]", error.message);
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
