import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useUser } from '@/lib/UserContext';
import { format } from 'date-fns';
import { Trash2, Users, Image, Heart, Search, ChevronDown, ChevronUp, MessageCircle, Check, X, Edit2 } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';

function PostRow({ post, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const qc = useQueryClient();

  const { data: comments = [] } = useQuery({
    queryKey: ['admin-comments', post.id],
    queryFn: () => base44.entities.PostComment.filter({ post_id: post.id }),
    enabled: expanded,
    initialData: [],
  });

  const deleteComment = useMutation({
    mutationFn: (id) => base44.entities.PostComment.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-comments', post.id] }),
  });

  return (
    <>
      <tr className="hover:bg-muted/20 transition-colors">
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="text-lg">{post.avatar_emoji || '🌸'}</span>
            <span className="font-medium text-foreground">{post.author_name || 'anonymous'}</span>
          </div>
        </td>
        <td className="px-5 py-3.5 text-muted-foreground max-w-xs">
          <p className="truncate">{post.caption}</p>
        </td>
        <td className="px-5 py-3.5">
          <div className="flex flex-wrap gap-1">
            {(post.tags || []).slice(0, 3).map(t => (
              <span key={t} className="bg-accent text-accent-foreground text-[10px] px-2 py-0.5 rounded-full">#{t}</span>
            ))}
          </div>
        </td>
        <td className="px-5 py-3.5">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Heart className="w-3.5 h-3.5 text-primary" /> {post.likes || 0}
          </span>
        </td>
        <td className="px-5 py-3.5 text-muted-foreground text-xs">
          {post.created_date ? format(new Date(post.created_date), 'MMM d, yyyy') : '—'}
        </td>
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpanded(e => !e)}
              className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors flex items-center gap-1 text-xs"
              title="View comments"
            >
              <MessageCircle className="w-4 h-4" />
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              title="Delete post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} className="px-5 pb-4 bg-muted/10">
            <div className="ml-8 border-l-2 border-border pl-4 space-y-2 pt-2">
              {comments.length === 0 ? (
                <div className="text-xs text-muted-foreground py-2">No comments yet.</div>
              ) : comments.map(c => (
                <div key={c.id} className="flex items-start justify-between gap-3 bg-white rounded-2xl px-4 py-2.5 shadow-sm border border-border">
                  <div className="flex items-start gap-2">
                    <span className="text-base">{c.avatar_emoji || '💬'}</span>
                    <div>
                      <span className="text-xs font-medium text-foreground">{c.author_name || 'anonymous'}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.text}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteComment.mutate(c.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function UserRow({ u }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(u.display_name || u.full_name || '');
  const qc = useQueryClient();

  const updateUser = useMutation({
    mutationFn: (data) => base44.entities.User.update(u.id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); setEditing(false); },
  });

  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-base shrink-0">
            {u.avatar_emoji || '🌸'}
          </div>
          {editing ? (
            <div className="flex items-center gap-2">
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-7 text-sm w-36"
                autoFocus
              />
              <button onClick={() => updateUser.mutate({ display_name: name })} className="p-1 rounded-lg bg-primary text-white hover:bg-primary/90">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setEditing(false)} className="p-1 rounded-lg bg-muted hover:bg-border">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{u.display_name || u.full_name || '—'}</span>
              <button onClick={() => setEditing(true)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        }`}>
          {u.role || 'user'}
        </span>
      </td>
      <td className="px-5 py-3.5 text-muted-foreground text-xs">
        {u.created_date ? format(new Date(u.created_date), 'MMM d, yyyy') : '—'}
      </td>
    </tr>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('users');
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { user } = useUser();

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => base44.entities.User.list(),
    initialData: [],
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: () => base44.entities.CommunityPost.list('-created_date', 200),
    initialData: [],
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['admin-logs'],
    queryFn: () => base44.entities.DailyLog.list('-date', 200),
    initialData: [],
  });

  const deletePost = useMutation({
    mutationFn: (id) => base44.entities.CommunityPost.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-posts'] }),
  });

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3">🚫</div>
          <div className="font-semibold text-foreground">Admin access only</div>
          <div className="text-sm text-muted-foreground mt-1">You don't have permission to view this page.</div>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u =>
    (u.display_name || u.full_name || '')?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPosts = posts.filter(p =>
    p.author_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.caption?.toLowerCase().includes(search.toLowerCase())
  );

  const totalHabits = logs.reduce((s, l) => s + (l.habits_done?.length || 0), 0);
  const totalMeals = logs.reduce((s, l) => s + (l.meals_eaten?.length || 0), 0);

  const TABS = [
    { id: 'users', label: 'Users', icon: Users, count: users.length },
    { id: 'posts', label: 'Community Posts', icon: Image, count: posts.length },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Dashboard"
        description="Manage users and community content."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { emoji: '💗', label: 'Members', value: users.length },
          { emoji: '📸', label: 'Posts', value: posts.length },
          { emoji: '✨', label: 'Habits Logged', value: totalHabits },
          { emoji: '🥗', label: 'Meals Logged', value: totalMeals },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl border border-border p-5 text-center shadow-sm">
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="font-display text-3xl text-primary">{s.value.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex gap-1 bg-muted/60 rounded-full p-1 w-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSearch(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t.id ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{t.count}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'users' ? 'Search users…' : 'Search posts…'}
            className="pl-9 pr-4 py-2 text-sm rounded-full border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 w-56"
          />
        </div>
      </div>

      {/* Users table */}
      {tab === 'users' && (
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  {['Member', 'Role', 'Joined'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-10 text-muted-foreground text-sm">No users found</td></tr>
                )}
                {filteredUsers.map(u => <UserRow key={u.id} u={u} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Posts table */}
      {tab === 'posts' && (
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  {['Author', 'Caption', 'Tags', 'Likes', 'Posted', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPosts.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-muted-foreground text-sm">No posts found</td></tr>
                )}
                {filteredPosts.map(p => (
                  <PostRow key={p.id} post={p} onDelete={(id) => deletePost.mutate(id)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}