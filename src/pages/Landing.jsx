import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AuthCard from '../components/AuthCard'
import { Alert, Button, Spinner } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Panel from '../sections/Panel'
import Competition from '../sections/Competition'

export default function Landing() {
  const { hash } = useLocation()
  const { user, loading, signOut, configError } = useAuth()

  // Scroll to #section when navigating with <Link to="/#section">.
  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Panel />
        <Competition />

        <section id="registration" className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-5xl font-extrabold leading-none text-primary sm:text-6xl">
                Register your team
              </h2>
              <ol className="mt-6 max-w-md list-decimal space-y-2 pl-5 text-lg">
                <li>Create an account with your email.</li>
                <li>Sign in and fill in your team and idea details.</li>
                <li>Come back any time to check your status or edit your submission.</li>
              </ol>
            </div>

            <div>
              {loading ? (
                <Spinner />
              ) : configError ? (
                <Alert>
                  Registration is unavailable because the app is not configured. {configError}
                </Alert>
              ) : user ? (
                <div className="rounded-3xl border-2 border-primary bg-base-200 p-8 text-center">
                  <p className="font-display text-2xl font-extrabold">You are signed in</p>
                  <p className="mt-1 break-all">{user.email}</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link to="/dashboard" className="rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-ink">
                      Go to my registration
                    </Link>
                    <Button variant="soft" onClick={signOut}>
                      Sign out
                    </Button>
                  </div>
                </div>
              ) : (
                <AuthCard />
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-primary/20 px-4 py-8 text-center text-sm">
        Hult Prize at BAIUST
      </footer>
    </>
  )
}
