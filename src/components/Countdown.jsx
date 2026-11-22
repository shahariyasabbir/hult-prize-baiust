import { useEffect, useState } from 'react'

const DEADLINE = new Date(import.meta.env.VITE_REGISTRATION_DEADLINE || '2026-12-31T23:59:59+06:00')

function split(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    Days: Math.floor(s / 86400),
    Hours: Math.floor((s % 86400) / 3600),
    Minutes: Math.floor((s % 3600) / 60),
    Seconds: s % 60,
  }
}

export default function Countdown() {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = DEADLINE.getTime() - now
  if (Number.isNaN(remaining)) return null

  if (remaining <= 0) {
    return <p className="text-lg font-bold">Registration deadline has passed.</p>
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" role="timer" aria-label="Time left to register">
      {Object.entries(split(remaining)).map(([unit, value]) => (
        <div key={unit} className="rounded-2xl bg-ink px-2 py-3 text-center">
          <div className="font-display text-3xl font-extrabold tabular-nums text-base-300 sm:text-4xl">
            {String(value).padStart(2, '0')}
          </div>
          <div className="mt-1 text-xs font-medium text-base-200">{unit}</div>
        </div>
      ))}
    </div>
  )
}
