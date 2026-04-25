import React from 'react';
import { Check, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ItemPicker({ title, subtitle, items, selectedIds, onToggle, renderMeta }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 lg:p-8">
      <div className="mb-5">
        <div className="text-[11px] tracking-[0.25em] uppercase text-primary/80">{subtitle}</div>
        <h3 className="font-serif text-2xl mt-1">{title}</h3>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground italic">Nothing in your library yet.</div>
      ) : (
        <div className="space-y-2">
          {items.map(item => {
            const selected = selectedIds.includes(item.id);
            return (
              <motion.button
                key={item.id}
                onClick={() => onToggle(item.id)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center justify-between gap-3 p-4 rounded-xl border transition-all text-left",
                  selected
                    ? "bg-primary/5 border-primary/30"
                    : "bg-background border-border hover:border-primary/20"
                )}
              >
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{renderMeta(item)}</div>
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
                  selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}