"use client";

import { useState } from "react";

export default function CopyLinkButton({ shareLink }: { shareLink: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard API
      const el = document.createElement("textarea");
      el.value = shareLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        readOnly
        value={shareLink}
        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-yellow-100 font-mono focus:outline-none"
      />
      <button
        onClick={handleCopy}
        className={`shrink-0 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-yellow-500/20 ${
          copied
            ? "bg-green-400 text-[#020C1B] shadow-green-500/20"
            : "bg-yellow-400 hover:bg-yellow-300 text-[#020C1B]"
        }`}
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
