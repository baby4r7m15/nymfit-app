import { signup } from "@/app/auth/actions";
import Link from "next/link";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-6 py-10">
      <h1 className="mb-1 text-lg text-[var(--accent)]" style={{ textShadow: "0 0 10px rgba(255,47,201,.5)" }}>
        //_CREATE_ACCOUNT
      </h1>
      <p className="mb-6 text-xs text-[var(--text-dim)]">
        Get your own page at yourdomain.com/&lt;username&gt;
      </p>

      {error && (
        <p className="mb-4 rounded border border-[var(--border)] bg-[var(--panel)] p-2 text-xs text-[var(--accent)]">
          {error}
        </p>
      )}

      <form action={signup} className="space-y-3">
        <div>
          <label className="mb-1 block text-[10px] tracking-widest text-[var(--text-dim)]">USERNAME</label>
          <input name="username" required pattern="[a-z0-9_]+" placeholder="yourname" />
        </div>
        <div>
          <label className="mb-1 block text-[10px] tracking-widest text-[var(--text-dim)]">EMAIL</label>
          <input name="email" type="email" required placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-1 block text-[10px] tracking-widest text-[var(--text-dim)]">PASSWORD</label>
          <input name="password" type="password" required minLength={6} placeholder="••••••••" />
        </div>
        <button
          type="submit"
          className="mt-2 w-full rounded border border-[var(--accent)] py-2 text-xs tracking-widest text-[var(--accent)]"
          style={{ boxShadow: "0 0 12px rgba(255,47,201,.25)" }}
        >
          SIGN UP
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-[var(--text-dim)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--accent2)]">
          Log in
        </Link>
      </p>
    </main>
  );
}
