export default function App() {
  return (
    <div className="page">
      <div className="bgGlow" />

      <header className="nav">
        <div className="logo">NymFit</div>
        <button className="navBtn">Get Started</button>
      </header>

      <main className="hero">
        <h1>
          Build your body,<br />
          your way
        </h1>

        <p>
          A simple, aesthetic fitness tracker designed for consistency,
          comfort, and self-expression.
        </p>

        <div className="ctaRow">
          <button className="primaryBtn">Start Tracking</button>
          <button className="secondaryBtn">Learn More</button>
        </div>

        <div className="cardGrid">
          <div className="card">
            <h3>Workout Tracking</h3>
            <p>Log workouts without clutter or pressure.</p>
          </div>

          <div className="card">
            <h3>Habit Building</h3>
            <p>Small daily wins that actually stick.</p>
          </div>

          <div className="card">
            <h3>Soft Aesthetic</h3>
            <p>Designed to feel calm, not intimidating.</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Made with care ✨</p>
      </footer>
    </div>
  )
}
