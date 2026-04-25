import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const HABITS = [
  { id: 'skincare_am', emoji: '🌸', label: 'Morning skin care' },
  { id: 'skincare_pm', emoji: '🌙', label: 'Evening skin care' },
  { id: 'posture', emoji: '🪷', label: 'Posture check' },
  { id: 'supplements', emoji: '💊', label: 'Supplements' },
  { id: 'stretch', emoji: '🧘', label: 'Stretch / mobility' },
  { id: 'sunscreen', emoji: '☀️', label: 'Sunscreen' },
  { id: 'vitamins', emoji: '✨', label: 'Vitamins' },
  { id: 'sleep_early', emoji: '🛏️', label: 'Early bedtime' },
];

export default function HabitChecklist({ checked = [], onChange }) {
  const toggle = (id) => {
    const next = checked.includes(id)
      ? checked.filter((x) => x !== id)
      : [...checked, id];
    onChange(next);
  };

  const done = checked.length;
  const total = HABITS.length;

  return (
    <div className="rounded-2xl bg-card border border-border p-6 lg:p-8">
      <div className="mb-5">
        <div className="text-[11px] tracking-[0.25em] uppercase text-primary/80">Daily rituals</div>
        <div className="flex items-end justify-between mt-1">
          <h3 className="font-serif text-2xl">Habits</h3>
          <span className="text-xs text-muted-foreground mb-0.5">
            {done}/{total}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(280_50%_70%)]"
            initial={{ width: 0 }}
            animate={{ width: `${(done / total) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {HABITS.map((habit) => {
          const isChecked = checked.includes(habit.id);
          return (
            <motion.button
              key={habit.id}
              onClick={() => toggle(habit.id)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left',
                isChecked
                  ? 'bg-primary/5 border-primary/30'
                  : 'bg-background border-border hover:border-primary/20'
              )}
            >
              <span className="text-base leading-none">{habit.emoji}</span>
              <span
                className={cn(
                  'flex-1 text-sm transition-colors',
                  isChecked ? 'line-through text-muted-foreground' : 'text-foreground'
                )}
              >
                {habit.label}
              </span>
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-all',
                  isChecked
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-muted-foreground/30 bg-transparent'
                )}
              >
                <AnimatePresence>
                  {isChecked && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>

      {done === total && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl bg-accent/60 p-3 text-center text-sm text-accent-foreground"
        >
          ✨ All habits done — you're glowing today.
        </motion.div>
      )}
    </div>
  );
}