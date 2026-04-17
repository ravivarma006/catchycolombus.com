"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function businessSignup(formData: FormData) {
  const email      = (formData.get("email")      as string)?.trim();
  const password   = (formData.get("password")   as string);
  const full_name  = (formData.get("full_name")  as string)?.trim();

  if (!email || !password || !full_name) {
    return { error: "All fields are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = createClient();

  // 1. Create the auth user (trigger will create profile with role='visitor')
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Signup failed. Please try again." };
  }

  // 2. Upgrade role to business_user via service-role client (bypasses RLS)
  const admin = createAdminClient();
  const { error: roleErr } = await admin
    .from("profiles")
    .update({ role: "business_user" })
    .eq("id", data.user.id);

  if (roleErr) {
    // Non-fatal: user can still log in; admin can fix role manually
    console.error("[businessSignup] role update failed:", roleErr.message);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
