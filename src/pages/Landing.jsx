import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AuthPromptModal from '@/components/AuthPromptModal';

const FEATURES = [
{ icon: '🌸', title: 'Track your glow-up', desc: 'Log meals, workouts & daily habits with a soft, encouraging interface.' },
{ icon: '📸', title: 'Share your story', desc: 'Post progress photos & short stories to our supportive community.' },
{ icon: '💗', title: 'Feminine focus', desc: 'Built for those that want to appear more feminine without all the hassle.' },
{ icon: '✨', title: 'Celebrate every win', desc: 'No toxic diet culture. Just gentle, consistent progress & celebration.' }];


const TESTIMONIALS = [
{ name: 'Artemis ♡', text: 'I love how this site is simple, yet detailed!', emoji: '🩷' },
{ name: 'mochi', text: 'The community here is SO supportive. Posted my first progress pic today 🥹', emoji: '🎀' },
{ name: 'rose', text: 'I love the habit tracker — skin care, water, stretching all in one place~', emoji: '🌸' }];


export default function Landing() {
  const [authUser, setAuthUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setAuthUser).catch(() => setAuthUser(null));
  }, []);

  const requireAuth = (fn) => {
    if (!authUser) {setShowAuthModal(true);return;}
    if (fn) fn();
  };

  const { data: users = [] } = useQuery({
    queryKey: ['landing-users'],
    queryFn: () => base44.entities.User.list(),
    initialData: []
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['landing-logs'],
    queryFn: () => base44.entities.DailyLog.list('-date', 500),
    initialData: []
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['landing-posts'],
    queryFn: () => base44.entities.CommunityPost.list('-created_date', 500),
    initialData: []
  });

  const memberCount = users.length;
  const habitsTracked = logs.reduce((sum, l) => sum + (l.habits_done?.length || 0), 0);
  const storiesCount = posts.length;

  const stats = [
  { emoji: '💗', value: memberCount || 0, label: 'community members' },
  { emoji: '✨', value: habitsTracked || 0, label: 'habits tracked' },
  { emoji: '📸', value: storiesCount || 0, label: 'progress stories shared' }];


  return (
    <div className="min-h-screen bg-sniff-gradient">
      <AuthPromptModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="font-display text-2xl text-primary">NymFit</span>
        <div className="flex gap-3 items-center">
          {authUser ?
          <Link to="/dashboard" className="flex items-center gap-2 bg-white border border-border rounded-full pl-2 pr-4 py-1.5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-base">
                {authUser.avatar_emoji || '🌸'}
              </div>
              <span className="text-sm font-medium text-foreground">{authUser.display_name || authUser.full_name || 'cutie'}</span>
            </Link> :

          <>
              <button
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              
                log in
              </button>
              <button
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
              className="text-sm bg-primary text-white px-5 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-sm">
              
                join free ♡
              </button>
            </>
          }
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-16 pb-24 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-xs px-4 py-1.5 rounded-full mb-6 font-medium">
            <Sparkles className="w-3 h-3" /> your gentle glow-up starts here
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-foreground leading-tight mb-6">
            <span className="text-primary">soft</span> goals,<br />
            real <span className="text-primary">progress</span>.
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            A feminine wellness tracker & community for your glow-up journey — track habits, log meals &amp; workouts, and share your transformation with a community that cheers you on.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => requireAuth(() => window.location.assign('/dashboard'))}
              className="bg-primary text-white text-base px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 font-medium">
              
              start your glow-up ✨
            </button>
            <Link
              to="/community"
              className="bg-white text-foreground text-base px-8 py-3.5 rounded-full hover:bg-muted transition-colors border border-border font-medium">
              
              peek the community 🌸
            </Link>
          </div>
        </motion.div>

        {/* Floating blobs */}
        <div className="relative mt-16 h-72 flex items-center justify-center pointer-events-none select-none">
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 opacity-60 blur-2xl" />
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
          className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-rose-300 to-pink-200 opacity-50 blur-xl left-1/3" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-border shadow-xl p-6 max-w-xs text-left">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🌸</span>
              <div>
                <div className="text-sm font-semibold">Day 14 complete!</div>
                <div className="text-xs text-muted-foreground">All 8 habits done today ✨</div>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-pink-400 rounded-full w-full" />
            </div>
            <div className="flex gap-1 mt-3">
              {['💧', '🧴', '🏃‍♀️', '🥗', '🧘', '💊', '🌙', '📖'].map((e, i) =>
              <span key={i} className="text-sm">{e}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white/60 backdrop-blur-sm py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl text-center mb-12 text-foreground">everything your glow-up needs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) =>
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-border p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{f.icon}</div>
                <div className="font-semibold text-sm mb-2">{f.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-14 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-8 text-center">
          {stats.map(({ emoji, value, label }) =>
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}>
              <div className="text-3xl mb-1">{emoji}</div>
              <motion.div
              key={value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-display text-4xl text-primary">
              
                {value.toLocaleString()}
              </motion.div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white/60 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl text-center mb-10">what the cuties say</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) =>
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-border p-6 shadow-sm">
                <div className="text-3xl mb-3">{t.emoji}</div>
                <p className="text-sm leading-relaxed mb-4 text-foreground">"{t.text}"</p>
                <div className="text-xs text-primary font-medium">— {t.name}</div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-xs text-muted-foreground">
        <span className="font-display text-primary mr-2">NymFit</span>
        made with ♡ for the glow-up girlies · 2026
      </footer>
    </div>);

}