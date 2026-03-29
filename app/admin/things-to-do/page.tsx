import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import ThingsToDoManager from "./ThingsToDoManager";

export const metadata: Metadata = { title: "Things to Do" };

export default async function AdminThingsToDoPage() {
  const supabase = createClient();

  const [{ data: categories }, { data: activities }] = await Promise.all([
    supabase
      .from("activity_categories")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase
      .from("activities")
      .select("*, category:activity_categories!category_id(name, slug)")
      .order("name", { ascending: true }),
  ]);

  return (
    <div className="px-8 py-10 max-w-5xl">
      <div className="mb-10">
        <h1
          className="text-4xl font-black text-white mb-2"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Things to Do
        </h1>
        <p className="text-white/40 text-sm">
          Manage activity categories and listings for Columbus visitors.
        </p>
      </div>

      <ThingsToDoManager
        categories={categories ?? []}
        activities={(activities ?? []).map((a: any) => ({
          ...a,
          category: Array.isArray(a.category) ? a.category[0] ?? null : a.category ?? null,
        }))}
      />
    </div>
  );
}
