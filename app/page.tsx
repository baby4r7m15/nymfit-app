"use client";

import { useAuth } from "@/components/AuthProvider";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main>

      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">NYMFIT</div>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#stats">Stats</a>
          <a href="#about">About</a>
        </nav>

        {user ? (
          <button className="button button-primary">
            ENTER SYSTEM
          </button>
        ) : (
          <a href="/login">
            <button className="button button-primary">
              LOGIN
            </button>
          </a>
        )}
      </header>

      {/* HERO */}
      <section className="hero container">

        <div className="hero-grid">

          {/* LEFT SIDE */}
          <div>

            <div className="hero-badge">
              SYSTEM INITIALIZED
            </div>

            <h1>
              FUTURE FITNESS<br />
              FOR YOUR JOURNEY
            </h1>

            <p>
              Transform your habits into structured missions.
              Track progress, build consistency, and level up your real life
              like a systemized RPG interface.
            </p>

            <div className="hero-buttons">

              {user ? (
                <button className="button button-primary">
                  ENTER DASHBOARD
                </button>
              ) : (
                <a href="/login">
                  <button className="button button-primary">
                    LINK START
                  </button>
                </a>
              )}

              <button className="button button-secondary">
                VIEW SYSTEM
              </button>

            </div>

          </div>

          {/* RIGHT HUD PANEL */}
          <div className="hero-panel">

            <div className="stat">
              <span className="stat-label">SYSTEM LEVEL</span>
              <span className="stat-value">12</span>
            </div>

            <div className="stat">
              <span className="stat-label">TOTAL XP</span>
              <span className="stat-value">7,420</span>
            </div>

            <div className="bar">
              <div className="bar-fill" />
            </div>

            <br />

            <div className="stat">
              <span className="stat-label">DAILY QUESTS</span>
              <span className="stat-value">3 / 5</span>
            </div>

            <div className="stat">
              <span className="stat-label">CURRENT STREAK</span>
              <span className="stat-value">14 DAYS</span>
            </div>

            <div className="stat">
              <span className="stat-label">FOCUS MODE</span>
              <span className="stat-value">ACTIVE</span>
            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section id="features" className="section container">

        <h2>CORE SYSTEM MODULES</h2>

        <div className="grid" style={{ marginTop: "40px" }}>

          <div className="card">
            <h3>DAILY QUESTS</h3>
            <p>Turn habits into structured RPG-style missions with XP rewards.</p>
          </div>

          <div className="card">
            <h3>PROGRESSION SYSTEM</h3>
            <p>Level up your consistency and track long-term improvement.</p>
          </div>

          <div className="card">
            <h3>ANALYTICS ENGINE</h3>
            <p>Visualize habits, streaks, and transformation over time.</p>
          </div>

        </div>

      </section>

      {/* STATS */}
      <section id="stats" className="section container">

        <h2>SYSTEM OVERVIEW</h2>

        <div className="stats" style={{ marginTop: "40px" }}>

          <div className="stat-box">
            <div className="stat-number">12K+</div>
            USERS ONLINE
          </div>

          <div className="stat-box">
            <div className="stat-number">98%</div>
            CONSISTENCY RATE
          </div>

          <div className="stat-box">
            <div className="stat-number">4.9</div>
            SYSTEM RATING
          </div>

          <div className="stat-box">
            <div className="stat-number">24/7</div>
            ACTIVE SYSTEM
          </div>

        </div>

      </section>

      {/* ABOUT */}
      <section id="about" className="section container">

        <h2>ABOUT THE SYSTEM</h2>

        <div className="card" style={{ marginTop: "40px" }}>

          <p>
            NymFit is a futuristic self-improvement system designed to turn
            your daily habits into a structured progression experience.
            Every action contributes to your growth, consistency, and long-term transformation.
          </p>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer container">

        <div className="footer-grid">

          <div>
            <h3>NYMFIT</h3>
            <p>
              A systemized fitness and self-growth platform
              built around progression, consistency, and identity.
            </p>
          </div>

          <div>
            <h3>SYSTEM</h3>
            <a href="#features">Features</a>
            <a href="#stats">System Stats</a>
            <a href="#about">About</a>
          </div>

          <div>
            <h3>ACCESS</h3>
            <a href="/login">Login</a>
            <a href="#">Dashboard</a>
            <a href="#">Support</a>
          </div>

        </div>

      </footer>

    </main>
  );
}
