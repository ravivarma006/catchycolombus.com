"use client";

import { useTransition } from "react";
import { toggleSubscriberActive } from "./actions";

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

export default function SubscribersTable({
  subscribers,
}: {
  subscribers: Subscriber[];
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      await toggleSubscriberActive(id, current);
    });
  }

  if (subscribers.length === 0) {
    return <p className="text-white/30 text-sm">No subscribers yet.</p>;
  }

  return (
    <div className="bg-white/[0.05] border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-3 md:px-5 py-3 text-white/40 text-xs font-bold uppercase tracking-widest">
                Email
              </th>
              <th className="text-left px-3 md:px-5 py-3 text-white/40 text-xs font-bold uppercase tracking-widest">
                Subscribed
              </th>
              <th className="text-left px-3 md:px-5 py-3 text-white/40 text-xs font-bold uppercase tracking-widest">
                Status
              </th>
              <th className="px-3 md:px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub) => (
              <tr
                key={sub.id}
                className={`border-b border-white/5 ${
                  sub.is_active ? "" : "opacity-50"
                }`}
              >
                <td className="px-3 md:px-5 py-3 text-white font-medium max-w-[200px] truncate">{sub.email}</td>
                <td className="px-3 md:px-5 py-3 text-white/40 whitespace-nowrap">
                  {new Date(sub.subscribed_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-3 md:px-5 py-3">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      sub.is_active
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {sub.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 md:px-5 py-3 text-right">
                  <button
                    onClick={() => handleToggle(sub.id, sub.is_active)}
                    disabled={isPending}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition disabled:opacity-50 whitespace-nowrap"
                  >
                    {sub.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
