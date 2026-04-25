import React from 'react';
import { Sparkles } from 'lucide-react';

export default function EmptyState({ icon: Icon = Sparkles, title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-accent flex items-center justify-center">
        <Icon className="w-5 h-5 text-accent-foreground" />
      </div>
      <h3 className="font-serif text-xl mt-4">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}