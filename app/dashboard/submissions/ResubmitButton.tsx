"use client";

import { useState, useTransition } from "react";
import { resubmitRequest } from "./actions";

type RequestType = "event" | "provider" | "coupon";

export default function ResubmitButton({
  id,
  type,
}: {
  id: string;
  type: RequestType;
}) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function handleResubmit() {
    startTransition(async () => {
      const result = await resubmitRequest(id, type);
      if (result.error) {
        setError(result.error);
      } else {
        setDone(true);
      }
    });
  }

  if (done) {
    return (
      <span className="text-xs text-green-400 font-bold px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
        ✓ Resubmitted for review
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleResubmit}
        disabled={isPending}
        className="text-xs font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-[#020C1B] px-4 py-2 rounded-xl transition-all active:scale-95"
      >
        {isPending ? "Resubmitting..." : "Mark as Resubmitted"}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
