import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CardRenderer } from "@/lib/cards/CardRenderer";
import { Block, Page } from "@/lib/types";

export const revalidate = 0;

export default async function PublicPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("user_id", profile.id)
    .single<Page>();

  if (!page || !page.published) notFound();

  const { data: blocks } = await supabase
    .from("blocks")
    .select("*")
    .eq("page_id", page.id)
    .eq("visible", true)
    .order("position", { ascending: true });

  const theme = page.theme;

  return (
    <main
      className="min-h-screen px-4 py-8 sm:px-6"
      style={{ background: theme.bg, color: theme.text }}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        {((blocks as Block[]) || []).map((block) => (
          <CardRenderer key={block.id} block={block} theme={theme} />
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-2xl text-center text-[10px] tracking-widest text-[var(--text-dim)]">
        built with midnight.exe
      </p>
    </main>
  );
}
