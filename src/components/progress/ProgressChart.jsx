import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

const SERIES = [
  { key: 'weight_kg', label: 'Weight', color: 'hsl(var(--chart-1))' },
  { key: 'waist_cm', label: 'Waist', color: 'hsl(var(--chart-2))' },
  { key: 'hips_cm', label: 'Hips', color: 'hsl(var(--chart-3))' },
  { key: 'thighs_cm', label: 'Thighs', color: 'hsl(var(--chart-4))' },
  { key: 'chest_cm', label: 'Chest', color: 'hsl(var(--chart-5))' },
];

export default function ProgressChart({ measurements }) {
  const data = [...measurements]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(m => ({
      date: format(parseISO(m.date), 'MMM d'),
      ...m,
    }));

  if (data.length < 2) {
    return (
      <div className="rounded-2xl bg-card border border-border p-10 text-center">
        <div className="text-sm text-muted-foreground">Add at least 2 entries to see your progress chart.</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-border p-6 lg:p-8">
      <div className="mb-6">
        <div className="text-[11px] tracking-[0.25em] uppercase text-primary/80">All time</div>
        <h3 className="font-serif text-2xl mt-1">Measurement timeline</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} iconType="circle" />
            {SERIES.map(s => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                dot={{ r: 3, fill: s.color }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}