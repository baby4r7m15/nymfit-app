"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const RESERVED_USERNAMES = new Set([
  "admin",
  "login",
  "signup",
  "logout",
  "dashboard",
  "auth",
  "api",
  "www",
  "app",
  "settings",
  "_next",
]);

export async function signup(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const username = String(formData.get("username") || "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");

  if (!email || !password || !username) {
    redirect("/signup?error=" + encodeURIComponent("All fields are required."));
  }

  if (RESERVED_USERNAMES.has(username)) {
    redirect("/signup?error=" + encodeURIComponent("That username is reserved, please pick another."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message));
  }

  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
