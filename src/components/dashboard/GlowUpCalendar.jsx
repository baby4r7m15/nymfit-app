import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  startOfMonth, endOfMonth, eachDayOfInterval, format, subMonths, addMonths,
  isSameMonth, isToday, parseISO, isBefore, startOfDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HABITS_TOTAL = 8;

/* Score a single log 0-3 (water ✓, any meal ✓, habits ≥50% ✓) */
function scoreLog(log, mealsMap) {
  if (!log) return 0;
  let pts = 0;
  if ((log.water_glasses || 0) >= 6) pts++;
  if ((log.meals_eaten || []).some(id => mealsMap[id])) pts++;
  if ((log.habits_done || []).length >= Math.ceil(HABITS_TOTAL / 2)) pts++;
  return pts;
}

/* Badge config per score (0-3) */
const BADGES = [
  { score: 0, emoji: null,  bg: 'bg-muted/40',            ring: '' },
  { score: 1, emoji: '🌱',  bg: 'bg-green-50',            ring: 'ring-1 ring-green-200' },
  { score: 2, emoji: '🌸',  bg: 'bg-pink-50',             ring: 'ring-1 ring-pink-200' },
  { score: 3, emoji: '🌺',  bg: 'bg-rose-100',            ring: 'ring-2 ring-primary/40' },
];

/* Streak milestones → badge */
const STREAK_MILESTONES = [
  { days: 3,  emoji: '🌿', label: '3-day bloom' },
  { days: 7,  emoji: '💐', label: '7-day bouquet' },
  { days: 14, emoji: '🌻', label: '14-day sunflower' },
  { days: 30, emoji: '🏆', label: '30-day goddess' },
];

