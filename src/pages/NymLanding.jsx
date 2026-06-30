import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Shield, Lock, ChevronRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase directly within the file using your Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FEATURES = [
  { icon: '⚔️', title: 'Body Quest Log', desc: 'Track curves, hips & waist — level up your femme silhouette.', skill: 'BODY_TRACK', lv: 12 },
  { icon: '🛡️', title: 'Safe Guild', desc: 'Share your journey with girls & femboys who truly get it.', skill: 'GUILD_ACCESS', lv: 15 },
  { icon: '✨', title: 'Every Win Counts', desc: 'Zero judgment — every soft step of your journey matters.', skill: 'WIN_LOG', lv: 6 },
];

const SYSTEM_LOGS = [
  ' > Femme Fitness PROTOCOL v3.7 — LOADED',
  ' > PLAYER DATA SYNC... COMPLETE',
  ' > GUILD SERVER CONNECTION — ESTABLISHED',
  ' > DIET TRACKER MODULE — ACTIVE',
  ' > BODY SCAN INTERFACE — READY',
];

// --- SUB-COMPONENTS (Self-Contained) ---

function DataStream() {
  const chars = ['◆', '◇', '▸', '▹', '›', '⟩', '∞', '◉', '⬡', '△'];
  const [items, setItems] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 15 }, (_, i) => ({
      x: Math.random() * 100,
      delay: i * 0.4,
      char: chars[Math.floor(Math.random() * chars.length)],
      duration: 6 + Math.random() * 4,
    }));
    setItems(generated);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-400 text-xs font-mono"
          style={{ left: `${item.x}%` }}
          animate={{ y: ['100vh', '-10vh'] }}
          transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: 'linear' }}
        >
          {item.char}
        </motion.div>
      ))}
    </div>
  );
}

function SystemLog() {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    SYSTEM_LOGS.forEach((line, i) => {
      setTimeout(() => setLines(prev => [...prev, line]), i * 500 + 300);
    });
  }, []);

  return (
    <div className="font-mono text-[10px] text-pink-400/60 tracking-wider space-y-1 text-left bg-black/40 p-3 rounded border border-pink-500/20 backdrop-blur-sm max-w-sm mx-auto">
      {lines.map((l, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
          {l}
        </motion.div>
      ))}
    </div>
  );
}

// --- MAIN LANDING & AUTH PAGE ---

export default function NymLanding() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ text: 'Check your email for the confirmation link!', type: 'success' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage({ text: 'Welcome back, Player! Redirecting...', type: 'success' });
        window.location.reload();
      }
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-slate-100 relative font-sans overflow-x-hidden flex flex-col justify-between">
      <DataStream />

      {/* Header HUD */}
      <header className="w-full max-w-6xl mx-auto px-6 py-4 flex justify-between items-center border-b border-pink-500/10 relative z-10">
        <div className="flex items-center gap-2">
          <Swords className="text-pink-500 w-5 h-5 animate-pulse" />
          <span className="font-mono tracking-[0.3em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">NYMFIT</span>
        </div>
        <button 
          onClick={() => { setIsSignUp(false); setShowAuthModal(true); }}
          className="text-xs font-mono tracking-widest border border-pink-500/30 px-4 py-1.5 rounded text-pink-400 hover:bg-pink-500/10 transition-all"
        >
          LINK START
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto relative z-10 my-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-[10px] font-mono tracking-[0.4em] text-pink-400 border border-pink-500/20 bg-pink-500/5 px-3 py-1 rounded-full uppercase">
            System Initialization Active
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-4 mb-6 uppercase bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Soft goals. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Real progress.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
            Your gentle, gamified glow-up tracker and community. Log workouts and nutrition in a completely judgment-free guild.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-6 w-full">
          <button
            onClick={() => { setIsSignUp(true); setShowAuthModal(true); }}
            className="group relative px-8 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded font-mono text-sm tracking-widest uppercase font-bold text-white shadow-lg shadow-pink-500/20 hover:brightness-110 transition-all active:scale-95"
          >
            Create Your Avatar
            <ChevronRight className="inline-block ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <SystemLog />
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 w-full mt-16 text-left">
          {FEATURES.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="p-5 bg-slate-900/40 border border-slate-800 rounded relative group overflow-hidden backdrop-blur-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-mono text-pink-400/60 border border-pink-500/20 px-2 py-0.5 rounded bg-pink-500/5">{feat.skill}</span>
                <span className="text-[10px] font-mono text-purple-400">LV.{feat.lv}</span>
              </div>
              <div className="text-2xl mb-2">{feat.icon}</div>
              <h3 className="font-mono text-xs text-slate-200 tracking-wider uppercase mb-1">{feat.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-slate-900 font-mono text-[10px] text-slate-600">
        NymFit PROTOCOL © 2026 // ALL RIGHTS RESERVED
      </footer>

            {/* --- SELF-CONTAINED AUTH MODAL PANEL --- */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#13131a] border border-pink-500/30 w-full max-w-md p-6 rounded-lg relative shadow-2xl"
            >
              <button 
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 font-mono text-xs"
              >
                [X] ESC
              </button>

              <h2 className="font-mono text-sm tracking-widest text-pink-400 uppercase mb-6 flex items-center gap-2">
                {isSignUp ? <Shield className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {isSignUp ? 'Initialize New Account' : 'Database Authentication'}
              </h2>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400 mb-1">Player Email</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-pink-500/50 transition-colors font-mono"
                    placeholder="name@linkstart.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400 mb-1">Access Key (Password)</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-pink-500/50 transition-colors font-mono"
                    placeholder="••••••••"
                  />
                </div>

                {message.text && (
                  <div className={`text-xs font-mono p-2.5 rounded border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded font-mono text-xs tracking-widest uppercase font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {loading ? 'RUNNING PROTOCOL...' : isSignUp ? 'REGISTER PLAYER' : 'CONFIRM ACCESS'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setMessage({text:'', type:''}); }}
                  className="text-[11px] font-mono text-slate-500 hover:text-pink-400 transition-colors"
                >
                  {isSignUp ? 'Already registered? Login here' : 'New user? Create your credentials'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
