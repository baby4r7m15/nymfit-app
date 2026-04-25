import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function WeightTrend({ measurements }) {
  const data = [...measurements]
    .filter(m => m.weight_kg)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14)
    .map(m => ({
      date: format(parseISO(m.date), 'MMM d'),
      weight: m.weight_kg,
      waist: m.waist_cm,
      hips: m.hips_cm,
    }));

  return (
    <Card className="rounded-2xl border-border bg-card p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[11px] tracking-[0.25em] uppercase text-primary/80">Last 14 entries</div>
          <h3 className="font-serif text-2xl mt-1">Weight journey</h3>
        </div>
      </div>
      {data.length < 2 ? (
        <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          Log at least 2 measurements to see your trend
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                fill="url(#weightGrad)"
                dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}