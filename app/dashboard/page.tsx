import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Builder } from "@/components/builder/Builder";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!page) {
    return (
      <main className="flex flex-1 items-center justify-center p-6 text-center text-sm text-[var(--text-dim)]">
        Your page hasn&apos;t been created yet — try logging out and back in, or contact support.
      </main>
    );
  }

  const { data: blocks } = await supabase
    .from("blocks")
    .select("*")
    .eq("page_id", page.id)
    .order("position", { ascending: true });

  return (
    <Builder
      initialPage={page}
      initialBlocks={blocks || []}
      username={profile?.username || ""}
    />
  );
}
