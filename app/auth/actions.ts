"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();
  const userType = (formData.get("user_type") as string) || "business"; // "business" | "admin"

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: error.message };
  }

  // Look up actual role from profiles
  let role: string = "visitor";
  if (data.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    role = profile?.role ?? "visitor";
  }

  // Enforce tab selection: admin tab requires admin role
  if (userType === "admin" && role !== "admin") {
    await supabase.auth.signOut();
    return { error: "This account is not an admin. Please use the Business User tab." };
  }

  revalidatePath("/", "layout");

  // Role-based redirect
  if (role === "admin") {
    redirect("/admin");
  } else {
    redirect("/dashboard");
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("full_name") as string,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function forgotPassword(formData: FormData) {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://catchcolumbus.com"}/auth/reset-password` }
  );

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
