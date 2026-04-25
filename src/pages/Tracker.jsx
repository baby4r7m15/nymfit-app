import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import PageHeader from '@/components/shared/PageHeader';
import ItemPicker from '@/components/tracker/ItemPicker';
import DayExtras from '@/components/tracker/DayExtras';
import QuickAddMeal from '@/components/tracker/QuickAddMeal';
import QuickAddWorkout from '@/components/tracker/QuickAddWorkout';
import HabitChecklist from '@/components/tracker/HabitChecklist';
import { debounce } from 'lodash';
import { Utensils, Dumbbell, Sparkles, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'meals', label: 'Meals', icon: Utensils },
  { id: 'workouts', label: 'Workouts', icon: Dumbbell },
  { id: 'habits', label: 'Habits', icon: Sparkles },
  { id: 'extras', label: 'Day Extras', icon: Sun },
];

export default function Tracker() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const qc = useQueryClient();
  const [localLog, setLocalLog] = useState(null);
  const [activeTab, setActiveTab] = useState('meals');

  const { data: logs = [] } = useQuery({
    queryKey: ['logs', today],
    queryFn: () => base44.entities.DailyLog.filter({ date: today }),
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

  const existing = logs[0];

  useEffect(() => {
    setLocalLog(existing || { date: today, meals_eaten: [], workouts_done: [], habits_done: [], water_glasses: 0 });
  }, [existing, today]);

  const upsert = useMutation({
    mutationFn: async (data) => {
      if (existing?.id) return base44.entities.DailyLog.update(existing.id, data);
      return base44.entities.DailyLog.create({ ...data, date: today });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['logs'] }),
  });

  const createMeal = useMutation({
    mutationFn: (d) => base44.entities.Meal.create(d),
    onSuccess: (newMeal) => {
      qc.invalidateQueries({ queryKey: ['meals'] });
      const next = { ...localLog, meals_eaten: [...(localLog?.meals_eaten || []), newMeal.id] };
      setLocalLog(next);
      debouncedSave(next);
    },
  });

  const createWorkout = useMutation({
    mutationFn: (d) => base44.entities.Workout.create(d),
    onSuccess: (newWorkout) => {
      qc.invalidateQueries({ queryKey: ['workouts'] });
      const next = { ...localLog, workouts_done: [...(localLog?.workouts_done || []), newWorkout.id] };
      setLocalLog(next);
      debouncedSave(next);
    },
  });

  const debouncedSave = useMemo(() => debounce((d) => upsert.mutate(d), 500), [existing?.id]);

  const updateLog = (patch) => {
    const next = { ...localLog, ...patch };
    setLocalLog(next);
    debouncedSave(next);
  };

  const toggle = (key, id) => {
    const current = localLog?.[key] || [];
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    updateLog({ [key]: next });
  };

  if (!localLog) return null;

  const eatenMeals = (localLog.meals_eaten || []).map(id => meals.find(m => m.id === id)).filter(Boolean);
  const totalCals = eatenMeals.reduce((s, m) => s + (m.calories || 0), 0);
  const totalProtein = eatenMeals.reduce((s, m) => s + (m.protein_g || 0), 0);

  return (
    <>
      <PageHeader
        eyebrow={format(new Date(), 'EEEE, MMM d')}
        title="Today"
        description="Tap meals and workouts as you go. Everything saves automatically."
      />

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <Summary label="Calories" value={totalCals} unit="kcal" emoji="🔥" />
        <Summary label="Protein" value={totalProtein} unit="g" emoji="💪" />
        <Summary label="Workouts" value={(localLog.workouts_done || []).length} unit="done" emoji="✨" />
      </div>

      {/* Horizontal tab bar */}
      <div className="flex gap-1 bg-muted/50 rounded-2xl p-1.5 mb-6 overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-white shadow-sm text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="max-w-2xl mx-auto">
        {activeTab === 'meals' && (
          <div className="space-y-4">
            <ItemPicker
              subtitle="What you ate"
              title="Meals"
              items={meals}
              selectedIds={localLog.meals_eaten || []}
              onToggle={(id) => toggle('meals_eaten', id)}
              renderMeta={(m) => `${m.meal_type || 'meal'} · ${m.calories || 0} kcal`}
            />
            <QuickAddMeal
              isPending={createMeal.isPending}
              onCreate={(d, onDone) => createMeal.mutate(d, { onSuccess: onDone })}
            />
          </div>
        )}

        {activeTab === 'workouts' && (
          <div className="space-y-4">
            <ItemPicker
              subtitle="What you trained"
              title="Workouts"
              items={workouts}
              selectedIds={localLog.workouts_done || []}
              onToggle={(id) => toggle('workouts_done', id)}
              renderMeta={(w) => `${(w.focus || '').replace('_', ' ')} · ${w.duration_min || 0} min`}
            />
            <QuickAddWorkout
              isPending={createWorkout.isPending}
              onCreate={(d, onDone) => createWorkout.mutate(d, { onSuccess: onDone })}
            />
          </div>
        )}

        {activeTab === 'habits' && (
          <HabitChecklist
            checked={localLog.habits_done || []}
            onChange={(habits_done) => updateLog({ habits_done })}
          />
        )}

        {activeTab === 'extras' && (
          <DayExtras log={localLog} onChange={updateLog} />
        )}
      </div>
    </>
  );
}

const Summary = ({ label, value, unit, emoji }) => (
  <div className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
    <div className="text-2xl">{emoji}</div>
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="font-display text-2xl text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  </div>
);