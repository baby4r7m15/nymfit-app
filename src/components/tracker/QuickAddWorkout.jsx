import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X, Loader2 } from 'lucide-react';

const FOCUSES = ['glutes', 'legs', 'core', 'upper_body', 'cardio', 'full_body', 'flexibility'];

export default function QuickAddWorkout({ onCreate, isPending }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ name: '', focus: 'full_body', duration_min: '' });

  const submit = (e) => {
    e.preventDefault();
    onCreate({
      name: data.name,
      focus: data.focus,
      duration_min: data.duration_min === '' ? null : Number(data.duration_min),
    }, () => {
      setData({ name: '', focus: 'full_body', duration_min: '' });
      setOpen(false);
    });
  };

  return (
    <div className="mt-3">
      <AnimatePresence initial={false}>
        {!open ? (
          <motion.button
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(true)}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
          >
            <Plus className="w-4 h-4" /> Log a custom workout
          </motion.button>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            onSubmit={submit}
            className="rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-3"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium tracking-widest uppercase text-primary/80">Quick add workout</span>
              <button type="button" onClick={() => setOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <Input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Workout name"
              required
              className="rounded-lg bg-background"
            />
            <div className="grid grid-cols-2 gap-2">
              <Select value={data.focus} onValueChange={(v) => setData({ ...data, focus: v })}>
                <SelectTrigger className="rounded-lg bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FOCUSES.map(f => (
                    <SelectItem key={f} value={f} className="capitalize">{f.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={data.duration_min}
                onChange={(e) => setData({ ...data, duration_min: e.target.value })}
                placeholder="Duration (min)"
                className="rounded-lg bg-background"
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full rounded-lg bg-primary hover:bg-primary/90 h-9 text-sm">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add & log'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}