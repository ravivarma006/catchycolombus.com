import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import SubscribersTable from "./SubscribersTable";

export const metadata: Metadata = { title: "Subscribers" };

export default async function AdminSubscribersPage() {
  const supabase = createClient();

  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  return (
    <div className="px-8 py-10 max-w-4xl">
      <div className="mb-10">
        <h1
          className="text-4xl font-black text-white mb-2"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Subscribers
        </h1>
        <p className="text-white/40 text-sm">
          Newsletter subscribers — {subscribers?.length ?? 0} total.
        </p>
      </div>

      <SubscribersTable subscribers={subscribers ?? []} />
    </div>
  );
}
