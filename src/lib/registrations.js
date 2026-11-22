import { supabase } from './supabaseClient'

/** Returns the signed-in contestant's registration, or null if none exists yet. */
export async function getMyRegistration(userId) {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

/** Creates the registration (first save) or updates it (later saves). */
export async function saveRegistration(userId, values, existing) {
  if (existing) {
    // `status` is intentionally not sent: contestants never change it.
    const { data, error } = await supabase
      .from('registrations')
      .update(values)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  }

  const { data, error } = await supabase
    .from('registrations')
    .insert({ ...values, user_id: userId, status: 'submitted' })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Turns Supabase/Postgres errors into messages a contestant can act on. */
export function friendlyError(err) {
  if (!err) return 'Something went wrong. Please try again.'
  if (err.code === '23505') return 'This account already has a registration. Reload the page to see it.'
  if (err.code === '42501') return 'This registration is locked and can no longer be edited.'
  if (err.code === '23514') return 'One of the fields is outside the allowed length or format. Check the form and try again.'
  if (err.message === 'Failed to fetch') return 'Cannot reach the server. Check your internet connection and try again.'
  return err.message || 'Something went wrong. Please try again.'
}
