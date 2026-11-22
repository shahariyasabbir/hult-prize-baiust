import { useId } from 'react'

export function Spinner({ label = 'Loading…', className = '' }) {
  return (
    <div role="status" className={`flex items-center justify-center gap-3 ${className}`}>
      <span
        className="h-6 w-6 animate-spin rounded-full border-4 border-primary/30 border-t-primary"
        aria-hidden="true"
      />
      <span className="font-medium">{label}</span>
    </div>
  )
}

const variants = {
  primary: 'bg-primary text-white hover:bg-ink',
  soft: 'border-2 border-primary bg-base-200 text-ink hover:bg-white',
  ghost: 'text-primary hover:bg-base-200',
}

export function Button({ variant = 'primary', loading = false, type = 'button', className = '', children, ...props }) {
  return (
    <button
      type={type}
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}

export function Field({ label, error, hint, as: Tag = 'input', className = '', ...props }) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      <Tag
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className="w-full rounded-xl border-2 border-primary/30 bg-white px-4 py-3 text-ink placeholder:text-ink/50 focus:border-primary"
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs text-ink/70">{hint}</p>}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1 text-sm font-medium text-red-800">
          {error}
        </p>
      )}
    </div>
  )
}

export function Alert({ tone = 'error', children }) {
  const tones = {
    error: 'border-red-800 text-red-800',
    success: 'border-brand-green text-brand-green',
    info: 'border-primary text-primary',
  }
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border-2 bg-white px-4 py-3 text-sm font-medium ${tones[tone]}`}
    >
      {children}
    </div>
  )
}
