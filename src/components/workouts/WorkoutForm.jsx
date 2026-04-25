import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

const EMPTY = {
  name: '', focus: 'glutes', duration_min: 30, difficulty: 'beginner',
  exercises: [{ name: '', sets: 3, reps: '12', notes: '' }],
  notes: ''
};

const FOCUSES = ['glutes', 'legs', 'core', 'upper_body', 'cardio', 'full_body', 'flexibility'];

export default function WorkoutForm({ workout, onSubmit, onCancel }) {
  const [data, setData] = useState(workout || EMPTY);

  const updateEx = (i, field, value) => {
    const next = [...data.exercises];
    next[i] = { ...next[i], [field]: value };
    setData({ ...data, exercises: next });
  };
  const addEx = () => setData({ ...data, exercises: [...data.exercises, { name: '', sets: 3, reps: '12', notes: '' }] });
  const removeEx = (i) => setData({ ...data, exercises: data.exercises.filter((_, idx) => idx !== i) });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ ...data, duration_min: Number(data.duration_min) || 0 });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="rounded-2xl bg-card border border-border p-6 lg:p-8 mb-8 space-y-5"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Workout name">
          <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Glute sculpt" required className="rounded-xl" />
        </Field>
        <Field label="Focus">
          <Select value={data.focus} onValueChange={(v) => setData({ ...data, focus: v })}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FOCUSES.map(f => <SelectItem key={f} value={f} className="capitalize">{f.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Field label="Duration (min)">
          <Input type="number" value={data.duration_min} onChange={(e) => setData({ ...data, duration_min: e.target.value })} className="rounded-xl" />
        </Field>
        <Field label="Difficulty">
          <Select value={data.difficulty} onValueChange={(v) => setData({ ...data, difficulty: v })}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-[11px] tracking-widest uppercase text-muted-foreground">Exercises</Label>
          <Button type="button" size="sm" variant="ghost" onClick={addEx} className="rounded-full">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {data.exercises.map((ex, i) => (
            <div key={i} className="grid grid-cols-[1fr_60px_80px_auto] gap-2 items-center">
              <Input value={ex.name} onChange={(e) => updateEx(i, 'name', e.target.value)} placeholder="Hip thrust" className="rounded-xl" />
              <Input type="number" value={ex.sets} onChange={(e) => updateEx(i, 'sets', Number(e.target.value))} placeholder="Sets" className="rounded-xl" />
              <Input value={ex.reps} onChange={(e) => updateEx(i, 'reps', e.target.value)} placeholder="Reps" className="rounded-xl" />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeEx(i)} className="rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Field label="Notes">
        <Textarea value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })} rows={2} className="rounded-xl" />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-full">Cancel</Button>
        <Button type="submit" className="rounded-full px-6 bg-primary hover:bg-primary/90">{workout ? 'Save changes' : 'Add workout'}</Button>
      </div>
    </motion.form>
  );
}

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <Label className="text-[11px] tracking-widest uppercase text-muted-foreground">{label}</Label>
    {children}
  </div>
);