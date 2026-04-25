import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, AreaChart, Area, RadialBarChart, RadialBar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { subDays, format, parseISO, eachDayOfInterval } from 'date-fns';

const HABITS_TOTAL = 8; // must match HabitChecklist count

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 12,
  fontSize: 12,
};

export default function TrendsTab() {
  const today = new Date();
  const from = subDays(today, 29);

  const { data: logs = [] } = useQuery({
    queryKey: ['logs-30'],
    queryFn: () => base44.entities.DailyLog.list('-date', 60),
    initialData: [],
  });

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: () => base44.entities.Meal.list('-created_date', 200),
    initialData: [],
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.Workout.list('-created_date', 200),
    initialData: [],
  });

  // Build a map of date → log for quick lookup
  const logByDate = useMemo(() => {
    const map = {};
    logs.forEach(l => { map[l.date] = l; });
    return map;
  }, [logs]);

  // All 30 days, even those with no log
  const days = eachDayOfInterval({ start: from, end: today });

  const chartData = useMemo(() => days.map(d => {
    const key = format(d, 'yyyy-MM-dd');
    const label = format(d, 'MMM d');
    const log = logByDate[key];

    const calories = log
      ? (log.meals_eaten || []).reduce((s, id) => {
          const m = meals.find(x => x.id === id);
          return s + (m?.calories || 0);
        }, 0)
      : null;

    const workoutCount = log ? (log.workouts_done || []).length : null;

    const habitsDone = log ? (log.habits_done || []).length : null;
    const habitsRate = habitsDone !== null ? Math.round((habitsDone / HABITS_TOTAL) * 100) : null;

    return { label, calories, workoutCount, habitsRate, logged: !!log };
  }), [days, logByDate, meals, workouts]);

  // Summary stats
  const loggedDays = chartData.filter(d => d.logged);
  const avgCals = loggedDays.length
    ? Math.round(loggedDays.filter(d => d.calories > 0).reduce((s, d) => s + d.calories, 0) / Math.max(loggedDays.filter(d => d.calories > 0).length, 1))
    : 0;
  const workoutDays = loggedDays.filter(d => d.workoutCount > 0).length;
  const avgHabits = loggedDays.length
    ? Math.round(loggedDays.reduce((s, d) => s + (d.habitsRate || 0), 0) / loggedDays.length)
    : 0;

  const radialData = [
    { name: 'Consistency', value: Math.round((loggedDays.length / 30) * 100), fill: 'hsl(var(--chart-1))' },
    { name: 'Workouts', value: Math.round((workoutDays / 30) * 100), fill: 'hsl(var(--chart-2))' },
    { name: 'Habits', value: avgHabits, fill: 'hsl(var(--chart-3))' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Pill label="Days logged" value={loggedDays.length} suffix="/ 30" color="text-[hsl(var(--chart-1))]" />
        <Pill label="Avg calories" value={avgCals || '—'} suffix={avgCals ? 'kcal' : ''} color="text-[hsl(var(--chart-4))]" />
        <Pill label="Workout days" value={workoutDays} suffix="/ 30" color="text-[hsl(var(--chart-2))]" />
        <Pill label="Avg habit rate" value={avgHabits ? `${avgHabits}%` : '—'} color="text-[hsl(var(--chart-3))]" />
      </div>

      {/* Calorie intake */}
      <ChartCard eyebrow="Last 30 days" title="Calorie intake">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} interval={4} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v ? `${v} kcal` : '—', 'Calories']} />
            <Area type="monotone" dataKey="calories" stroke="hsl(var(--chart-4))" strokeWidth={2} fill="url(#calGrad)" connectNulls dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Workout frequency */}
      <ChartCard eyebrow="Last 30 days" title="Workout frequency">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} interval={4} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v !== null ? `${v} workout${v !== 1 ? 's' : ''}` : '—', 'Workouts']} />
            <Bar dataKey="workoutCount" radius={[4, 4, 0, 0]}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={d.workoutCount > 0 ? 'hsl(var(--chart-2))' : 'hsl(var(--muted))'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Habit completion rate */}
      <ChartCard eyebrow="Last 30 days" title="Habit completion rate">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} interval={4} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v !== null ? `${v}%` : '—', 'Completion']} />
            <Bar dataKey="habitsRate" radius={[4, 4, 0, 0]}>
              {chartData.map((d, i) => (
                <Cell
                  key={i}
                  fill={
                    d.habitsRate === null ? 'hsl(var(--muted))'
                    : d.habitsRate >= 75 ? 'hsl(var(--chart-1))'
                    : d.habitsRate >= 40 ? 'hsl(var(--chart-3))'
                    : 'hsl(var(--chart-5))'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="flex gap-4 mt-3 text-[11px] text-muted-foreground">
          <Dot color="hsl(var(--chart-1))" label="≥ 75%" />
          <Dot color="hsl(var(--chart-3))" label="40–74%" />
          <Dot color="hsl(var(--chart-5))" label="< 40%" />
          <Dot color="hsl(var(--muted))" label="No log" />
        </div>
      </ChartCard>

      {/* Radial overview */}
      <ChartCard eyebrow="30-day overview" title="At a glance">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-48 h-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius={30} outerRadius={80} data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" background={{ fill: 'hsl(var(--muted))' }} cornerRadius={6} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`]} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 flex-1">
            {radialData.map(r => (
              <div key={r.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{r.name}</span>
                  <span className="font-medium">{r.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${r.value}%`, background: r.fill }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    </div>
  );
}

const ChartCard = ({ eyebrow, title, children }) => (
  <div className="rounded-2xl bg-card border border-border p-6 lg:p-8">
    <div className="mb-5">
      <div className="text-[11px] tracking-[0.25em] uppercase text-primary/80">{eyebrow}</div>
      <h3 className="font-serif text-2xl mt-1">{title}</h3>
    </div>
    {children}
  </div>
);

const Pill = ({ label, value, suffix, color }) => (
  <div className="rounded-2xl bg-card border border-border p-5">
    <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
    <div className={`font-serif text-3xl mt-2 ${color}`}>{value} <span className="text-sm text-muted-foreground font-sans">{suffix}</span></div>
  </div>
);

const Dot = ({ color, label }) => (
  <span className="flex items-center gap-1.5">
    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
    {label}
  </span>
);