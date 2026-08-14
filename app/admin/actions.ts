"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Not authorized");
  return { supabase, user };
}

export async function setUserRole(userId: string, role: "user" | "admin") {
  const { supabase } = await requireAdmin();
  await supabase.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/admin");
}

export async function setPagePublished(pageId: string, published: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("pages").update({ published }).eq("id", pageId);
  revalidatePath("/admin");
}

export async function deleteUserAccount(userId: string) {
  await requireAdmin();
  // deleting the auth.users row requires the service-role admin API;
  // profiles/pages/blocks cascade-delete automatically via FK "on delete cascade"
  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(userId);
  revalidatePath("/admin");
}
