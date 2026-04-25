import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X, Loader2 } from 'lucide-react';

export default function QuickAddMeal({ onCreate, isPending }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ name: '', meal_type: 'snack', calories: '', protein_g: '' });

  const s = (k) => (e) => setData({ ...data, [k]: e.target?.value ?? e });

  const submit = (e) => {
    e.preventDefault();
    onCreate({
      name: data.name,
      meal_type: data.meal_type,
      calories: data.calories === '' ? null : Number(data.calories),
      protein_g: data.protein_g === '' ? null : Number(data.protein_g),
    }, () => {
      setData({ name: '', meal_type: 'snack', calories: '', protein_g: '' });
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
            <Plus className="w-4 h-4" /> Log a custom meal
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
              <span className="text-xs font-medium tracking-widest uppercase text-primary/80">Quick add meal</span>
              <button type="button" onClick={() => setOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <Input
              value={data.name}
              onChange={s('name')}
              placeholder="Meal name"
              required
              className="rounded-lg bg-background"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={data.calories}
                onChange={s('calories')}
                placeholder="Calories"
                className="rounded-lg bg-background"
              />
              <Input
                type="number"
                value={data.protein_g}
                onChange={s('protein_g')}
                placeholder="Protein (g)"
                className="rounded-lg bg-background"
              />
            </div>
            <Select value={data.meal_type} onValueChange={(v) => setData({ ...data, meal_type: v })}>
              <SelectTrigger className="rounded-lg bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isPending} className="w-full rounded-lg bg-primary hover:bg-primary/90 h-9 text-sm">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add & log'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}