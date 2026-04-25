import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function MeasurementForm({ onSubmit, onCancel }) {
  const [data, setData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight_kg: '', waist_cm: '', hips_cm: '', thighs_cm: '', chest_cm: '', body_fat_percent: '',
    notes: ''
  });

  const num = (k) => (e) => setData({ ...data, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const clean = { ...data };
    ['weight_kg', 'waist_cm', 'hips_cm', 'thighs_cm', 'chest_cm', 'body_fat_percent'].forEach(k => {
      clean[k] = clean[k] === '' ? null : Number(clean[k]);
    });
    onSubmit(clean);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="rounded-2xl bg-card border border-border p-6 lg:p-8 mb-8 space-y-5"
    >
      <Field label="Date">
        <Input type="date" value={data.date} onChange={num('date')} className="rounded-xl" required />
      </Field>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Field label="Weight (kg)"><Input type="number" step="0.1" value={data.weight_kg} onChange={num('weight_kg')} className="rounded-xl" /></Field>
        <Field label="Waist (cm)"><Input type="number" step="0.1" value={data.waist_cm} onChange={num('waist_cm')} className="rounded-xl" /></Field>
        <Field label="Hips (cm)"><Input type="number" step="0.1" value={data.hips_cm} onChange={num('hips_cm')} className="rounded-xl" /></Field>
        <Field label="Thighs (cm)"><Input type="number" step="0.1" value={data.thighs_cm} onChange={num('thighs_cm')} className="rounded-xl" /></Field>
        <Field label="Chest (cm)"><Input type="number" step="0.1" value={data.chest_cm} onChange={num('chest_cm')} className="rounded-xl" /></Field>
        <Field label="Body fat (%)"><Input type="number" step="0.1" value={data.body_fat_percent} onChange={num('body_fat_percent')} className="rounded-xl" /></Field>
      </div>

      <Field label="Notes">
        <Textarea rows={2} value={data.notes} onChange={num('notes')} className="rounded-xl" placeholder="How do you feel today?" />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-full">Cancel</Button>
        <Button type="submit" className="rounded-full px-6 bg-primary hover:bg-primary/90">Save entry</Button>
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