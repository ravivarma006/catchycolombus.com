"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { couponRequestSchema, formatZodErrors } from "@/lib/validations";
import { sendEmail, getAdminEmail, adminNewListingHtml } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://catchcolumbus.com";

export async function submitCouponRequest(
  _prev: { error: string },
  formData: FormData
): Promise<{ error: string }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to submit a coupon." };
  }

  // ── Zod validation ──────────────────────────────────────────
  const raw = {
    product_service_name: formData.get("product_service_name"),
    category_id:          formData.get("category_id"),
    email:                formData.get("email"),
    phone:                formData.get("phone"),
    address:              formData.get("address"),
    description:          formData.get("description"),
    coupon_code:          formData.get("coupon_code"),
    website:              formData.get("website"),
    image_url:            formData.get("image_url"),
  };

  const parsed = couponRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: formatZodErrors(parsed.error) };
  }

  const data = parsed.data;

  // ── Rate limit: max 5 pending coupon requests per user ──────
  const { count } = await supabase
    .from("coupon_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "pending");

  if ((count ?? 0) >= 5) {
    return { error: "You already have 5 pending coupon requests. Please wait for them to be reviewed before submitting more." };
  }

  // ── Insert ──────────────────────────────────────────────────
  const { error: dbError } = await supabase.from("coupon_requests").insert({
    user_id:              user.id,
    product_service_name: data.product_service_name,
    category_id:          data.category_id   || null,
    email:                data.email,
    phone:                data.phone          || null,
    address:              data.address        || null,
    description:          data.description    || null,
    coupon_code:          data.coupon_code    || null,
    website:              data.website        || null,
    image_url:            data.image_url      || null,
    status:               "pending",
  });

  if (dbError) {
    console.error("[submitCouponRequest]", dbError.message);
    return { error: "Something went wrong. Please try again." };
  }

  // ── Notify admin of new submission ────────────────────────
  const adminEmail = getAdminEmail();
  if (adminEmail) {
    sendEmail({
      to: adminEmail,
      subject: `New Coupon Submitted — ${data.product_service_name}`,
      html: adminNewListingHtml({
        type: "coupon",
        listingName: data.product_service_name,
        submitterEmail: data.email,
        adminPanelUrl: `${SITE_URL}/admin/coupons`,
      }),
    }).catch((err) => console.error("[submitCouponRequest] email failed:", err));
  }

  redirect("/coupons/submit?success=1");
}
