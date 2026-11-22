import { useState } from 'react'
import { Link } from 'react-router-dom'
import LogoSlot from './LogoSlot'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  ['About', '/#about'],
  ['Panel', '/#panel'],
  ['Competition details', '/#competition'],
  ['Registration', '/#registration'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-20 border-b-2 border-primary/20 bg-base-100/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Main">
        <Link to="/" className="shrink-0" aria-label="Hult Prize at BAIUST, home">
          <LogoSlot src="/logos/hult-prize.png" alt="Hult Prize logo" className="h-11 w-32" />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map(([label, to]) => (
            <li key={label}>
              <Link to={to} className="rounded-full px-4 py-2 font-medium hover:bg-base-200">
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to={user ? '/dashboard' : '/#registration'}
              className="ml-2 rounded-full bg-primary px-5 py-2 font-semibold text-white hover:bg-ink"
            >
              {user ? 'My registration' : 'Sign in'}
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className="rounded-full border-2 border-primary px-4 py-2 font-semibold md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="space-y-1 border-t-2 border-primary/20 px-4 py-3 md:hidden">
          {LINKS.map(([label, to]) => (
            <li key={label}>
              <Link to={to} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 font-medium hover:bg-base-200">
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to={user ? '/dashboard' : '/#registration'}
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-primary px-3 py-2 text-center font-semibold text-white"
            >
              {user ? 'My registration' : 'Sign in'}
            </Link>
          </li>
        </ul>
      )}
    </header>
  )
}
