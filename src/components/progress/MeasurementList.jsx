import React from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MeasurementList({ measurements, onDelete }) {
  if (!measurements.length) return null;

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="font-serif text-2xl">Entries</h3>
      </div>
      <div className="divide-y divide-border">
        <AnimatePresence>
          {measurements.map(m => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="group flex items-center justify-between gap-4 p-5 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{format(parseISO(m.date), 'EEE, MMM d, yyyy')}</div>
                <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  {m.weight_kg != null && <span>{m.weight_kg}kg</span>}
                  {m.waist_cm != null && <span>waist {m.waist_cm}cm</span>}
                  {m.hips_cm != null && <span>hips {m.hips_cm}cm</span>}
                  {m.thighs_cm != null && <span>thighs {m.thighs_cm}cm</span>}
                  {m.body_fat_percent != null && <span>{m.body_fat_percent}% bf</span>}
                </div>
                {m.notes && <div className="text-xs text-muted-foreground/80 italic mt-2">{m.notes}</div>}
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(m)}
                className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}