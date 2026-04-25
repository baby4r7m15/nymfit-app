import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/lib/UserContext';
import { motion } from 'framer-motion';
import { Camera, Edit2, Check, X, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const AVATARS = ['🌸', '🎀', '🌷', '💗', '✨', '🍑', '🌺', '🦋', '🫧', '🩷', '🌙', '💫'];

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ display_name: '', bio: '', avatar_emoji: '🌸', goal: '' });


  const { user, refresh } = useUser();

  const { data: posts = [] } = useQuery({
    queryKey: ['my-posts'],
    queryFn: () => base44.entities.CommunityPost.filter({ author_email: user?.email }),
    enabled: !!user?.email,
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['all-logs'],
    queryFn: () => base44.entities.DailyLog.list('-date', 60),
    initialData: [],
  });

  useEffect(() => {
    if (user) {
      setForm({
        display_name: user.display_name || user.full_name || '',
        bio: user.bio || '',
        avatar_emoji: user.avatar_emoji || '🌸',
        goal: user.goal || '',
      });
    }
  }, [user]);

  const saveMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => { refresh(); setEditing(false); },
  });

  const streak = (() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (logs.find(l => l.date === key)) count++;
      else if (i > 0) break;
    }
    return count;
  })();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-border shadow-sm p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {editing ? (
                <div className="flex flex-wrap gap-2 max-w-[200px]">
                  {AVATARS.map(e => (
                    <button key={e} onClick={() => setForm(f => ({ ...f, avatar_emoji: e }))}
                      className={`text-2xl p-1.5 rounded-xl transition-all ${form.avatar_emoji === e ? 'bg-accent ring-2 ring-primary' : 'hover:bg-muted'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-4xl border-4 border-white shadow-md">
                  {form.avatar_emoji}
                </div>
              )}
              {!editing && (
                <div>
                  <h2 className="font-display text-2xl text-foreground">{form.display_name || user?.full_name || 'my profile'}</h2>
                  {form.bio && <p className="text-sm mt-2 max-w-xs">{form.bio}</p>}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button onClick={() => saveMutation.mutate(form)} className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditing(false)} className="p-2 rounded-full bg-muted hover:bg-border transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="p-2 rounded-full bg-muted hover:bg-border transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {editing && (
            <div className="space-y-3">
              <Input placeholder="Display name" value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))} />
              <Textarea placeholder="A little about you 🌸" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={2} />
              <Input placeholder="Your glow-up goal (e.g. feel strong & soft ✨)" value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} />
            </div>
          )}

          {!editing && form.goal && (
            <div className="mt-4 bg-accent rounded-2xl px-4 py-3 text-sm text-accent-foreground">
              🎯 Goal: {form.goal}
            </div>
          )}
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { emoji: '🔥', label: 'day streak', value: streak },
            { emoji: '📸', label: 'posts shared', value: posts.length },
            { emoji: '📅', label: 'days logged', value: logs.length },
          ].map(({ emoji, label, value }) => (
            <div key={label} className="bg-white rounded-3xl border border-border p-5 text-center shadow-sm">
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="font-display text-3xl text-primary">{value}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* My posts */}
        <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
          <h3 className="font-display text-xl mb-4">my stories 📸</h3>
          {posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <div className="text-4xl mb-3">🌱</div>
              No posts yet — share your first glow-up story in the community!
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {posts.map(p => (
                <div key={p.id} className="rounded-2xl border border-border overflow-hidden bg-muted/30">
                  {p.photo_url && <img src={p.photo_url} alt="" className="w-full h-32 object-cover" />}
                  <div className="p-3">
                    <p className="text-xs line-clamp-2 text-foreground">{p.caption}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {(p.tags || []).map(t => (
                        <span key={t} className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => base44.auth.logout()} className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground py-3 transition-colors">
          <LogOut className="w-4 h-4" /> log out
        </button>
    </div>
  );
}