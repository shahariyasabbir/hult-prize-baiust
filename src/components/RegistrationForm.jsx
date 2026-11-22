import { useState } from 'react'
import { Alert, Button, Field } from './ui'

// Team = leader + extra members. Change these to match your campus rules.
// (The database allows at most 3 extra members; edit supabase/schema.sql too if you raise MAX.)
export const MIN_EXTRA_MEMBERS = 1
export const MAX_EXTRA_MEMBERS = 3

const EMAIL_RE = /^\S+@\S+\.\S+$/
const PHONE_RE = /^\+?[0-9][0-9\s-]{6,19}$/

function toValues(initial, userEmail) {
  return {
    team_name: initial?.team_name ?? '',
    leader_name: initial?.leader_name ?? '',
    email: initial?.email ?? userEmail ?? '',
    phone: initial?.phone ?? '',
    institution: initial?.institution ?? 'Bangladesh Army International University of Science and Technology (BAIUST)',
    team_members: initial?.team_members?.length ? initial.team_members : [{ name: '', email: '' }],
    project_title: initial?.project_title ?? '',
    problem_summary: initial?.problem_summary ?? '',
    solution_summary: initial?.solution_summary ?? '',
  }
}

function validate(v) {
  const e = {}
  if (v.team_name.trim().length < 2) e.team_name = 'Enter your team name.'
  if (v.leader_name.trim().length < 2) e.leader_name = 'Enter the team leader’s full name.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address.'
  if (!PHONE_RE.test(v.phone.trim())) e.phone = 'Enter a valid phone number, for example 01712345678.'
  if (v.institution.trim().length < 2) e.institution = 'Enter your university or institution.'
  if (v.team_members.length < MIN_EXTRA_MEMBERS) e.team_members = `Add at least ${MIN_EXTRA_MEMBERS} team member besides the leader.`
  v.team_members.forEach((m, i) => {
    if (m.name.trim().length < 2) e[`member_${i}_name`] = 'Enter this member’s name.'
    if (m.email.trim() && !EMAIL_RE.test(m.email.trim())) e[`member_${i}_email`] = 'Enter a valid email or leave it empty.'
  })
  if (v.project_title.trim().length < 2) e.project_title = 'Enter your project or startup title.'
  if (v.problem_summary.trim().length < 30) e.problem_summary = 'Describe the problem in at least 30 characters.'
  if (v.solution_summary.trim().length < 30) e.solution_summary = 'Describe your solution in at least 30 characters.'
  return e
}

export default function RegistrationForm({ initial, userEmail, saving, error, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => toValues(initial, userEmail))
  const [errors, setErrors] = useState({})
  const isEdit = Boolean(initial)

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))
  const setMember = (i, key) => (e) =>
    setValues((v) => ({
      ...v,
      team_members: v.team_members.map((m, idx) => (idx === i ? { ...m, [key]: e.target.value } : m)),
    }))
  const addMember = () =>
    setValues((v) => ({ ...v, team_members: [...v.team_members, { name: '', email: '' }] }))
  const removeMember = (i) =>
    setValues((v) => ({ ...v, team_members: v.team_members.filter((_, idx) => idx !== i) }))

  function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate(values)
    setErrors(e)
    if (Object.keys(e).length > 0) {
      document.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    onSubmit({
      team_name: values.team_name.trim(),
      leader_name: values.leader_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      institution: values.institution.trim(),
      team_members: values.team_members.map((m) => ({ name: m.name.trim(), email: m.email.trim() })),
      project_title: values.project_title.trim(),
      problem_summary: values.problem_summary.trim(),
      solution_summary: values.solution_summary.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {error && <Alert>{error}</Alert>}

      <fieldset className="space-y-4">
        <legend className="font-display text-2xl font-extrabold">Team</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Team name" value={values.team_name} onChange={set('team_name')} error={errors.team_name} maxLength={80} />
          <Field label="Team leader name" value={values.leader_name} onChange={set('leader_name')} error={errors.leader_name} maxLength={80} autoComplete="name" />
          <Field label="Leader email" type="email" value={values.email} onChange={set('email')} error={errors.email} autoComplete="email" />
          <Field label="Phone number" type="tel" value={values.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
          <Field className="sm:col-span-2" label="University / institution" value={values.institution} onChange={set('institution')} error={errors.institution} maxLength={150} />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-2xl font-extrabold">Other team members</legend>
        <p className="text-sm">The leader is already counted. Add {MIN_EXTRA_MEMBERS} to {MAX_EXTRA_MEMBERS} more.</p>
        {errors.team_members && <p role="alert" className="text-sm font-medium text-red-800">{errors.team_members}</p>}

        {values.team_members.map((m, i) => (
          <div key={i} className="grid gap-4 rounded-2xl bg-white/60 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
            <Field label={`Member ${i + 1} name`} value={m.name} onChange={setMember(i, 'name')} error={errors[`member_${i}_name`]} maxLength={80} />
            <Field label="Email (optional)" type="email" value={m.email} onChange={setMember(i, 'email')} error={errors[`member_${i}_email`]} />
            <Button variant="ghost" className="sm:mt-7" onClick={() => removeMember(i)} aria-label={`Remove member ${i + 1}`}>
              Remove
            </Button>
          </div>
        ))}

        {values.team_members.length < MAX_EXTRA_MEMBERS && (
          <Button variant="soft" onClick={addMember}>
            Add a team member
          </Button>
        )}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-2xl font-extrabold">Your idea</legend>
        <Field label="Project / startup title" value={values.project_title} onChange={set('project_title')} error={errors.project_title} maxLength={120} />
        <Field
          as="textarea"
          rows={4}
          label="The problem"
          hint={`${values.problem_summary.length}/1000 · What problem are you solving, and for whom?`}
          value={values.problem_summary}
          onChange={set('problem_summary')}
          error={errors.problem_summary}
          maxLength={1000}
        />
        <Field
          as="textarea"
          rows={4}
          label="Your solution"
          hint={`${values.solution_summary.length}/1000 · How does your idea solve it?`}
          value={values.solution_summary}
          onChange={set('solution_summary')}
          error={errors.solution_summary}
          maxLength={1000}
        />
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={saving}>
          {isEdit ? 'Save changes' : 'Submit registration'}
        </Button>
        {isEdit && (
          <Button variant="soft" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
