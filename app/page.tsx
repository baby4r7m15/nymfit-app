import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="mb-2 text-[10px] tracking-[0.3em] text-[var(--text-dim)]">GUARDIAN OS // PAGE BUILDER</p>
      <h1
        className="mb-4 text-3xl sm:text-4xl"
        style={{ color: "var(--accent)", textShadow: "0 0 16px rgba(255,47,201,.5)" }}
      >
        midnight.exe
      </h1>
      <p className="mb-8 max-w-md text-sm text-[var(--text-dim)]">
        Build a neon, terminal-styled profile page out of cards. Sign up, drop in
        the blocks you want, edit everything live, share your link.
      </p>
      <div className="flex gap-3">
        <Link
          href="/signup"
          className="rounded border border-[var(--accent)] px-5 py-2 text-xs tracking-widest text-[var(--accent)]"
          style={{ boxShadow: "0 0 12px rgba(255,47,201,.25)" }}
        >
          GET STARTED
        </Link>
        <Link
          href="/login"
          className="rounded border border-[var(--border)] px-5 py-2 text-xs tracking-widest text-[var(--text-dim)]"
        >
          LOG IN
        </Link>
      </div>
    </main>
  );
}
