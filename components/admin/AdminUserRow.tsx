"use client";

import { useTransition } from "react";
import { setUserRole, setPagePublished, deleteUserAccount } from "@/app/admin/actions";

export function AdminUserRow({
  userId,
  username,
  role,
  createdAt,
  pageId,
  published,
  blockCount,
}: {
  userId: string;
  username: string;
  role: "user" | "admin";
  createdAt: string;
  pageId: string | null;
  published: boolean | null;
  blockCount: number;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className="border-b border-[var(--border)] text-[11px]">
      <td className="py-2 pr-3">
        <a href={`/${username}`} target="_blank" className="text-[var(--accent2)] hover:underline">
          {username}
        </a>
      </td>
      <td className="py-2 pr-3 text-[var(--text-dim)]">
        {new Date(createdAt).toLocaleDateString()}
      </td>
      <td className="py-2 pr-3">
        <span
          className="rounded border px-1.5 py-0.5 text-[10px]"
          style={{
            borderColor: role === "admin" ? "var(--accent2)" : "var(--border)",
            color: role === "admin" ? "var(--accent2)" : "var(--text-dim)",
          }}
        >
          {role}
        </span>
      </td>
      <td className="py-2 pr-3 text-[var(--text-dim)]">{blockCount}</td>
      <td className="py-2 pr-3">
        {pageId ? (
          <span style={{ color: published ? "var(--accent)" : "var(--text-dim)" }}>
            {published ? "published" : "hidden"}
          </span>
        ) : (
          <span className="text-[var(--text-dim)]">no page</span>
        )}
      </td>
      <td className="py-2">
        <div className="flex flex-wrap gap-2">
          {pageId && (
            <button
              disabled={isPending}
              onClick={() => startTransition(() => setPagePublished(pageId, !published))}
              className="rounded border border-[var(--border)] px-2 py-1 text-[10px] text-[var(--text-dim)] hover:text-[var(--text)]"
            >
              {published ? "unpublish" : "publish"}
            </button>
          )}
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(() => setUserRole(userId, role === "admin" ? "user" : "admin"))
            }
            className="rounded border border-[var(--border)] px-2 py-1 text-[10px] text-[var(--text-dim)] hover:text-[var(--text)]"
          >
            {role === "admin" ? "revoke admin" : "make admin"}
          </button>
          <button
            disabled={isPending}
            onClick={() => {
              if (confirm(`Permanently delete ${username}'s account and page?`)) {
                startTransition(() => deleteUserAccount(userId));
              }
            }}
            className="rounded border border-[var(--border)] px-2 py-1 text-[10px] text-[var(--accent)] hover:opacity-80"
          >
            delete
          </button>
        </div>
      </td>
    </tr>
  );
}
