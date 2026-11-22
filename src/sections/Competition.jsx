import { COMPETITION } from '../data/content'

export default function Competition() {
  return (
    <section id="competition" className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="font-display text-4xl font-extrabold text-primary">Competition details and timeline</h2>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMPETITION.map((c) => (
          <li key={c.title} className="rounded-3xl bg-ink p-6 text-base-200">
            <h3 className="font-display text-xl font-extrabold text-base-300">{c.title}</h3>
            <p className="mt-2">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
