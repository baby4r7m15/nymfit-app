import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Plus, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import MealForm from '@/components/diet/MealForm';
import MealCard from '@/components/diet/MealCard';

export default function Diet() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const qc = useQueryClient();

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: () => base44.entities.Meal.list('-created_date', 200),
    initialData: [],
  });

  const create = useMutation({
    mutationFn: (d) => base44.entities.Meal.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['meals'] }); close(); },
  });
  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Meal.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['meals'] }); close(); },
  });
  const remove = useMutation({
    mutationFn: (id) => base44.entities.Meal.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['meals'] }),
  });

  const close = () => { setShowForm(false); setEditing(null); };
  const submit = (d) => editing ? update.mutate({ id: editing.id, data: d }) : create.mutate(d);

  const filtered = filter === 'all' ? meals : meals.filter(m => m.meal_type === filter);

  return (
    <>
      <PageHeader
        eyebrow="Nourish"
        title="Diet library"
        description="Build a gentle repertoire of meals that keep you lean, satisfied, and glowing."
        action={
          <Button onClick={() => { setEditing(null); setShowForm(!showForm); }} className="rounded-full px-5 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Add meal
          </Button>
        }
      />

      <AnimatePresence>
        {showForm && <MealForm meal={editing} onSubmit={submit} onCancel={close} />}
      </AnimatePresence>

      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList className="rounded-full bg-muted/70 p-1">
          {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(t => (
            <TabsTrigger key={t} value={t} className="rounded-full capitalize data-[state=active]:bg-background data-[state=active]:shadow-sm">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Apple}
          title="No meals yet"
          description="Start by adding your go-to breakfast, a cute lunch, anything you love."
          action={
            <Button onClick={() => setShowForm(true)} className="rounded-full px-5">
              <Plus className="w-4 h-4 mr-2" /> Add your first meal
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map(m => (
              <MealCard
                key={m.id}
                meal={m}
                onEdit={(meal) => { setEditing(meal); setShowForm(true); }}
                onDelete={(meal) => remove.mutate(meal.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}