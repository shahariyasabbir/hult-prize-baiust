import { ABOUT_TEXT, MOTTO, SDGS } from '../data/content'

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-3xl bg-base-200 p-6 sm:p-10">
        <h2 className="font-display text-4xl font-extrabold text-primary">About the Hult Prize</h2>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4 text-lg">
            {ABOUT_TEXT.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="rounded-2xl bg-primary p-6 text-white">
            <p className="font-display text-3xl font-extrabold">{MOTTO}</p>
            <p className="mt-2">Every idea must serve at least one of the 17 Sustainable Development Goals.</p>
          </div>
        </div>

        <h3 className="mt-10 font-display text-2xl font-extrabold">The 17 Sustainable Development Goals</h3>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SDGS.map((g) => (
            <li
              key={g.n}
              style={{ backgroundColor: g.color }}
              className={`flex min-h-28 flex-col justify-between rounded-xl p-3 ${g.dark ? 'text-ink' : 'text-white'}`}
            >
              <span className="font-display text-3xl font-extrabold">{g.n}</span>
              <span className="text-sm font-bold leading-tight">{g.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
