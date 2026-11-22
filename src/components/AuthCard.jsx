import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alert, Button, Field } from './ui'

function friendlyAuthError(err) {
  const msg = err?.message ?? ''
  if (/invalid login credentials/i.test(msg)) return 'Email or password is incorrect.'
  if (/email not confirmed/i.test(msg)) return 'Confirm your email first. Check your inbox for the link we sent.'
  if (/already registered/i.test(msg)) return 'An account with this email already exists. Sign in instead.'
  if (/rate limit/i.test(msg)) return 'Too many attempts. Wait a few minutes and try again.'
  if (msg === 'Failed to fetch') return 'Cannot reach the server. Check your internet connection and try again.'
  return msg || 'Something went wrong. Please try again.'
}

export default function AuthCard() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const isSignUp = mode === 'signup'
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  function switchMode(next) {
    setMode(next)
    setErrors({})
    setFormError('')
    setNotice('')
  }

  function validate() {
    const e = {}
    if (isSignUp && !form.fullName.trim()) e.fullName = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address.'
    if (form.password.length < 8) e.password = 'Use at least 8 characters.'
    if (isSignUp && form.confirm !== form.password) e.confirm = 'Passwords do not match.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setFormError('')
    setNotice('')
    if (!validate()) return

    setBusy(true)
    try {
      const email = form.email.trim()
      if (isSignUp) {
        const { data, error } = await signUp(email, form.password, form.fullName.trim())
        if (error) throw error
        // With email confirmation on, Supabase hides duplicate emails by returning a user with no identities.
        if (data.user && data.user.identities?.length === 0) {
          throw new Error('User already registered')
        }
        if (data.session) {
          navigate('/dashboard', { replace: true })
        } else {
          setNotice(`We sent a confirmation link to ${email}. Open it, then sign in here.`)
          setMode('signin')
          setForm((f) => ({ ...f, password: '', confirm: '' }))
        }
      } else {
        const { error } = await signIn(email, form.password)
        if (error) throw error
        navigate(location.state?.from ?? '/dashboard', { replace: true })
      }
    } catch (err) {
      setFormError(friendlyAuthError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-3xl border-2 border-primary bg-base-200 p-6 shadow-lg sm:p-8">
      <div role="tablist" aria-label="Account" className="mb-6 grid grid-cols-2 rounded-full bg-white p-1">
        {[
          ['signin', 'Sign in'],
          ['signup', 'Create account'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            onClick={() => switchMode(key)}
            className={`rounded-full px-4 py-2 font-semibold transition-colors ${
              mode === key ? 'bg-primary text-white' : 'text-ink hover:bg-base-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {notice && <Alert tone="success">{notice}</Alert>}
        {formError && <Alert>{formError}</Alert>}

        {isSignUp && (
          <Field label="Full name" value={form.fullName} onChange={set('fullName')} error={errors.fullName} autoComplete="name" />
        )}
        <Field label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          hint={isSignUp ? 'At least 8 characters.' : undefined}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
        />
        {isSignUp && (
          <Field
            label="Confirm password"
            type="password"
            value={form.confirm}
            onChange={set('confirm')}
            error={errors.confirm}
            autoComplete="new-password"
          />
        )}

        <Button type="submit" loading={busy} className="w-full">
          {isSignUp ? 'Create account' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
