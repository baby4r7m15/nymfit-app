export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">

      {/* NAV */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wide">NymFit Clone</h1>
        <nav className="hidden md:flex gap-8 text-sm text-white/70">
          <a href="#features">Features</a>
          <a href="#progress">Progress</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
          Get Started
        </button>
      </header>

      {/* HERO */}
      <section className="relative px-8 pt-20 pb-32 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 via-transparent to-cyan-500/10 blur-3xl" />

        <h2 className="text-5xl md:text-6xl font-bold leading-tight">
          Train Smarter.
          <span className="block text-cyan-400">Track Everything.</span>
        </h2>

        <p className="mt-6 text-white/60 max-w-xl mx-auto">
          A modern fitness tracking experience built for progressive overload,
          habit building, and body transformation.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-cyan-500 text-black px-6 py-3 rounded-full font-semibold">
            Start Free Trial
          </button>
          <button className="border border-white/20 px-6 py-3 rounded-full">
            Learn More
          </button>
        </div>

        {/* Mock dashboard */}
        <div className="mt-16 mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="grid md:grid-cols-3 gap-4 text-left">
            <div className="p-4 bg-black/40 rounded-xl">
              <p className="text-white/50 text-sm">Weekly Volume</p>
              <p className="text-2xl font-bold text-cyan-400">12,430kg</p>
            </div>
            <div className="p-4 bg-black/40 rounded-xl">
              <p className="text-white/50 text-sm">Progress</p>
              <p className="text-2xl font-bold text-pink-400">+18%</p>
            </div>
            <div className="p-4 bg-black/40 rounded-xl">
              <p className="text-white/50 text-sm">Consistency</p>
              <p className="text-2xl font-bold text-green-400">92%</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-8 py-24 border-t border-white/10">
        <h3 className="text-3xl font-bold text-center mb-12">Everything you need</h3>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            ["Progress Tracking", "Track lifts, reps, and volume over time."],
            ["Smart Analytics", "Understand fatigue and performance trends."],
            ["Workout Plans", "Build structured progressive routines."]
          ].map(([title, desc]) => (
            <div key={title} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="font-semibold text-lg mb-2">{title}</h4>
              <p className="text-white/60 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRESS SECTION */}
      <section id="progress" className="px-8 py-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h3 className="text-3xl font-bold">Visualize your progress</h3>
            <p className="mt-4 text-white/60">
              See exactly how your strength evolves with clean analytics,
              weekly breakdowns, and muscle group tracking.
            </p>

            <ul className="mt-6 space-y-3 text-white/70 text-sm">
              <li>• Volume per muscle group</li>
              <li>• Estimated 1RM tracking</li>
              <li>• Fatigue monitoring</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-pink-500/10 border border-white/10 p-10 text-center">
            <p className="text-white/50">Progress Chart Mock</p>
            <div className="h-40 mt-6 flex items-end justify-center gap-2">
              <div className="w-4 h-20 bg-cyan-400"></div>
              <div className="w-4 h-28 bg-cyan-400"></div>
              <div className="w-4 h-32 bg-cyan-400"></div>
              <div className="w-4 h-40 bg-cyan-400"></div>
            </div>
          </div>

        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-8 py-24 border-t border-white/10">
        <h3 className="text-3xl font-bold text-center mb-12">Simple pricing</h3>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            ["Free", "$0", "Basic tracking & logs"],
            ["Pro", "$12", "Advanced analytics & plans"],
            ["Elite", "$24", "Full coaching system"]
          ].map(([name, price, desc]) => (
            <div key={name} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-xl font-semibold">{name}</h4>
              <p className="text-3xl font-bold mt-2">{price}</p>
              <p className="text-white/60 mt-2 text-sm">{desc}</p>

              <button className="mt-6 w-full bg-white text-black py-2 rounded-xl font-semibold">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-8 py-24">
        <h3 className="text-3xl font-bold text-center mb-12">FAQ</h3>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            ["Is it free?", "Yes, basic tracking is free forever."],
            ["Does it work on mobile?", "Yes, fully responsive."],
            ["Can I export data?", "Yes, Pro and above."]
          ].map(([q, a]) => (
            <div key={q} className="p-5 bg-white/5 border border-white/10 rounded-xl">
              <p className="font-semibold">{q}</p>
              <p className="text-white/60 text-sm mt-1">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-10 border-t border-white/10 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} NymFit Clone — Built for practice
      </footer>

    </div>
  );
}
