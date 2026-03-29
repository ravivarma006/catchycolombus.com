"use client";

import { useState, useTransition } from "react";
import {
  approveEventRequest,
  approveProviderRequest,
  approveCouponRequest,
  rejectRequest,
  requestChanges,
} from "@/app/admin/actions";

type RequestType = "event" | "provider" | "coupon";
type Status = "pending" | "approved" | "rejected" | "needs_changes";

const STATUS_STYLES: Record<Status, string> = {
  pending:       "bg-blue-500/15 text-blue-300 border-blue-500/30",
  approved:      "bg-green-500/15 text-green-300 border-green-500/30",
  rejected:      "bg-red-500/15 text-red-300 border-red-500/30",
  needs_changes: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

const STATUS_LABEL: Record<Status, string> = {
  pending:       "Pending",
  approved:      "Approved",
  rejected:      "Rejected",
  needs_changes: "Needs Changes",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export interface ReviewCardProps {
  id: string;
  type: RequestType;
  title: string;
  status: Status;
  adminNotes: string | null;
  createdAt: string;
  submittedBy?: string | null;
  details: { label: string; value: string | null }[];
}

export default function ReviewCard({
  id,
  type,
  title,
  status,
  adminNotes,
  createdAt,
  submittedBy,
  details,
}: ReviewCardProps) {
  const [isPending, startTransition] = useTransition();
  const [panel, setPanel] = useState<"reject" | "changes" | null>(null);
  const [notes, setNotes] = useState("");
  const [localStatus, setLocalStatus] = useState<Status>(status);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  function handleApprove() {
    setError("");
    startTransition(async () => {
      let result;
      if (type === "event")    result = await approveEventRequest(id);
      else if (type === "provider") result = await approveProviderRequest(id);
      else result = await approveCouponRequest(id);

      if (result.error) setError(result.error);
      else setLocalStatus("approved");
    });
  }

  function handleReject() {
    setError("");
    startTransition(async () => {
      const result = await rejectRequest(id, type, notes);
      if (result.error) setError(result.error);
      else { setLocalStatus("rejected"); setPanel(null); }
    });
  }

  function handleChanges() {
    setError("");
    startTransition(async () => {
      const result = await requestChanges(id, type, notes);
      if (result.error) setError(result.error);
      else { setLocalStatus("needs_changes"); setPanel(null); }
    });
  }

  const isActioned = localStatus === "approved" || localStatus === "rejected";

  return (
    <div className={`border rounded-2xl transition-all ${
      isActioned ? "opacity-60 border-white/5" : "border-white/10"
    } bg-white/[0.04]`}>
      {/* Header row */}
      <div
        className="flex items-start justify-between gap-4 p-5 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3 className="text-white font-black text-base leading-snug" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {title}
            </h3>
            <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${STATUS_STYLES[localStatus]}`}>
              {STATUS_LABEL[localStatus]}
            </span>
          </div>
          <p className="text-white/30 text-xs">
            {formatDate(createdAt)}{submittedBy ? ` · ${submittedBy}` : ""}
          </p>
        </div>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
          className={`text-white/30 shrink-0 mt-1 transition-transform ${expanded ? "rotate-90" : ""}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {details.filter((d) => d.value).map((d) => (
              <div key={d.label}>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-0.5">{d.label}</p>
                <p className="text-white/80 text-sm break-words">{d.value}</p>
              </div>
            ))}
          </div>

          {/* Existing admin notes */}
          {adminNotes && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
              <p className="text-[10px] font-bold text-amber-400/70 uppercase tracking-widest mb-1">Previous Note</p>
              <p className="text-amber-200 text-sm">{adminNotes}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Notes input for reject / needs_changes panels */}
          {panel && (
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                {panel === "reject" ? "Rejection reason (optional)" : "What needs to change? *"}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={
                  panel === "reject"
                    ? "e.g. Duplicate listing, missing info…"
                    : "e.g. Please add a valid phone number and event date…"
                }
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-accent/60 transition-all resize-none"
              />
            </div>
          )}

          {/* Action buttons */}
          {!isActioned && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Approve */}
              {!panel && (
                <button
                  onClick={handleApprove}
                  disabled={isPending}
                  className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95"
                >
                  {isPending ? "Processing…" : "✓ Approve"}
                </button>
              )}

              {/* Needs changes flow */}
              {panel === "changes" ? (
                <>
                  <button
                    onClick={handleChanges}
                    disabled={isPending || !notes.trim()}
                    className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#020C1B] font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95"
                  >
                    {isPending ? "Sending…" : "Send Feedback"}
                  </button>
                  <button onClick={() => { setPanel(null); setNotes(""); }}
                    className="text-white/40 hover:text-white text-sm font-semibold px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                    Cancel
                  </button>
                </>
              ) : panel === "reject" ? (
                <>
                  <button
                    onClick={handleReject}
                    disabled={isPending}
                    className="bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95"
                  >
                    {isPending ? "Rejecting…" : "Confirm Reject"}
                  </button>
                  <button onClick={() => { setPanel(null); setNotes(""); }}
                    className="text-white/40 hover:text-white text-sm font-semibold px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setPanel("changes")}
                    className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95">
                    Needs Changes
                  </button>
                  <button onClick={() => setPanel("reject")}
                    className="bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-400 font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95">
                    Reject
                  </button>
                </>
              )}
            </div>
          )}

          {/* Final state message */}
          {isActioned && (
            <p className="text-white/30 text-sm italic">
              This request has been {localStatus}. Refresh the page to remove it from this list.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
