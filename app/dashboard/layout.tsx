import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/auth/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
        <div className="flex items-center gap-3">
          <span className="text-xs tracking-widest text-[var(--accent)]" style={{ textShadow: "0 0 8px rgba(255,47,201,.5)" }}>
            midnight.exe
          </span>
          <span className="hidden text-[10px] text-[var(--text-dim)] sm:inline">
            /{profile?.username}
          </span>
        </div>
        <nav className="flex items-center gap-3 text-[11px] text-[var(--text-dim)]">
          {profile?.username && (
            <Link href={`/${profile.username}`} target="_blank" className="hover:text-[var(--text)]">
              VIEW PAGE ↗
            </Link>
          )}
          {profile?.role === "admin" && (
            <Link href="/admin" className="hover:text-[var(--accent2)]">
              ADMIN
            </Link>
          )}
          <form action={logout}>
            <button className="hover:text-[var(--text)]">LOG OUT</button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
