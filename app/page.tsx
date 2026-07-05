export default function HomePage() {
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

        <button className="button button-primary">
          LOGIN
        </button>
      </header>

      {/* HERO */}
      <section className="hero container">

        <div className="hero-grid">

          {/* LEFT */}
          <div>

            <div className="hero-badge">
              SYSTEM ONLINE
            </div>

            <h1>
              FUTURE FITNESS<br />
              FOR YOUR JOURNEY
            </h1>

            <p>
              Track your habits, level up your consistency,
              and transform your daily routine into a structured progression system.
            </p>

            <div className="hero-buttons">
              <button className="button button-primary">
                LINK START
              </button>

              <button className="button button-secondary">
                VIEW SYSTEM
              </button>
            </div>

          </div>

          {/* RIGHT HUD PANEL */}
          <div className="hero-panel">

            <div className="stat">
              <span className="stat-label">LEVEL</span>
              <span className="stat-value">12</span>
            </div>

            <div className="stat">
              <span className="stat-label">EXPERIENCE</span>
              <span className="stat-value">7,420 XP</span>
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
              <span className="stat-label">STREAK</span>
              <span className="stat-value">14 DAYS</span>
            </div>

            <div className="stat">
              <span className="stat-label">FOCUS</span>
              <span className="stat-value">CONSISTENCY</span>
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
            <p>Turn habits into structured missions with XP rewards.</p>
          </div>

          <div className="card">
            <h3>PROGRESSION</h3>
            <p>Track your transformation through levels and streaks.</p>
          </div>

          <div className="card">
            <h3>ANALYTICS</h3>
            <p>Visualize consistency, habits, and long-term trends.</p>
          </div>

        </div>

      </section>

      {/* STATS */}
      <section id="stats" className="section container">

        <h2>SYSTEM OVERVIEW</h2>

        <div className="stats" style={{ marginTop: "40px" }}>

          <div className="stat-box">
            <div className="stat-number">12K+</div>
            USERS
          </div>

          <div className="stat-box">
            <div className="stat-number">98%</div>
            CONSISTENCY
          </div>

          <div className="stat-box">
            <div className="stat-number">4.9</div>
            RATING
          </div>

          <div className="stat-box">
            <div className="stat-number">24/7</div>
            SYSTEM
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer container">

        <div className="footer-grid">

          <div>
            <h3>NYMFIT</h3>
            <p>
              A futuristic self-improvement system
              designed for structured growth and consistency.
            </p>
          </div>

          <div>
            <h3>SYSTEM</h3>
            <a href="#">Features</a>
            <a href="#">Roadmap</a>
            <a href="#">Updates</a>
          </div>

          <div>
            <h3>ACCESS</h3>
            <a href="#">Login</a>
            <a href="#">Sign Up</a>
            <a href="#">Support</a>
          </div>

        </div>

      </footer>

    </main>
  );
}
