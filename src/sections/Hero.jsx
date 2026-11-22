import { Link } from 'react-router-dom'
import LogoSlot from '../components/LogoSlot'
import Countdown from '../components/Countdown'
import { MOTTO } from '../data/content'

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 lg:grid-cols-2 lg:items-center lg:pt-20">
      <div>
        <h1 className="font-display text-6xl font-extrabold leading-[0.95] tracking-tight text-primary sm:text-7xl lg:text-8xl">
          {MOTTO}
        </h1>
        <p className="mt-6 max-w-md text-lg">
          Build a startup that tackles one of the 17 UN Sustainable Development Goals. Create an account and register
          your team for Hult Prize at BAIUST.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/#registration"
            className="rounded-full bg-primary px-7 py-3 font-semibold text-white hover:bg-ink"
          >
            Register your team
          </Link>
          <Link
            to="/#competition"
            className="rounded-full border-2 border-primary bg-base-200 px-7 py-3 font-semibold hover:bg-white"
          >
            See competition details
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <LogoSlot src="/logos/hult-prize.png" alt="Hult Prize logo" className="h-20 w-40 shrink-0" />
          <img
            src="/logos/at.png"
            alt=""
            aria-hidden="true"
            draggable="false"
            className="h-[30px] w-auto shrink-0 select-none object-contain sm:h-[38px]"
          />
          <LogoSlot src="/logos/baiust.png" alt="BAIUST logo" className="h-20 w-40 shrink-0" />
        </div>

        <div className="rounded-3xl border-2 border-primary bg-base-200 p-5">
          <p className="mb-3 text-center font-semibold">Registration closes in</p>
          <Countdown />
        </div>
      </div>
    </section>
  )
}
