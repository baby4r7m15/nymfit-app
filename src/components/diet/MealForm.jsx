import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

const EMPTY = {
  name: '', meal_type: 'breakfast', calories: '', protein_g: '', carbs_g: '', fat_g: '',
  ingredients: '', notes: ''
};

export default function MealForm({ meal, onSubmit, onCancel }) {
  const [data, setData] = useState(meal || EMPTY);

  const set = (k) => (e) => setData({ ...data, [k]: e.target?.value ?? e });
  const num = (k) => (e) => setData({ ...data, [k]: e.target.value === '' ? '' : parseFloat(e.target.value) });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...data,
      calories: data.calories === '' ? null : Number(data.calories),
      protein_g: data.protein_g === '' ? null : Number(data.protein_g),
      carbs_g: data.carbs_g === '' ? null : Number(data.carbs_g),
      fat_g: data.fat_g === '' ? null : Number(data.fat_g),
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="rounded-2xl bg-card border border-border p-6 lg:p-8 mb-8 space-y-5"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Meal name">
          <Input value={data.name} onChange={set('name')} placeholder="e.g. Greek yogurt bowl" required className="rounded-xl" />
        </Field>
        <Field label="Meal type">
          <Select value={data.meal_type} onValueChange={(v) => setData({ ...data, meal_type: v })}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Field label="Calories"><Input type="number" value={data.calories} onChange={num('calories')} className="rounded-xl" /></Field>
        <Field label="Protein (g)"><Input type="number" value={data.protein_g} onChange={num('protein_g')} className="rounded-xl" /></Field>
        <Field label="Carbs (g)"><Input type="number" value={data.carbs_g} onChange={num('carbs_g')} className="rounded-xl" /></Field>
        <Field label="Fat (g)"><Input type="number" value={data.fat_g} onChange={num('fat_g')} className="rounded-xl" /></Field>
      </div>

      <Field label="Ingredients">
        <Textarea value={data.ingredients} onChange={set('ingredients')} rows={2} placeholder="Oats, berries, honey…" className="rounded-xl" />
      </Field>

      <Field label="Notes">
        <Textarea value={data.notes} onChange={set('notes')} rows={2} placeholder="Prep tips, timing…" className="rounded-xl" />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-full">Cancel</Button>
        <Button type="submit" className="rounded-full px-6 bg-primary hover:bg-primary/90">{meal ? 'Save changes' : 'Add meal'}</Button>
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