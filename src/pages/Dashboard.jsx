import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LogoSlot from '../components/LogoSlot'
import RegistrationForm from '../components/RegistrationForm'
import StatusBadge from '../components/StatusBadge'
import { Alert, Button, Spinner } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { friendlyError, getMyRegistration, saveRegistration } from '../lib/registrations'

const EDITABLE = ['draft', 'submitted']
const fmt = (iso) =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

function Detail({ label, children }) {
  return (
    <div>
      <dt className="text-sm font-semibold text-primary">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-wrap break-words">{children}</dd>
    </div>
  )
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [registration, setRegistration] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [notice, setNotice] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      setRegistration(await getMyRegistration(user.id))
    } catch (err) {
      setLoadError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    load()
  }, [load])

  async function handleSave(values) {
    setSaving(true)
    setSaveError('')
    try {
      const wasEdit = Boolean(registration)
      const saved = await saveRegistration(user.id, values, registration)
      setRegistration(saved)
      setEditing(false)
      setNotice(wasEdit ? 'Your changes were saved.' : 'Your registration was submitted.')
      window.scrollTo({ top: 0 })
    } catch (err) {
      setSaveError(friendlyError(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    navigate('/', { replace: true })
  }

  const canEdit = registration && EDITABLE.includes(registration.status)

  return (
    <div className="min-h-screen">
      <header className="border-b-2 border-primary/20">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" aria-label="Back to home">
            <LogoSlot src="/logos/hult-prize.png" alt="Hult Prize logo" className="h-11 w-32" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-48 truncate text-sm sm:inline">{user.email}</span>
            <Button variant="soft" onClick={handleSignOut} loading={signingOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        {loading ? (
          <Spinner label="Loading your registration…" className="py-20" />
        ) : loadError ? (
          <div className="space-y-4">
            <Alert>{loadError}</Alert>
            <Button onClick={load}>Try again</Button>
          </div>
        ) : !registration || editing ? (
          <section className="rounded-3xl bg-base-200 p-6 sm:p-10">
            <h1 className="font-display text-4xl font-extrabold text-primary">
              {registration ? 'Edit your registration' : 'Register your team'}
            </h1>
            <p className="mb-8 mt-2">
              {registration ? 'Update any detail and save.' : 'Fill in your team and idea details to enter Hult Prize at BAIUST.'}
            </p>
            <RegistrationForm
              initial={registration}
              userEmail={user.email}
              saving={saving}
              error={saveError}
              onSubmit={handleSave}
              onCancel={() => {
                setEditing(false)
                setSaveError('')
              }}
            />
          </section>
        ) : (
          <section className="space-y-6">
            {notice && <Alert tone="success">{notice}</Alert>}

            <div className="rounded-3xl bg-base-200 p-6 sm:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-4xl font-extrabold text-primary">{registration.team_name}</h1>
                  <p className="mt-1 text-lg">{registration.project_title}</p>
                </div>
                <StatusBadge status={registration.status} />
              </div>

              <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                <Detail label="Team leader">{registration.leader_name}</Detail>
                <Detail label="Leader email">{registration.email}</Detail>
                <Detail label="Phone">{registration.phone}</Detail>
                <Detail label="Institution">{registration.institution}</Detail>
                <div className="sm:col-span-2">
                  <Detail label="Other team members">
                    {registration.team_members.length === 0
                      ? 'None'
                      : registration.team_members.map((m, i) => (
                          <span key={i} className="block">
                            {m.name}
                            {m.email ? ` (${m.email})` : ''}
                          </span>
                        ))}
                  </Detail>
                </div>
                <div className="sm:col-span-2">
                  <Detail label="The problem">{registration.problem_summary}</Detail>
                </div>
                <div className="sm:col-span-2">
                  <Detail label="Your solution">{registration.solution_summary}</Detail>
                </div>
              </dl>

              <p className="mt-8 text-sm">
                Submitted {fmt(registration.created_at)}
                {registration.updated_at !== registration.created_at && ` · Last updated ${fmt(registration.updated_at)}`}
              </p>

              <div className="mt-6">
                {canEdit ? (
                  <Button
                    onClick={() => {
                      setNotice('')
                      setEditing(true)
                    }}
                  >
                    Edit registration
                  </Button>
                ) : (
                  <Alert tone="info">This registration is locked while organisers review it. Contact the Hult Prize team if something needs to change.</Alert>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
