"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendEmail, getAdminEmail, adminResubmittedHtml } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://catchcolumbus.com";

type RequestType = "event" | "provider" | "coupon";

/**
 * Reset a needs_changes request back to pending so the admin re-reviews it.
 * Only the owner of the request may call this, and only when status = 'needs_changes'.
 */
export async function resubmitRequest(
  id: string,
  type: RequestType
): Promise<{ error?: string; success?: boolean }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in." };

  const table =
    type === "event"
      ? "event_requests"
      : type === "provider"
      ? "provider_requests"
      : "coupon_requests";

  // Verify ownership and current status before updating
  // Also fetch name + email columns for the notification email
  const { data: existing, error: fetchError } = await supabase
    .from(table)
    .select("id, status, user_id, email, event_name, business_name, product_service_name")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return { error: "Request not found." };
  }

  if (existing.user_id !== user.id) {
    return { error: "You do not have permission to resubmit this request." };
  }

  if (existing.status !== "needs_changes") {
    return { error: "Only requests with 'needs changes' status can be resubmitted." };
  }

  const { error: updateError } = await supabase
    .from(table)
    .update({ status: "pending", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) {
    console.error("[resubmitRequest]", updateError.message);
    return { error: "Could not resubmit. Please try again." };
  }

  // ── Notify admin that listing is resubmitted ──────────────
  const adminEmail = getAdminEmail();
  if (adminEmail) {
    const listingName: string =
      type === "event"    ? (existing.event_name            ?? "Event") :
      type === "provider" ? (existing.business_name         ?? "Business") :
                            (existing.product_service_name  ?? "Coupon");
    const submitterEmail: string = existing.email ?? "";
    const adminPanelUrl =
      type === "event"    ? `${SITE_URL}/admin/events` :
      type === "provider" ? `${SITE_URL}/admin/services` :
                            `${SITE_URL}/admin/coupons`;

    sendEmail({
      to: adminEmail,
      subject: `${type === "event" ? "Event" : type === "provider" ? "Business Listing" : "Coupon"} Resubmitted — ${listingName}`,
      html: adminResubmittedHtml({ type, listingName, submitterEmail, adminPanelUrl }),
    }).catch((err) => console.error("[resubmitRequest] email failed:", err));
  }

  revalidatePath("/dashboard/submissions");
  return { success: true };
}
