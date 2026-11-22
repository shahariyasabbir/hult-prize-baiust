import { PANEL } from '../data/content'

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Panel() {
  return (
    <section id="panel" className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="font-display text-4xl font-extrabold text-primary">Meet the panel</h2>
      <p className="mt-2 max-w-xl">The team running Hult Prize at BAIUST this year.</p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PANEL.map((m, i) => (
          <li key={i} className="rounded-3xl border-2 border-primary bg-base-200 p-5 text-center">
            {m.photo ? (
              <img src={m.photo} alt={m.name} className="mx-auto h-28 w-28 rounded-full object-cover" />
            ) : (
              <div
                className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-secondary font-display text-3xl font-extrabold text-white"
                aria-hidden="true"
              >
                {initials(m.name)}
              </div>
            )}
            <h3 className="mt-4 font-display text-xl font-extrabold">{m.name}</h3>
            <p className="text-sm font-medium text-primary">{m.role}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
