export default function App() {
  return (
    <div className="page">

      {/* BACKGROUND */}
      <div className="bg" />

      {/* NAV */}
      <header className="nav">
        <div className="logo">NymFit</div>

        <nav>
          <a href="#features">Features</a>
          <a href="#progress">Progress</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="profile">
          <div className="avatar">👤</div>
          Open App
        </div>
      </header>

      {/* HERO */}
      <section className="hero">

        <h1 className="title">
          Build your body.<br />
          Track everything.
        </h1>

        <p className="subtitle">
          NymFit helps you track workouts, monitor progression, and build a physique with structured, intelligent training data.
        </p>

        <button className="cta">
          Get Started
        </button>

        {/* ===== STATS (kept from Tailwind version) ===== */}
        <div className="stats">

          <div className="card">
            <p className="label">Weekly Volume</p>
            <p className="value cyan">14,280 kg</p>
          </div>

          <div className="card">
            <p className="label">Strength Trend</p>
            <p className="value pink">+22%</p>
          </div>

          <div className="card">
            <p className="label">Consistency</p>
            <p className="value green">91%</p>
          </div>

        </div>

        {/* ===== CHART ===== */}
        <div className="chart">
          <div className="bar b1" />
          <div className="bar b2" />
          <div className="bar b3" />
          <div className="bar b4" />
          <div className="bar b5" />
          <div className="bar b6" />
        </div>

      </section>

      {/* FEATURES */}
      <section id="features" className="hero">
        <h2 className="title" style={{ fontSize: "42px" }}>
          Everything you need
        </h2>
        <p className="subtitle">
          Workout tracking, progression analytics, and structured training built for results.
        </p>
      </section>

      {/* PRICING */}
      <section id="pricing" className="hero">
        <h2 className="title" style={{ fontSize: "42px" }}>
          Simple pricing
        </h2>
        <p className="subtitle">
          Free, Pro, and Elite plans designed for progression at every level.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="hero">
        <h2 className="title" style={{ fontSize: "42px" }}>
          FAQ
        </h2>
        <p className="subtitle">
          Yes, it works on mobile. Yes, you can export data. Yes, it's free to start.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="hero">
        <p className="subtitle">
          © {new Date().getFullYear()} NymFit
        </p>
      </footer>

    </div>
  );
}
