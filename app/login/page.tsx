import { login } from "@/app/auth/actions";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-6 py-10">
      <h1 className="mb-1 text-lg text-[var(--accent)]" style={{ textShadow: "0 0 10px rgba(255,47,201,.5)" }}>
        //_LOGIN
      </h1>
      <p className="mb-6 text-xs text-[var(--text-dim)]">welcome back.</p>

      {error && (
        <p className="mb-4 rounded border border-[var(--border)] bg-[var(--panel)] p-2 text-xs text-[var(--accent)]">
          {error}
        </p>
      )}

      <form action={login} className="space-y-3">
        <div>
          <label className="mb-1 block text-[10px] tracking-widest text-[var(--text-dim)]">EMAIL</label>
          <input name="email" type="email" required placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-1 block text-[10px] tracking-widest text-[var(--text-dim)]">PASSWORD</label>
          <input name="password" type="password" required placeholder="••••••••" />
        </div>
        <button
          type="submit"
          className="mt-2 w-full rounded border border-[var(--accent)] py-2 text-xs tracking-widest text-[var(--accent)]"
          style={{ boxShadow: "0 0 12px rgba(255,47,201,.25)" }}
        >
          LOG IN
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-[var(--text-dim)]">
        No account yet?{" "}
        <Link href="/signup" className="text-[var(--accent2)]">
          Sign up
        </Link>
      </p>
    </main>
  );
}