export default function GlowUpCalendar() {
  const [month, setMonth] = useState(new Date());
  const [tooltip, setTooltip] = useState(null); // { date, x, y }

  const { data: logs = [] } = useQuery({
    queryKey: ['logs-calendar'],
    queryFn: () => base44.entities.DailyLog.list('-date', 120),
    initialData: [],
  });

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: () => base44.entities.Meal.list('-created_date', 200),
    initialData: [],
  });

  const mealsMap = useMemo(() => Object.fromEntries(meals.map(m => [m.id, m])), [meals]);

  const logByDate = useMemo(() => {
    const map = {};
    logs.forEach(l => { map[l.date] = l; });
    return map;
  }, [logs]);

  /* Score every day we have data for */
  const scoreByDate = useMemo(() => {
    const map = {};
    Object.entries(logByDate).forEach(([date, log]) => {
      map[date] = scoreLog(log, mealsMap);
    });
    return map;
  }, [logByDate, mealsMap]);

  /* Current streak (consecutive days ending today with score > 0) */
  const streak = useMemo(() => {
    let count = 0;
    const today = startOfDay(new Date());
    for (let i = 0; i < 120; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = format(d, 'yyyy-MM-dd');
      if ((scoreByDate[key] || 0) > 0) count++;
      else if (i > 0) break;
    }
    return count;
  }, [scoreByDate]);

  /* Earned milestone badges */
  const earnedMilestones = STREAK_MILESTONES.filter(m => streak >= m.days);

  /* Calendar days for current month view */
  const days = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return eachDayOfInterval({ start, end });
  }, [month]);

  /* leading blank cells so week starts on Mon */
  const leadingBlanks = useMemo(() => {
    const dow = startOfMonth(month).getDay(); // 0=Sun
    return dow === 0 ? 6 : dow - 1;
  }, [month]);

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-6">
      {/* Streak + milestones */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl border border-border p-6 flex items-center gap-5 shadow-sm">
          <div className="text-5xl">🔥</div>
          <div>
            <div className="font-display text-4xl text-primary">{streak}</div>
            <div className="text-sm font-medium">day streak</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {streak === 0 ? 'Log today to start your streak!' : `Keep going, you're glowing 🌸`}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border p-6 shadow-sm">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">milestone badges</div>
          <div className="flex flex-wrap gap-3">
            {STREAK_MILESTONES.map(m => {
              const earned = streak >= m.days;
              return (
                <motion.div key={m.days} whileHover={{ scale: 1.1 }}
                  className={`flex flex-col items-center gap-1 transition-all ${earned ? 'opacity-100' : 'opacity-25 grayscale'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 ${earned ? 'border-primary/30 bg-accent' : 'border-border bg-muted'}`}>
                    {m.emoji}
                  </div>
                  <div className="text-[10px] text-center text-muted-foreground leading-tight max-w-[50px]">{m.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Daily glow score:</span>
        {BADGES.slice(1).map(b => (
          <span key={b.score} className="flex items-center gap-1.5">
            <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${b.bg} ${b.ring}`}>{b.emoji}</span>
            {b.score === 1 ? '1 goal' : b.score === 2 ? '2 goals' : '✨ all 3'}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-md bg-muted/40" />
          no log
        </span>
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => setMonth(m => subMonths(m, 1))}
            className="p-2 rounded-full hover:bg-muted transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="font-display text-xl text-foreground">
            {format(month, 'MMMM yyyy')}
          </h3>
          <button onClick={() => setMonth(m => addMonths(m, 1))}
            disabled={isSameMonth(month, new Date())}
            className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[11px] text-muted-foreground font-medium py-1">{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Leading blanks */}
          {Array.from({ length: leadingBlanks }).map((_, i) => <div key={`b-${i}`} />)}

          {days.map(day => {
            const key = format(day, 'yyyy-MM-dd');
            const score = scoreByDate[key] ?? -1;
            const badge = score === -1
              ? BADGES[0]
              : BADGES[Math.min(score, 3)];
            const isPast = isBefore(startOfDay(day), startOfDay(new Date()));
            const isCurrentDay = key === today;
            const futureDay = !isPast && !isCurrentDay;

            return (
              <motion.div
                key={key}
                whileHover={!futureDay ? { scale: 1.15 } : {}}
                onHoverStart={e => !futureDay && setTooltip({ key, score, day })}
                onHoverEnd={() => setTooltip(null)}
                className={`
                  relative aspect-square rounded-xl flex flex-col items-center justify-center text-center cursor-default transition-all
                  ${futureDay ? 'opacity-25' : ''}
                  ${isCurrentDay ? 'ring-2 ring-primary shadow-md shadow-primary/20' : ''}
                  ${score > 0 ? badge.bg + ' ' + badge.ring : score === 0 && !futureDay ? 'bg-muted/40' : 'bg-transparent'}
                `}
              >
                <span className="text-[10px] text-muted-foreground leading-none mb-0.5">{format(day, 'd')}</span>
                {badge.emoji && score > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                    className="text-xs leading-none"
                  >
                    {badge.emoji}
                  </motion.span>
                )}
                {score === 0 && !futureDay && (
                  <span className="text-[8px] text-muted-foreground/50">·</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-4 flex items-center gap-3 bg-accent rounded-2xl px-4 py-3 text-sm"
            >
              <span className="text-2xl">{BADGES[Math.max(tooltip.score, 0)].emoji || '🫧'}</span>
              <div>
                <div className="font-medium text-foreground">{format(tooltip.day, 'EEEE, MMM d')}</div>
                <div className="text-xs text-muted-foreground">
                  {tooltip.score <= 0 ? 'No log recorded' :
                    tooltip.score === 1 ? '1 of 3 goals hit 🌱' :
                    tooltip.score === 2 ? '2 of 3 goals hit 🌸' :
                    '✨ Full glow day — all 3 goals complete!'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Score guide */}
      <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">how your glow score is calculated</div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { emoji: '💧', title: 'Hydration', desc: '6+ glasses of water' },
            { emoji: '🥗', title: 'Nourishment', desc: 'At least 1 meal logged' },
            { emoji: '🌸', title: 'Rituals', desc: '4+ daily habits ticked' },
          ].map(g => (
            <div key={g.title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center text-xl shrink-0">{g.emoji}</div>
              <div>
                <div className="text-sm font-medium">{g.title}</div>
                <div className="text-xs text-muted-foreground">{g.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}