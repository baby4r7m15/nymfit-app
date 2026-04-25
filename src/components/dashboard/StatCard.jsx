import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, unit, delta, icon: Icon, tint = 'primary' }) {
  const tints = {
    primary: 'from-primary/15 to-primary/5 text-primary',
    lavender: 'from-[hsl(280_50%_70%)]/15 to-[hsl(280_50%_70%)]/5 text-[hsl(280_40%_50%)]',
    peach: 'from-[hsl(30_70%_75%)]/25 to-[hsl(30_70%_75%)]/5 text-[hsl(25_60%_45%)]',
    mint: 'from-[hsl(160_40%_65%)]/20 to-[hsl(160_40%_65%)]/5 text-[hsl(160_40%_35%)]',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border p-6"
    >
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${tints[tint]} blur-2xl opacity-80`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs tracking-widest uppercase text-muted-foreground">{label}</span>
          {Icon && (
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${tints[tint]} flex items-center justify-center`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-serif text-4xl tracking-tight">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {delta !== undefined && delta !== null && (
          <div className={`text-xs mt-2 ${delta < 0 ? 'text-[hsl(160_40%_40%)]' : delta > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
            {delta > 0 ? '+' : ''}{delta} {unit || ''} from last entry
          </div>
        )}
      </div>
    </motion.div>
  );
}