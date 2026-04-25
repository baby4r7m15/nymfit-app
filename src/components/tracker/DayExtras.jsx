import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Droplets, Minus, Plus } from 'lucide-react';

const MOODS = [
  { v: 'great', emoji: '✨', label: 'Great' },
  { v: 'good', emoji: '🌸', label: 'Good' },
  { v: 'okay', emoji: '🍵', label: 'Okay' },
  { v: 'low', emoji: '🌙', label: 'Low' },
];

export default function DayExtras({ log, onChange }) {
  const water = log?.water_glasses || 0;

  return (
    <div className="rounded-2xl bg-card border border-border p-6 lg:p-8 space-y-6">
      <div>
        <div className="text-[11px] tracking-[0.25em] uppercase text-primary/80 mb-3">Hydration</div>
        <div className="flex items-center justify-between bg-muted/40 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Droplets className="w-5 h-5 text-[hsl(200_60%_55%)]" />
            <div>
              <div className="font-serif text-2xl leading-none">{water}</div>
              <div className="text-[10px] tracking-wider uppercase text-muted-foreground mt-1">glasses</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="rounded-full h-9 w-9" onClick={() => onChange({ water_glasses: Math.max(0, water - 1) })}>
              <Minus className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="outline" className="rounded-full h-9 w-9" onClick={() => onChange({ water_glasses: water + 1 })}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="text-[11px] tracking-[0.25em] uppercase text-primary/80 mb-3">Mood</div>
        <div className="grid grid-cols-4 gap-2">
          {MOODS.map(m => (
            <button
              key={m.v}
              onClick={() => onChange({ mood: m.v })}
              className={`rounded-xl py-3 border text-center transition-all ${log?.mood === m.v ? 'bg-primary/10 border-primary/30' : 'bg-background border-border hover:border-primary/20'}`}
            >
              <div className="text-xl">{m.emoji}</div>
              <div className="text-[10px] mt-1 text-muted-foreground">{m.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[11px] tracking-[0.25em] uppercase text-primary/80 mb-3">Reflection</div>
        <Textarea
          rows={3}
          value={log?.notes || ''}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="How did the day feel?"
          className="rounded-xl"
        />
      </div>
    </div>
  );
}