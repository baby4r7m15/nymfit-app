import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Utensils, Dumbbell, CalendarDays, TrendingUp, Users, Menu, X, ShieldCheck } from 'lucide-react';
import { useUser } from '@/lib/UserContext';

const NAV = [
{ to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
{ to: '/tracker', icon: CalendarDays, label: 'Tracker' },
{ to: '/diet', icon: Utensils, label: 'Meals' },
{ to: '/workouts', icon: Dumbbell, label: 'Workouts' },
{ to: '/progress', icon: TrendingUp, label: 'Progress' },
{ to: '/community', icon: Users, label: 'Community' }];


export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useUser();

  return (
    <div className="flex min-h-screen bg-sniff-gradient">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-white/70 backdrop-blur-md border-r border-border shrink-0 py-6 px-4">
        <Link to="/" className="font-display text-2xl text-primary mb-8 px-2">NymFit</Link>
        <nav className="flex-1 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || to === '/dashboard' && location.pathname === '/';
            return (
              <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all ${
              active ? 'bg-accent text-primary shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`
              }>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>);

          })}
        </nav>
        {/* User pill */}
        {user?.role === 'admin' &&
        <Link to="/admin"
        className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all mt-1 ${
        location.pathname === '/admin' ? 'bg-accent text-primary shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`
        }>
            <ShieldCheck className="w-4 h-4 shrink-0" />
            Admin
          </Link>
        }
        <Link to="/profile" className="flex items-center gap-3 mt-6 px-3 py-3 rounded-2xl hover:bg-muted transition-colors">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-base">
            {user?.avatar_emoji || '🌸'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium truncate">{user?.display_name || user?.full_name || 'my profile'}</div>
            <div className="text-[10px] text-muted-foreground">view profile</div>
          </div>
        </Link>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 h-14">
        <Link to="/" className="font-display text-xl text-primary">NymFit</Link>
        <button onClick={() => setMobileOpen((o) => !o)} className="p-2 rounded-full hover:bg-muted transition-colors">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen &&
      <div className="lg:hidden fixed inset-0 z-30 bg-black/30" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-14 left-0 bottom-0 w-64 bg-white/95 backdrop-blur-md border-r border-border py-4 px-4" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-1">
              {NAV.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                active ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-muted'}`
                }>
                    <Icon className="w-4 h-4" /> {label}
                  </Link>);

            })}
              {user?.role === 'admin' &&
            <Link to="/admin" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-muted-foreground hover:bg-muted transition-all">
                  <ShieldCheck className="w-4 h-4" /> Admin
                </Link>
            }
              <Link to="/profile" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-muted-foreground hover:bg-muted transition-all mt-4">
                {user?.avatar_emoji || '🌸'} My Profile
              </Link>
            </nav>
          </div>
        </div>
      }

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 lg:pt-8 pb-12">
          <Outlet />
        </div>
      </main>
    </div>);

}