import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Pencil, Trash2, Flame } from 'lucide-react';

const focusTints = {
  glutes: 'bg-primary/15 text-primary',
  legs: 'bg-[hsl(280_50%_70%)]/20 text-[hsl(280_40%_45%)]',
  core: 'bg-[hsl(30_70%_75%)]/25 text-[hsl(25_60%_40%)]',
  upper_body: 'bg-[hsl(200_55%_70%)]/20 text-[hsl(200_50%_35%)]',
  cardio: 'bg-destructive/10 text-destructive',
  full_body: 'bg-[hsl(160_40%_65%)]/20 text-[hsl(160_40%_30%)]',
  flexibility: 'bg-accent text-accent-foreground',
};

export default function WorkoutCard({ workout, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="group relative rounded-2xl bg-card border border-border p-6 overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <Badge variant="secondary" className={`${focusTints[workout.focus] || ''} rounded-full text-[10px] capitalize border-0`}>
            {(workout.focus || 'workout').replace('_', ' ')}
          </Badge>
          <h3 className="font-serif text-xl mt-3 leading-tight">{workout.name}</h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => onEdit(workout)}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-destructive hover:text-destructive" onClick={() => onDelete(workout)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{workout.duration_min || 0} min</span>
        <span className="flex items-center gap-1.5 capitalize"><Flame className="w-3.5 h-3.5" />{workout.difficulty}</span>
      </div>

      {workout.exercises?.length > 0 && (
        <div className="space-y-1.5 pt-4 border-t border-border/50">
          {workout.exercises.slice(0, 4).map((ex, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-foreground/90 truncate pr-2">{ex.name || '—'}</span>
              <span className="text-muted-foreground shrink-0 text-xs">{ex.sets}×{ex.reps}</span>
            </div>
          ))}
          {workout.exercises.length > 4 && (
            <div className="text-xs text-muted-foreground pt-1">+ {workout.exercises.length - 4} more</div>
          )}
        </div>
      )}
    </motion.div>
  );
}