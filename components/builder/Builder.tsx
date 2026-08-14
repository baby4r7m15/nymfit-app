"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Block, Page } from "@/lib/types";
import { CARD_REGISTRY, CARD_TYPES } from "@/lib/cards/registry";
import { CardRenderer } from "@/lib/cards/CardRenderer";
import { FieldEditor } from "./FieldEditor";
import { useDebouncedCallback } from "@/lib/useDebouncedCallback";
import { ARTEMIS_TEMPLATE } from "@/lib/cards/artemisTemplate";

const THEME_FIELDS: { key: keyof Page["theme"]; label: string }[] = [
  { key: "bg", label: "Background" },
  { key: "panel", label: "Panel" },
  { key: "border", label: "Border" },
  { key: "accent", label: "Accent (primary)" },
  { key: "accent2", label: "Accent (secondary)" },
  { key: "text", label: "Text" },
  { key: "textDim", label: "Text (dim)" },
];

export function Builder({
  initialPage,
  initialBlocks,
  username,
}: {
  initialPage: Page;
  initialBlocks: Block[];
  username: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [page, setPage] = useState(initialPage);
  const [blocks, setBlocks] = useState<Block[]>(
    [...initialBlocks].sort((a, b) => a.position - b.position)
  );
  const [openBlockId, setOpenBlockId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [saving, setSaving] = useState(false);

  const debouncedSaveBlock = useDebouncedCallback((id: string, content: any) => {
    setSaving(true);
    supabase
      .from("blocks")
      .update({ content })
      .eq("id", id)
      .then(() => setSaving(false));
  }, 500);

  const debouncedSaveTheme = useDebouncedCallback((theme: any) => {
    setSaving(true);
    supabase
      .from("pages")
      .update({ theme })
      .eq("id", page.id)
      .then(() => setSaving(false));
  }, 500);

  const debouncedSaveTitle = useDebouncedCallback((title: string) => {
    setSaving(true);
    supabase
      .from("pages")
      .update({ title })
      .eq("id", page.id)
      .then(() => setSaving(false));
  }, 500);

  function updateBlockContent(id: string, content: any) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));
    debouncedSaveBlock(id, id, content);
  }

  async function toggleVisible(id: string) {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    const visible = !block.visible;
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, visible } : b)));
    await supabase.from("blocks").update({ visible }).eq("id", id);
  }

  async function deleteBlock(id: string) {
    if (!confirm("Delete this card?")) return;
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    await supabase.from("blocks").delete().eq("id", id);
  }

  async function moveBlock(id: string, dir: -1 | 1) {
    const idx = blocks.findIndex((b) => b.id === id);
    const swapIdx = idx + dir;
    if (idx === -1 || swapIdx < 0 || swapIdx >= blocks.length) return;

    const next = [...blocks];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    const withPositions = next.map((b, i) => ({ ...b, position: i }));
    setBlocks(withPositions);

    await Promise.all([
      supabase.from("blocks").update({ position: idx }).eq("id", withPositions[idx].id),
      supabase.from("blocks").update({ position: swapIdx }).eq("id", withPositions[swapIdx].id),
    ]);
  }

  async function addCard(type: (typeof CARD_TYPES)[number]) {
    const def = CARD_REGISTRY[type];
    const position = blocks.length;
    const { data, error } = await supabase
      .from("blocks")
      .insert({
        page_id: page.id,
        type,
        position,
        content: def.defaultContent,
        visible: true,
      })
      .select()
      .single();

    if (!error && data) {
      setBlocks((prev) => [...prev, data as Block]);
    }
    setShowAddMenu(false);
    setOpenBlockId(data?.id ?? null);
  }

  async function loadTemplate() {
    if (
      blocks.length > 0 &&
      !confirm("This adds the full Artemis template cards to your page. Continue?")
    ) {
      return;
    }
    const rows = ARTEMIS_TEMPLATE.map((t, i) => ({
      page_id: page.id,
      type: t.type,
      position: blocks.length + i,
      content: t.content,
      visible: true,
    }));
    const { data, error } = await supabase.from("blocks").insert(rows).select();
    if (!error && data) {
      setBlocks((prev) => [...prev, ...(data as Block[])]);
    }
  }

  function updateThemeField(key: keyof Page["theme"], value: string) {
    const theme = { ...page.theme, [key]: value };
    setPage((p) => ({ ...p, theme }));
    debouncedSaveTheme("theme", theme);
  }

  function updateTitle(title: string) {
    setPage((p) => ({ ...p, title }));
    debouncedSaveTitle("title", title);
  }

  async function togglePublished() {
    const published = !page.published;
    setPage((p) => ({ ...p, published }));
    await supabase.from("pages").update({ published }).eq("id", page.id);
  }

  return (
    <div className="grid flex-1 grid-cols-1 lg:grid-cols-[380px_1fr]">
      {/* ---------- editor panel ---------- */}
      <div className="border-b lg:border-b-0 lg:border-r border-[var(--border)] p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-56px)]">
        <div>
          <label className="mb-1 block text-[10px] tracking-widest text-[var(--text-dim)]">
            PAGE TITLE
          </label>
          <input value={page.title} onChange={(e) => updateTitle(e.target.value)} />
        </div>

        <div className="flex items-center justify-between rounded border border-[var(--border)] p-2 text-xs">
          <span className="text-[var(--text-dim)]">
            {page.published ? "Published — live at" : "Unpublished (hidden)"}{" "}
            {page.published && <span className="text-[var(--accent2)]">/{username}</span>}
          </span>
          <button
            onClick={togglePublished}
            className="rounded border border-[var(--border)] px-2 py-1 text-[10px] tracking-widest"
          >
            {page.published ? "UNPUBLISH" : "PUBLISH"}
          </button>
        </div>

        <button
          onClick={() => setShowTheme((s) => !s)}
          className="w-full rounded border border-[var(--border)] py-2 text-[11px] tracking-widest text-[var(--text-dim)]"
        >
          {showTheme ? "HIDE THEME EDITOR" : "🎨 EDIT THEME COLORS"}
        </button>
        {showTheme && (
          <div className="grid grid-cols-2 gap-2 rounded border border-[var(--border)] p-3">
            {THEME_FIELDS.map((f) => (
              <div key={f.key}>
                <label className="mb-1 block text-[9px] text-[var(--text-dim)]">{f.label}</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={page.theme[f.key] as string}
                    onChange={(e) => updateThemeField(f.key, e.target.value)}
                    className="h-7 w-7 shrink-0 cursor-pointer rounded border border-[var(--border)] bg-transparent p-0"
                  />
                  <input
                    value={page.theme[f.key] as string}
                    onChange={(e) => updateThemeField(f.key, e.target.value)}
                    className="text-[10px]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {blocks.length === 0 && (
          <button
            onClick={loadTemplate}
            className="w-full rounded border border-[var(--accent2)] py-2 text-[11px] tracking-widest text-[var(--accent2)]"
          >
            ✨ LOAD ARTEMIS TEMPLATE
          </button>
        )}

        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-widest text-[var(--text-dim)]">
            CARDS ({blocks.length}) {saving && <span className="text-[var(--accent2)]">saving…</span>}
          </p>
          <button
            onClick={() => setShowAddMenu((s) => !s)}
            className="rounded border border-[var(--accent)] px-2 py-1 text-[10px] tracking-widest text-[var(--accent)]"
          >
            + ADD CARD
          </button>
        </div>

        {showAddMenu && (
          <div className="grid grid-cols-1 gap-1.5 rounded border border-[var(--border)] p-2">
            {CARD_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => addCard(type)}
                className="rounded border border-[var(--border)] p-2 text-left hover:border-[var(--accent)]"
              >
                <p className="text-[11px] text-[var(--text)]">{CARD_REGISTRY[type].label}</p>
                <p className="text-[9px] text-[var(--text-dim)]">{CARD_REGISTRY[type].description}</p>
              </button>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {blocks.map((block, i) => {
            const def = CARD_REGISTRY[block.type];
            const open = openBlockId === block.id;
            return (
              <div key={block.id} className="rounded border border-[var(--border)]">
                <div className="flex items-center justify-between p-2">
                  <button
                    className="flex-1 text-left text-[11px]"
                    onClick={() => setOpenBlockId(open ? null : block.id)}
                  >
                    <span style={{ opacity: block.visible ? 1 : 0.4 }}>
                      {open ? "▾" : "▸"} {def?.label ?? block.type}
                    </span>
                  </button>
                  <div className="flex items-center gap-1 text-[11px] text-[var(--text-dim)]">
                    <button onClick={() => moveBlock(block.id, -1)} disabled={i === 0} title="Move up">
                      ↑
                    </button>
                    <button
                      onClick={() => moveBlock(block.id, 1)}
                      disabled={i === blocks.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button onClick={() => toggleVisible(block.id)} title="Toggle visibility">
                      {block.visible ? "👁" : "🚫"}
                    </button>
                    <button onClick={() => deleteBlock(block.id)} title="Delete">
                      🗑
                    </button>
                  </div>
                </div>
                {open && def && (
                  <div className="border-t border-[var(--border)] p-3">
                    <FieldEditor
                      fields={def.fields}
                      content={block.content}
                      onChange={(next) => updateBlockContent(block.id, next)}
                    />
                  </div>
                )}
              </div>
            );
          })}
          {blocks.length === 0 && (
            <p className="py-6 text-center text-[11px] text-[var(--text-dim)]">
              No cards yet — add your first one above.
            </p>
          )}
        </div>
      </div>

      {/* ---------- live preview ---------- */}
      <div
        className="overflow-y-auto max-h-[calc(100vh-56px)] p-4 sm:p-6"
        style={{ background: page.theme.bg }}
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {blocks
            .filter((b) => b.visible)
            .map((block) => (
              <CardRenderer key={block.id} block={block} theme={page.theme} />
            ))}
          {blocks.filter((b) => b.visible).length === 0 && (
            <p className="py-16 text-center text-xs text-[var(--text-dim)]">
              Your page preview will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
