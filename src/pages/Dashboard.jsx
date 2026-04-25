import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Flame, Scale, Heart, Ruler } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import TodayPanel from '@/components/dashboard/TodayPanel';
import WeightTrend from '@/components/dashboard/WeightTrend';
import TrendsTab from '@/components/dashboard/TrendsTab';
import GlowUpCalendar from '@/components/dashboard/GlowUpCalendar';

export default function Dashboard() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [tab, setTab] = useState('overview');

  const { data: measurements = [] } = useQuery({
    queryKey: ['measurements'],
    queryFn: () => base44.entities.BodyMeasurement.list('-date', 50),
    initialData: [],
  });

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: () => base44.entities.Meal.list('-created_date', 100),
    initialData: [],
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.Workout.list('-created_date', 100),
    initialData: [],
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['logs'],
    queryFn: () => base44.entities.DailyLog.filter({ date: today }),
    initialData: [],
  });

  const latest = measurements[0];
  const previous = measurements[1];
  const todayLog = logs[0];

  const delta = (field) => {
    if (!latest || !previous || !latest[field] || !previous[field]) return null;
    return +(latest[field] - previous[field]).toFixed(1);
  };

  const hipToWaist = latest?.waist_cm && latest?.hips_cm
    ? (latest.waist_cm / latest.hips_cm).toFixed(2)
    : '—';

  return (
    <>
      <PageHeader
        eyebrow="Your studio"
        title={<>Hello, <em className="italic text-primary font-light">lovely</em>.</>}
        description="A gentle, honest space to sculpt the softer, stronger version of yourself — one day at a time."
      />

      <Tabs value={tab} onValueChange={setTab} className="mb-8">
        <TabsList className="rounded-full bg-muted/70 p-1">
          <TabsTrigger value="overview" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="trends" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">30-day trends</TabsTrigger>
          <TabsTrigger value="calendar" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">🌸 glow calendar</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Weight" value={latest?.weight_kg ?? '—'} unit="kg" delta={delta('weight_kg')} icon={Scale} tint="primary" />
            <StatCard label="Waist" value={latest?.waist_cm ?? '—'} unit="cm" delta={delta('waist_cm')} icon={Ruler} tint="lavender" />
            <StatCard label="Hips" value={latest?.hips_cm ?? '—'} unit="cm" delta={delta('hips_cm')} icon={Heart} tint="peach" />
            <StatCard label="Waist/Hip" value={hipToWaist} unit="ratio" icon={Flame} tint="mint" />
          </div>
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <WeightTrend measurements={measurements} />
            </div>
            <div className="lg:col-span-2">
              <TodayPanel log={todayLog} meals={meals} workouts={workouts} />
            </div>
          </div>
        </>
      )}

      {tab === 'trends' && <TrendsTab />}
      {tab === 'calendar' && <GlowUpCalendar />}
    </>
  );
}