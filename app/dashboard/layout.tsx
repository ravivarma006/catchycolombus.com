import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardBottomNav from "@/components/dashboard/DashboardBottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "visitor";

  // Admin users should always land on the admin dashboard
  if (role === "admin") redirect("/admin");

  return (
    <div className="pb-20 md:pb-0">
      {children}
      <DashboardBottomNav email={user.email ?? ""} role={role} />
    </div>
  );
}
