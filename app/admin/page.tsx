import { createClient } from "@/lib/supabase/server";
import { AdminUserRow } from "@/components/admin/AdminUserRow";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, role, created_at")
    .order("created_at", { ascending: false });

  const { data: pages } = await supabase.from("pages").select("id, user_id, published");

  const { data: blocks } = await supabase.from("blocks").select("id, page_id");

  const pageByUser = new Map((pages || []).map((p) => [p.user_id, p]));
  const blockCountByPage = new Map<string, number>();
  (blocks || []).forEach((b) => {
    blockCountByPage.set(b.page_id, (blockCountByPage.get(b.page_id) || 0) + 1);
  });

  const totalUsers = profiles?.length || 0;
  const totalPublished = (pages || []).filter((p) => p.published).length;

  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6 grid grid-cols-3 gap-3 sm:max-w-md">
        <div className="rounded border border-[var(--border)] p-3 text-center">
          <p className="text-lg text-[var(--accent2)]">{totalUsers}</p>
          <p className="text-[9px] text-[var(--text-dim)]">USERS</p>
        </div>
        <div className="rounded border border-[var(--border)] p-3 text-center">
          <p className="text-lg text-[var(--accent)]">{totalPublished}</p>
          <p className="text-[9px] text-[var(--text-dim)]">PUBLISHED</p>
        </div>
        <div className="rounded border border-[var(--border)] p-3 text-center">
          <p className="text-lg">{blocks?.length || 0}</p>
          <p className="text-[9px] text-[var(--text-dim)]">TOTAL CARDS</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-[var(--border)] p-3">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[10px] tracking-widest text-[var(--text-dim)]">
              <th className="pb-2 pr-3">USERNAME</th>
              <th className="pb-2 pr-3">JOINED</th>
              <th className="pb-2 pr-3">ROLE</th>
              <th className="pb-2 pr-3">CARDS</th>
              <th className="pb-2 pr-3">STATUS</th>
              <th className="pb-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {(profiles || []).map((p) => {
              const page = pageByUser.get(p.id);
              return (
                <AdminUserRow
                  key={p.id}
                  userId={p.id}
                  username={p.username}
                  role={p.role}
                  createdAt={p.created_at}
                  pageId={page?.id ?? null}
                  published={page?.published ?? null}
                  blockCount={page ? blockCountByPage.get(page.id) || 0 : 0}
                />
              );
            })}
          </tbody>
        </table>
        {(profiles || []).length === 0 && (
          <p className="py-8 text-center text-xs text-[var(--text-dim)]">No users yet.</p>
        )}
      </div>
    </main>
  );
}
