import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Plus, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import WorkoutForm from '@/components/workouts/WorkoutForm';
import WorkoutCard from '@/components/workouts/WorkoutCard';

const FILTERS = ['all', 'glutes', 'legs', 'core', 'cardio'];

export default function Workouts() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const qc = useQueryClient();

  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.Workout.list('-created_date', 200),
    initialData: [],
  });

  const create = useMutation({
    mutationFn: (d) => base44.entities.Workout.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workouts'] }); close(); },
  });
  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Workout.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workouts'] }); close(); },
  });
  const remove = useMutation({
    mutationFn: (id) => base44.entities.Workout.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workouts'] }),
  });

  const close = () => { setShowForm(false); setEditing(null); };
  const submit = (d) => editing ? update.mutate({ id: editing.id, data: d }) : create.mutate(d);
  const filtered = filter === 'all' ? workouts : workouts.filter(w => w.focus === filter);

  return (
    <>
      <PageHeader
        eyebrow="Sculpt"
        title="Workout library"
        description="Gentle cardio, glute-focused strength, and flowy mobility — designed for a softer silhouette."
        action={
          <Button onClick={() => { setEditing(null); setShowForm(!showForm); }} className="rounded-full px-5 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Add workout
          </Button>
        }
      />

      <AnimatePresence>
        {showForm && <WorkoutForm workout={editing} onSubmit={submit} onCancel={close} />}
      </AnimatePresence>

      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList className="rounded-full bg-muted/70 p-1">
          {FILTERS.map(t => (
            <TabsTrigger key={t} value={t} className="rounded-full capitalize data-[state=active]:bg-background data-[state=active]:shadow-sm">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="No workouts yet"
          description="Start simple — a short glute circuit goes a long way."
          action={
            <Button onClick={() => setShowForm(true)} className="rounded-full px-5">
              <Plus className="w-4 h-4 mr-2" /> Add your first workout
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map(w => (
              <WorkoutCard
                key={w.id}
                workout={w}
                onEdit={(x) => { setEditing(x); setShowForm(true); }}
                onDelete={(x) => remove.mutate(x.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}