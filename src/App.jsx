export default function App() {
  return (
    <div className="page">
      {/* background glow */}
      <div className="bg" />

      {/* NAV */}
      <header className="nav">
        <div className="logo">NymFit</div>

        <div className="profile">
          <div className="avatar">🌸</div>
          <span>Artemis</span>
        </div>
      </header>

      {/* HERO */}
      <main className="hero">
        <div className="pill">
          ✨ Your femme body made easy
        </div>

        <h1 className="title">
          soft curves,<br />
          softer you.
        </h1>

        <p className="subtitle">
          Track your feminization journey, shape your silhouette &amp; celebrate every soft, beautiful win.
        </p>

        <button className="cta">
          start your glow-up ✨ →
        </button>
      </main>
    </div>
  )
}
