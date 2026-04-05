"use server";

import { createClient } from "@/lib/supabase/server";

export async function trackRedemption(couponId: string): Promise<void> {
  const supabase = createClient();
  await supabase.rpc("increment_coupon_redemption", { coupon_id: couponId });
}
