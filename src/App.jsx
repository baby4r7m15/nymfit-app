export default function App() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 opacity-60 bg-gradient-to-br from-sky-400/20 via-white/5 to-pink-400/20 blur-3xl animate-pulse" />
      </div>

      {/* NAV */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-md">
        <div className="font-bold text-lg tracking-wide">NymFit</div>

        <nav className="hidden md:flex gap-8 text-sm text-white/60">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#progress" className="hover:text-white">Progress</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </nav>

        <button className="px-5 py-2 rounded-full bg-white text-black font-semibold text-sm">
          Open App
        </button>
      </header>

      {/* HERO */}
      <section className="relative px-8 pt-24 pb-28 text-center">

        {/* soft radial glow behind hero */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-3xl" />
          <div className="w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-3xl -ml-40" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight relative">
          Build your body.
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-pink-400">
            Track everything.
          </span>
        </h1>

        <p className="mt-6 text-white/60 max-w-xl mx-auto relative">
          NymFit helps you track workouts, monitor progression, and build a physique with
          structured, intelligent training data.
        </p>

        <div className="mt-8 flex justify-center gap-4 relative">
          <button className="px-6 py-3 rounded-full bg-cyan-400 text-black font-semibold">
            Get Started
          </button>
          <button className="px-6 py-3 rounded-full border border-white/20 text-white">
            View Demo
          </button>
        </div>

        {/* APP PREVIEW MOCK */}
        <div className="mt-16 max-w-5xl mx-auto relative">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">

            <div className="grid md:grid-cols-3 gap-4">

              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <p className="text-white/50 text-xs">Weekly Volume</p>
                <p className="text-2xl font-bold text-cyan-300">14,280 kg</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <p className="text-white/50 text-xs">Strength Trend</p>
                <p className="text-2xl font-bold text-pink-300">+22%</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <p className="text-white/50 text-xs">Consistency</p>
                <p className="text-2xl font-bold text-green-300">91%</p>
              </div>

            </div>

            {/* fake chart */}
            <div className="mt-8 h-40 flex items-end justify-center gap-2">
              <div className="w-4 h-16 bg-cyan-400/60 rounded" />
              <div className="w-4 h-24 bg-cyan-400/70 rounded" />
              <div className="w-4 h-28 bg-cyan-400/80 rounded" />
              <div className="w-4 h-36 bg-cyan-300 rounded" />
              <div className="w-4 h-32 bg-pink-400/80 rounded" />
              <div className="w-4 h-40 bg-pink-400 rounded" />
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-8 py-24 border-t border-white/10">
        <h2 className="text-3xl font-bold text-center">Everything you need to progress</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">

          {[
            ["Workout Tracking", "Log sets, reps, and weight with zero friction."],
            ["Progress Analytics", "See real strength progression over time."],
            ["Smart Structure", "Built-in progressive overload guidance."]
          ].map(([title, desc]) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
            >
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-white/60 text-sm mt-2">{desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* PROGRESS SECTION */}
      <section id="progress" className="px-8 py-24">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-4xl font-bold leading-tight">
              See your progress clearly
            </h2>

            <p className="mt-4 text-white/60">
              NymFit visualizes your training data so you always know exactly what’s improving
              and what needs work.
            </p>

            <div className="mt-6 space-y-3 text-white/70 text-sm">
              <p>• Muscle group volume breakdown</p>
              <p>• Strength progression tracking</p>
              <p>• Fatigue-aware training insights</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

            <p className="text-white/50 text-sm text-center">Performance Chart</p>

            <div className="mt-6 flex items-end justify-center gap-3 h-48">
              <div className="w-5 h-24 bg-cyan-400/60 rounded" />
              <div className="w-5 h-32 bg-cyan-400/70 rounded" />
              <div className="w-5 h-36 bg-cyan-300 rounded" />
              <div className="w-5 h-44 bg-pink-400/70 rounded" />
              <div className="w-5 h-40 bg-pink-400 rounded" />
            </div>

          </div>

        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-8 py-24 border-t border-white/10">
        <h2 className="text-3xl font-bold text-center">Simple pricing</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">

          {[
            ["Free", "$0", "Basic workout tracking"],
            ["Pro", "$9.99", "Advanced analytics + insights"],
            ["Elite", "$19.99", "Full optimization system"]
          ].map(([name, price, desc]) => (
            <div
              key={name}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-3xl font-bold mt-2">{price}</p>
              <p className="text-white/60 text-sm mt-2">{desc}</p>

              <button className="mt-6 w-full py-2 rounded-xl bg-white text-black font-semibold">
                Select
              </button>
            </div>
          ))}

        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-8 py-24">
        <h2 className="text-3xl font-bold text-center">FAQ</h2>

        <div className="max-w-3xl mx-auto mt-10 space-y-4">

          {[
            ["Is NymFit free?", "Yes, basic tracking is free."],
            ["Does it work on mobile?", "Yes, fully responsive design."],
            ["Can I export data?", "Available in Pro and Elite."]
          ].map(([q, a]) => (
            <div
              key={q}
              className="p-5 rounded-xl bg-white/5 border border-white/10"
            >
              <p className="font-semibold">{q}</p>
              <p className="text-white/60 text-sm mt-1">{a}</p>
            </div>
          ))}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-white/40 text-sm border-t border-white/10">
        © {new Date().getFullYear()} NymFit
      </footer>

    </div>
  );
}
