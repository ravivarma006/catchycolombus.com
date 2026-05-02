"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function businessSignup(formData: FormData) {
  const email      = (formData.get("email")      as string)?.trim();
  const password   = (formData.get("password")   as string);
  const full_name  = (formData.get("full_name")  as string)?.trim();
  const phone      = (formData.get("phone")      as string)?.trim();

  if (!email || !password || !full_name || !phone) {
    return { error: "All fields are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  // Basic phone validation — must contain at least 10 digits
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) {
    return { error: "Please enter a valid phone number (at least 10 digits)." };
  }

  const supabase = createClient();

  // 1. Create the auth user (trigger will create profile with role='visitor')
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, phone },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Supabase silently returns a user with no identities when the email already exists
  if (!data.user || !data.user.identities || data.user.identities.length === 0) {
    return { error: "An account with this email already exists. Please sign in instead." };
  }

  // 2. Upgrade role to business_user via service-role client (bypasses RLS)
  const admin = createAdminClient();
  const { error: roleErr } = await admin
    .from("profiles")
    .update({ role: "business_user", phone })
    .eq("id", data.user.id);

  if (roleErr) {
    console.error("[businessSignup] role update failed:", roleErr.message);
  }

  revalidatePath("/", "layout");

  // If there's no session the project requires email confirmation.
  // Redirect to login with a flag so the user sees a success message.
  if (!data.session) {
    redirect("/auth/login?registered=1");
  }

  redirect("/dashboard");
}
