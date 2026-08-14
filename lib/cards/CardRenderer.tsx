import { Block, Theme } from "@/lib/types";

function Panel({
  children,
  theme,
  className = "",
}: {
  children: React.ReactNode;
  theme: Theme;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-[3px] border p-4 ${className}`}
      style={{
        background: `linear-gradient(180deg, ${theme.panel}, ${theme.bg})`,
        borderColor: theme.border,
        color: theme.text,
      }}
    >
      {children}
    </div>
  );
}

function PanelTitle({ children, theme }: { children: React.ReactNode; theme: Theme }) {
  return (
    <div
      className="mb-3 text-[11px] tracking-widest"
      style={{ color: theme.textDim }}
    >
      {children}
    </div>
  );
}

export function CardRenderer({ block, theme }: { block: Block; theme: Theme }) {
  const c = block.content || {};

  switch (block.type) {
    case "hero":
      return (
        <Panel theme={theme}>
          <PanelTitle theme={theme}>{c.title}</PanelTitle>
          <div className="relative overflow-hidden rounded-[2px] min-h-[220px] bg-black/40">
            {c.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-[220px] items-center justify-center text-xs" style={{ color: theme.textDim }}>
                no image set
              </div>
            )}
            {c.lockedLabel && (
              <div
                className="absolute left-3 top-3 text-[10px] tracking-widest"
                style={{ color: theme.accent, textShadow: `0 0 8px ${theme.accent}88` }}
              >
                &#128274; {c.lockedLabel}
              </div>
            )}
          </div>
        </Panel>
      );

    case "about":
      return (
        <Panel theme={theme}>
          <PanelTitle theme={theme}>{c.title}</PanelTitle>
          <div className="flex gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg" style={{ color: theme.accent, textShadow: `0 0 8px ${theme.accent}88` }}>
                {c.name}
              </h2>
              <p className="mb-2 text-xs" style={{ color: theme.textDim }}>{c.role}</p>
              <div className="space-y-1">
                {(c.bio || []).map((line: string, i: number) => (
                  <p key={i} className="text-[11px] leading-relaxed" style={{ color: theme.textDim }}>
                    {line}
                  </p>
                ))}
              </div>
              {(c.stats || []).length > 0 && (
                <dl className="mt-3 space-y-1 border-t pt-2" style={{ borderColor: theme.border }}>
                  {c.stats.map((s: any, i: number) => (
                    <div key={i} className="flex gap-2 text-[11px]">
                      <span style={{ color: theme.textDim }}>{s.label}</span>
                      <span>{s.value}</span>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            {c.imageUrl && (
              <div className="w-1/3 shrink-0 overflow-hidden rounded-[2px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </Panel>
      );

    case "quote":
      return (
        <Panel theme={theme}>
          <PanelTitle theme={theme}>{c.title}</PanelTitle>
          <p
            className="text-sm leading-relaxed"
            style={{ color: theme.accent, textShadow: `0 0 8px ${theme.accent}88` }}
          >
            {(c.lines || []).map((l: string, i: number) => (
              <span key={i}>
                {l}
                <br />
              </span>
            ))}
          </p>
        </Panel>
      );

    case "status":
      return (
        <Panel theme={theme}>
          <PanelTitle theme={theme}>{c.title}</PanelTitle>
          <p className="mb-2 text-sm tracking-wide">{c.state}</p>
          <div className="space-y-1">
            {(c.rows || []).map((r: any, i: number) => (
              <p key={i} className="text-[11px]" style={{ color: theme.textDim }}>
                {r.label} <span style={{ color: theme.text }}>{r.value}</span>
              </p>
            ))}
          </div>
          {c.footer && (
            <div
              className="mt-3 rounded-[3px] border p-2 text-center text-[10px]"
              style={{ borderColor: theme.border, color: theme.accent }}
            >
              {c.footer}
            </div>
          )}
        </Panel>
      );

    case "taglist":
      return (
        <Panel theme={theme}>
          <PanelTitle theme={theme}>{c.title}</PanelTitle>
          <ul className="space-y-2">
            {(c.items || []).map((item: string, i: number) => (
              <li key={i} className="relative pl-4 text-[11px]" style={{ color: theme.textDim }}>
                <span
                  className="absolute left-0 top-[5px] h-[6px] w-[6px]"
                  style={{
                    background: c.style === "dislikes" ? "transparent" : theme.accent,
                    border: c.style === "dislikes" ? `1px solid ${theme.textDim}` : "none",
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
        </Panel>
      );

    case "personality": {
      const axes: string[] = c.axes || [];
      const values: number[] = c.values || [];
      const cx = 120, cy = 100, r = 78;
      const n = Math.max(axes.length, 1);
      const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
      const pointAt = (i: number, val: number) => {
        const a = angle(i);
        const rr = (val / 100) * r;
        return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
      };
      const dataPts = values.map((v, i) => pointAt(i, v).join(",")).join(" ");
      return (
        <Panel theme={theme}>
          <PanelTitle theme={theme}>{c.title}</PanelTitle>
          <svg viewBox="0 0 240 220" className="mx-auto w-full">
            {[0.25, 0.5, 0.75, 1].map((f, idx) => (
              <polygon
                key={idx}
                points={axes.map((_, i) => pointAt(i, f * 100).join(",")).join(" ")}
                fill="none"
                stroke={theme.border}
                strokeWidth={1}
              />
            ))}
            {axes.map((axis, i) => {
              const [x, y] = pointAt(i, 100);
              const [lx, ly] = pointAt(i, 122);
              return (
                <g key={i}>
                  <line x1={cx} y1={cy} x2={x} y2={y} stroke={theme.border} strokeWidth={1} />
                  <text x={lx} y={ly} fill={theme.textDim} fontSize={9} textAnchor="middle" dominantBaseline="middle">
                    {axis}
                  </text>
                </g>
              );
            })}
            <polygon points={dataPts} fill={`${theme.accent}33`} stroke={theme.accent} strokeWidth={1.5} />
            {values.map((v, i) => {
              const [x, y] = pointAt(i, v);
              return <circle key={i} cx={x} cy={y} r={2.5} fill={theme.accent} />;
            })}
          </svg>
        </Panel>
      );
    }

    case "memories":
      return (
        <Panel theme={theme}>
          <PanelTitle theme={theme}>{c.title}</PanelTitle>
          <ul className="space-y-2">
            {(c.items || []).map((m: any, i: number) => (
              <li
                key={i}
                className="flex items-center justify-between border-b pb-2 text-[11px] last:border-b-0 last:pb-0"
                style={{ borderColor: theme.border }}
              >
                <span>
                  <span style={{ color: theme.textDim }}>{m.file}</span>
                  <span className="mt-0.5 block text-[10px]" style={{ color: theme.textDim }}>{m.label}</span>
                </span>
                <span style={{ color: theme.textDim }}>&#128274;</span>
              </li>
            ))}
          </ul>
          {c.footer && (
            <p className="mt-3 text-center text-[10px]" style={{ color: theme.textDim }}>
              {c.footer} &#128274;
            </p>
          )}
        </Panel>
      );

    case "playlist":
      return (
        <Panel theme={theme}>
          <PanelTitle theme={theme}>{c.title}</PanelTitle>
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[2px] bg-black/40">
              {c.artUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.artUrl} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div>
              <p className="text-[12px]">{c.name}</p>
              <p className="mb-1 text-[10px]" style={{ color: theme.accent }}>{c.status}</p>
              <p className="text-sm">{c.track}</p>
              <p className="text-[11px]" style={{ color: theme.textDim }}>{c.album}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px]" style={{ color: theme.textDim }}>
            <span>{c.currentTime}</span>
            <div className="h-[3px] flex-1 overflow-hidden rounded-full" style={{ background: theme.border }}>
              <div
                className="h-full"
                style={{ width: `${c.progress ?? 0}%`, background: theme.accent }}
              />
            </div>
            <span>{c.duration}</span>
          </div>
        </Panel>
      );

    case "friends":
      return (
        <Panel theme={theme}>
          <PanelTitle theme={theme}>{c.title}</PanelTitle>
          <div className="grid grid-cols-4 gap-2">
            {(c.items || []).map((f: any, i: number) => (
              <div key={i} className="text-center">
                <div
                  className="mb-1 aspect-square overflow-hidden rounded-[3px] border"
                  style={{ borderColor: theme.border }}
                >
                  {f.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.imageUrl} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <p className="truncate text-[10px]">{f.name}</p>
                <p className="truncate text-[9px]" style={{ color: theme.accent }}>{f.tag}</p>
              </div>
            ))}
          </div>
        </Panel>
      );

    case "sysinfo":
      return (
        <Panel theme={theme}>
          <PanelTitle theme={theme}>{c.title}</PanelTitle>
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1 text-[11px]" style={{ color: theme.textDim }}>
              {(c.lines || []).map((l: string, i: number) => (
                <p key={i}>{l || "\u00A0"}</p>
              ))}
            </div>
            {c.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.imageUrl} alt="" className="w-20 opacity-90" />
            )}
          </div>
        </Panel>
      );

    case "heading":
      return (
        <h2
          className="px-1 text-xl tracking-wide"
          style={{ color: theme.accent, textShadow: `0 0 8px ${theme.accent}88` }}
        >
          {c.text}
        </h2>
      );

    case "text":
      return (
        <Panel theme={theme}>
          <p className="whitespace-pre-line text-sm leading-relaxed" style={{ color: theme.textDim }}>
            {c.text}
          </p>
        </Panel>
      );

    case "image":
      return (
        <Panel theme={theme} className="p-0 overflow-hidden">
          {c.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.url} alt={c.caption || ""} className="w-full object-cover" />
          )}
          {c.caption && (
            <p className="p-2 text-center text-[11px]" style={{ color: theme.textDim }}>
              {c.caption}
            </p>
          )}
        </Panel>
      );

    default:
      return null;
  }
}
