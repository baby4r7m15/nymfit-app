import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Apple, Dumbbell, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function TodayPanel({ log, meals, workouts }) {
  const eaten = (log?.meals_eaten || []).map(id => meals.find(m => m.id === id)).filter(Boolean);
  const trained = (log?.workouts_done || []).map(id => workouts.find(w => w.id === id)).filter(Boolean);
  const totalCals = eaten.reduce((s, m) => s + (m.calories || 0), 0);
  const totalProtein = eaten.reduce((s, m) => s + (m.protein_g || 0), 0);

  return (
    <Card className="rounded-2xl border-border bg-card overflow-hidden">
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-primary/80">Today</div>
            <h3 className="font-serif text-2xl mt-1">Your plan</h3>
          </div>
          <Link to="/tracker">
            <Button variant="ghost" size="sm" className="rounded-full">Open tracker →</Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Stat icon={Apple} label="Calories" value={totalCals} />
          <Stat icon={Dumbbell} label="Workouts" value={trained.length} />
          <Stat icon={Droplets} label="Water" value={log?.water_glasses || 0} suffix="cups" />
        </div>

        <div className="space-y-5">
          <Section title="Meals" empty="No meals logged yet today.">
            {eaten.map(m => (
              <Row key={m.id} title={m.name} meta={`${m.calories || 0} kcal · ${m.protein_g || 0}g protein`} tag={m.meal_type} />
            ))}
          </Section>
          <Section title="Workouts" empty="No workouts done yet today.">
            {trained.map(w => (
              <Row key={w.id} title={w.name} meta={`${w.duration_min || 0} min · ${w.difficulty || 'any'}`} tag={w.focus} />
            ))}
          </Section>
        </div>

        {totalProtein > 0 && (
          <div className="mt-8 p-4 rounded-xl bg-accent/60">
            <div className="text-xs text-accent-foreground/70 mb-1">Today's protein</div>
            <div className="font-serif text-xl text-accent-foreground">{totalProtein}g</div>
          </div>
        )}
      </div>
    </Card>
  );
}

const Stat = ({ icon: Icon, label, value, suffix }) => (
  <div className="rounded-xl bg-muted/50 p-4">
    <Icon className="w-4 h-4 text-muted-foreground mb-2" />
    <div className="font-serif text-2xl leading-none">{value}</div>
    <div className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">{suffix || label}</div>
  </div>
);

const Section = ({ title, empty, children }) => {
  const hasChildren = React.Children.count(children) > 0;
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{title}</div>
      {hasChildren ? <div className="space-y-2">{children}</div> : (
        <div className="text-sm text-muted-foreground/70 italic">{empty}</div>
      )}
    </div>
  );
};

const Row = ({ title, meta, tag }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
    <div>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground">{meta}</div>
    </div>
    {tag && <Badge variant="secondary" className="rounded-full text-[10px] font-normal capitalize">{tag.replace('_', ' ')}</Badge>}
  </div>
);