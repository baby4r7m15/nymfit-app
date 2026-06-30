import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, ChevronRight, Shield, Zap, Users, Star, Wifi, Battery, Clock } from 'lucide-react';
import ReviewSection from '@/components/landing/ReviewSection';
import AuthPromptModal from '@/components/AuthPromptModal';
import { applyTheme } from '@/lib/useTheme';
// REMOVED: base44 client import
// REMOVED: useQuery from @tanstack/react-query (unless needed elsewhere for static data)

const FEATURES = [
  { icon: '⚔️', title: 'Body Quest Log', desc: 'Track curves, hips & waist — level up your femme silhouette.', skill: 'BODY_TRACK', lv: 12 },
  { icon: '🛡️', title: 'Safe Guild', desc: 'Share your journey with girls & femboys who truly get it.', skill: 'GUILD_ACCESS', lv: 15 },
  { icon: '✨', title: 'Every Win Counts', desc: 'Zero judgment — every soft step of your journey matters.', skill: 'WIN_LOG', lv: 6 },
];

function useTypewriter(text, speed = 40, delay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, speed, delay]);
  return { displayed, done };
}

function HudClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="font-display text-[10px] text-primary/60 tracking-widest tabular-nums">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

function DataStream() {
  const chars = ['◆', '◇', '▸', '▹', '›', '⟩', '∞', '◉', '⬡', '△'];
  const items = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random() * 100,
    delay: i * 0.4 + Math.random() * 2,
    char: chars[Math.floor(Math.random() * chars.length)],
    duration: 4 + Math.random() * 6,
    opacity: 0.08 + Math.random() * 0.15,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute font-display text-primary text-xs"
          style={{ left: `${item.x}%`, opacity: item.opacity }}
          animate={{ y: ['100vh', '-10vh'] }}
          transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: 'linear' }}
        >
          {item.char}
        </motion.div>
      ))}
    </div>
  );
}

const SYSTEM_LOGS = [
  '> Femme Fitness PROTOCOL v3.7 — LOADED',
  '> PLAYER DATA SYNC... COMPLETE',
  '> GUILD SERVER CONNECTION — ESTABLISHED',
  '> Diet TRACKER MODULE — ACTIVE',
  '> BODY SCAN INTERFACE — READY',
];

function SystemLog() {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    SYSTEM_LOGS.forEach((line, i) => {
      setTimeout(() => setLines(prev => [...prev, line]), i * 600 + 800);
    });
  }, []);
  return (
    <div className="font-display text-[9px] text-primary/50 tracking-widest space-y-0.5 text-left">
      {lines.map((l, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1">
          <span className="text-primary/30">{'>'}</span>
          <span>{l.replace('> ', '')}</span>
        </motion.div>
      ))}
      {lines.length < SYSTEM_LOGS.length && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }} className="text-primary">▌</motion.span>
      )}
    </div>
  );
}

function XPBar({ label, value, color = 'primary' }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[9px] font-display tracking-widest uppercase text-muted-foreground">
        <span>{label}</span>
        <span className={`text-${color}`}>{value}%</span>
      </div>
      <div className="h-1.5 bg-muted/50 overflow-hidden">
        <motion.div
          className={`h-full bg-${color}`}
          style={{ background: color === 'secondary' ? 'hsl(var(--secondary))' : 'hsl(var(--primary))' }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 1.2, duration: 1.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function SkillSlot({ feature, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-default"
    >
      <div
        className="relative sao-panel p-5 transition-all duration-300 group-hover:border-primary/60"
        style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}
      >
        <div className="absolute top-0 right-0 w-4 h-4 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-px h-8 bg-primary/40 rotate-45 origin-top-right" />
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className={`text-[8px] font-display tracking-[0.2em] px-1.5 py-0.5 border border-primary/30 text-primary/60 bg-primary/5`}>
            {feature.skill}
          </span>
          <span className="text-[9px] font-display text-secondary tracking-wider">LV.{feature.lv}</span>
        </div>

        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{feature.icon}</div>
        <div className="font-display text-xs tracking-wider uppercase text-foreground mb-2">{feature.title}</div>
        <div className="text-[11px] text-muted-foreground leading-relaxed font-sans">{feature.desc}</div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent pointer-events-none"
              initial={{ top: '0%', opacity: 0 }}
              animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, ease: 'linear' }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Fixed truncation path for PlayerHUDCard
export default function Landing() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { displayed: titleText } = useTypewriter('NymFit', 80, 200);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20 selection:text-primary">
      <DataStream />
      
      {/* Rest of Landing UI page content goes here */}
      <div className="container mx-auto max-w-6xl px-4 py-12 relative z-10 text-center">
        <motion.h1 
          className="text-5xl md:text-7xl font-display uppercase tracking-widest text-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {titleText}<span className="animate-pulse text-primary">_</span>
        </motion.h1>
        
        <p className="text-muted-foreground max-w-md mx-auto mb-8 font-sans">
          Your gentle glow-up tracker & community. Soft goals, real progress.
        </p>

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setShowAuthModal(true)} 
            className="px-6 py-3 bg-primary text-primary-foreground font-display tracking-wider uppercase rounded hover:opacity-90 transition-opacity"
          >
            Enter Link Start
          </button>
        </div>
      </div>

      <AuthPromptModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
