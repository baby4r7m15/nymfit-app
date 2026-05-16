import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const FEATURES = [
  { icon: "🍑", title: "Soft body goals", desc: "Track curves, hips & waist to celebrate your femme silhouette." },
  { icon: "🌸", title: "Feminisation journey", desc: "Log HRT, skincare & femme habits tailored just for you." },
  { icon: "📸", title: "Safe community", desc: "Share your glow-up with girls & femboys who truly get it." },
  { icon: "✨", title: "Every win counts", desc: "Zero judgment — every soft step of your journey matters." }
];

export default function Landing() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden bg-hero-gradient">

      {/* HERO */}
      <section className="relative text-center px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32 max-w-5xl mx-auto">

        {/* glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-20 right-1/4 w-72 h-72 rounded-full bg-secondary/10 blur-3xl pointer-events-none animate-pulse-glow" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 border border-primary/20 text-primary text-xs px-4 py-1.5 rounded-full mb-8 font-medium backdrop-blur-sm bg-accent"
          >
            <Sparkles className="w-3 h-3" />
            Your femme body made easy
          </motion.div>

          <h1 className="font-display text-5xl sm:text-8xl leading-tight mb-6">
            <span className="text-gradient">soft</span>{" "}
            <span className="text-foreground/90">curves,</span>
            <br />
            <span className="text-foreground/90">softer </span>
            <span className="text-gradient">you</span>
            <span className="text-foreground/90">.</span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Track your feminization journey, shape your silhouette & celebrate every soft, beautiful win! 🏳️‍⚧️🍑✨
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleInstall}
            className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-semibold shadow-2xl glow-pink flex items-center gap-2 mx-auto"
          >
            start your glow-up ✨
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 sm:mt-24 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border shadow-2xl p-6 max-w-xs text-left glow-pink"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🍑</span>
              <div>
                <div className="text-sm font-semibold">Hips +2cm this month!</div>
                <div className="text-xs text-muted-foreground">
                  Waist/hip ratio improving 💗
                </div>
              </div>
            </div>

            <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full w-[85%]" />
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {["🍑", "💊", "🧴", "🏃‍♀️", "💧", "🧘", "🌙", "✨"].map((e, i) => (
                <span key={i} className="text-sm">{e}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          <h2 className="font-display text-3xl sm:text-4xl text-center mb-10 text-primary">
            built for your soft body goals
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-glow rounded-3xl p-6 text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <div className="font-semibold text-sm mb-2">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="card-glow rounded-3xl p-8 flex justify-around text-center">
            {[
              { emoji: "💗", value: "1,240", label: "members" },
              { emoji: "✨", value: "8,930", label: "habits tracked" },
              { emoji: "📸", value: "2,110", label: "stories shared" }
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl mb-2">{s.emoji}</div>
                <div className="font-display text-3xl text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCORD */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          <a
            href="https://discord.gg/EW3Hb6PBjy"
            className="card-glow rounded-3xl p-6 flex items-center gap-5"
          >
            <div className="text-3xl">💬</div>
            <div>
              <div className="font-display text-lg">Join our Discord ♡</div>
              <div className="text-sm text-muted-foreground">
                Community for trans girls & femboys 🏳️‍⚧️✨
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 text-center text-xs">
        <span className="font-display text-primary mr-2">NymFit</span>
        2026 · made with ♡
      </footer>
    </div>
  );
}
