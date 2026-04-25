import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

const typeTints = {
  breakfast: 'bg-[hsl(30_70%_75%)]/25 text-[hsl(25_60%_40%)]',
  lunch: 'bg-[hsl(160_40%_65%)]/20 text-[hsl(160_40%_30%)]',
  dinner: 'bg-[hsl(280_50%_70%)]/20 text-[hsl(280_40%_45%)]',
  snack: 'bg-primary/15 text-primary',
};

export default function MealCard({ meal, onEdit, onDelete }) {
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
        <div>
          <Badge variant="secondary" className={`${typeTints[meal.meal_type] || ''} rounded-full text-[10px] capitalize border-0`}>
            {meal.meal_type || 'meal'}
          </Badge>
          <h3 className="font-serif text-xl mt-3 leading-tight">{meal.name}</h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => onEdit(meal)}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-destructive hover:text-destructive" onClick={() => onDelete(meal)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {meal.calories != null && (
        <div className="flex items-baseline gap-1 mb-4">
          <span className="font-serif text-3xl">{meal.calories}</span>
          <span className="text-xs text-muted-foreground">kcal</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 text-center">
        <Macro label="Protein" value={meal.protein_g} />
        <Macro label="Carbs" value={meal.carbs_g} />
        <Macro label="Fat" value={meal.fat_g} />
      </div>

      {meal.ingredients && (
        <p className="text-xs text-muted-foreground mt-4 line-clamp-2">{meal.ingredients}</p>
      )}
    </motion.div>
  );
}

const Macro = ({ label, value }) => (
  <div className="rounded-lg bg-muted/50 py-2">
    <div className="font-serif text-sm">{value ?? '—'}{value != null ? 'g' : ''}</div>
    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
  </div>
);