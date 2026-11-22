import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, supabaseConfigError } from '../lib/supabaseClient'

const AuthContext = createContext(null)

const missingConfigResult = async () => ({
  data: { session: null, user: null },
  error: new Error(supabaseConfigError),
})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return undefined

    let active = true

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setSession(data.session)
      })
      .catch(() => {
        if (active) setSession(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      configError: supabaseConfigError,
      signUp: supabase
        ? (email, password, fullName) =>
            supabase.auth.signUp({
              email,
              password,
              options: {
                data: { full_name: fullName },
                emailRedirectTo: `${window.location.origin}/dashboard`,
              },
            })
        : missingConfigResult,
      signIn: supabase
        ? (email, password) => supabase.auth.signInWithPassword({ email, password })
        : missingConfigResult,
      signOut: supabase ? () => supabase.auth.signOut() : async () => ({ error: null }),
    }),
    [session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
