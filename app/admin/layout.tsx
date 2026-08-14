import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/auth/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, username")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
        <span className="text-xs tracking-widest text-[var(--accent2)]" style={{ textShadow: "0 0 8px rgba(57,230,230,.5)" }}>
          //_ADMIN_PANEL
        </span>
        <nav className="flex items-center gap-3 text-[11px] text-[var(--text-dim)]">
          <Link href="/dashboard" className="hover:text-[var(--text)]">
            MY DASHBOARD
          </Link>
          <form action={logout}>
            <button className="hover:text-[var(--text)]">LOG OUT</button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
