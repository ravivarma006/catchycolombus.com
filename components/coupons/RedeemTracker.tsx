"use client";

import { useCallback } from "react";
import { trackRedemption } from "@/app/coupons/[id]/actions";
import { CouponCopyBox } from "./CouponCard";

interface RedeemTrackerProps {
  couponId: string;
  code: string;
}

export default function RedeemTracker({ couponId, code }: RedeemTrackerProps) {
  const handleCopy = useCallback(() => {
    // Fire-and-forget — track redemption when user copies the code
    trackRedemption(couponId).catch(() => {
      // silently ignore tracking failures
    });
  }, [couponId]);

  return <CouponCopyBox code={code} large onCopy={handleCopy} />;
}
