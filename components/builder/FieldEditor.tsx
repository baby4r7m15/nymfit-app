"use client";

import { FieldDef } from "@/lib/cards/registry";

function ListEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const items = value || [];
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex gap-1.5">
          <input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="shrink-0 rounded border border-[var(--border)] px-2 text-xs text-[var(--text-dim)]"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="text-[11px] text-[var(--accent2)]"
      >
        + add line
      </button>
    </div>
  );
}

function ObjectListEditor({
  value,
  itemFields,
  onChange,
}: {
  value: any[];
  itemFields: { key: string; label: string }[];
  onChange: (v: any[]) => void;
}) {
  const items = value || [];
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded border border-[var(--border)] p-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] text-[var(--text-dim)]">#{i + 1}</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-[11px] text-[var(--text-dim)]"
            >
              remove
            </button>
          </div>
          <div className="space-y-1.5">
            {itemFields.map((f) => (
              <div key={f.key}>
                <label className="mb-0.5 block text-[9px] tracking-wide text-[var(--text-dim)]">
                  {f.label}
                </label>
                <input
                  value={item[f.key] ?? ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], [f.key]: e.target.value };
                    onChange(next);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...items, Object.fromEntries(itemFields.map((f) => [f.key, ""]))])
        }
        className="text-[11px] text-[var(--accent2)]"
      >
        + add item
      </button>
    </div>
  );
}

export function FieldEditor({
  fields,
  content,
  onChange,
}: {
  fields: FieldDef[];
  content: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
}) {
  const set = (key: string, val: any) => onChange({ ...content, [key]: val });

  return (
    <div className="space-y-3">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="mb-1 block text-[10px] tracking-widest text-[var(--text-dim)]">
            {f.label}
          </label>
          {f.kind === "text" || f.kind === "url" ? (
            <input value={content[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
          ) : f.kind === "number" ? (
            <input
              type="number"
              value={content[f.key] ?? 0}
              onChange={(e) => set(f.key, Number(e.target.value))}
            />
          ) : f.kind === "textarea" ? (
            <textarea
              rows={4}
              value={content[f.key] ?? ""}
              onChange={(e) => set(f.key, e.target.value)}
            />
          ) : f.kind === "list" ? (
            <ListEditor value={content[f.key] ?? []} onChange={(v) => set(f.key, v)} />
          ) : f.kind === "objectList" ? (
            <ObjectListEditor
              value={content[f.key] ?? []}
              itemFields={f.itemFields || []}
              onChange={(v) => set(f.key, v)}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
