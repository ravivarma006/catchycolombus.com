"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail, welcomeEmailHtml } from "@/lib/email";

export async function subscribe(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = createClient();

  // Rate limit: max 10 subscriptions per minute globally
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
  const { count: recentCount } = await supabase
    .from("subscribers")
    .select("id", { count: "exact", head: true })
    .gte("created_at", oneMinuteAgo);
  if ((recentCount ?? 0) >= 10) {
    return { error: "Too many requests. Please try again later." };
  }

  const { error } = await supabase.from("subscribers").insert({ email });

  if (error) {
    // Unique constraint violation = already subscribed
    if (error.code === "23505") {
      return { success: true }; // Treat as success silently
    }
    console.error("[subscribe]", error.message);
    return { error: "Something went wrong. Please try again." };
  }

  // Send welcome email (fire-and-forget — don't block on email failure)
  sendEmail({
    to: email,
    subject: "Welcome to Catch Columbus! 🎉",
    html: welcomeEmailHtml(email),
  }).catch((err) => console.error("[subscribe] welcome email failed:", err));

  return { success: true };
}
