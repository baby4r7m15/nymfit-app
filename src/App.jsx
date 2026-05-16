import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const FEATURES = [
  { icon: "🍑", title: "Soft body goals", desc: "Track curves, hips & waist to celebrate your femme silhouette." },
  { icon: "🌸", title: "Feminisation journey", desc: "Log HRT, skincare & femme habits tailored just for you." },
  { icon: "📸", title: "Safe community", desc: "Share your glow-up with girls & femboys who truly get it." },
  { icon: "✨", title: "Every win counts", desc: "Zero judgment — every soft step of your journey matters." }
];

export default function App() {
  const handleCTA = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="page">

      {/* BACKGROUND */}
      <div className="bg" />

      {/* HERO */}
      <section className="hero">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="pill">
            <Sparkles size={14} /> Your femme body made easy
          </div>

          <h1 className="title">
            soft curves,<br />
            softer you.
          </h1>

          <p className="subtitle">
            Track your journey, shape your silhouette & celebrate every soft win 🏳️‍⚧️✨
          </p>

          <button className="cta" onClick={handleCTA}>
            start your glow-up <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* FEATURES */}
        <div className="features">
          {FEATURES.map((f, i) => (
            <div key={i} className="card">
              <div className="icon">{f.icon}</div>
              <div className="card-title">{f.title}</div>
              <div className="card-desc">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="stat">
            <div className="emoji">💗</div>
            <div className="num">1,240</div>
            <div className="label">members</div>
          </div>

          <div className="stat">
            <div className="emoji">✨</div>
            <div className="num">8,930</div>
            <div className="label">habits tracked</div>
          </div>

          <div className="stat">
            <div className="emoji">📸</div>
            <div className="num">2,110</div>
            <div className="label">stories</div>
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer">
        NymFit • made with ♡
      </footer>

    </div>
  );
}
