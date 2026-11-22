const STATUS = {
  draft: { label: 'Draft', cls: 'border-2 border-primary bg-base-200 text-ink' },
  submitted: { label: 'Submitted', cls: 'bg-primary text-white' },
  under_review: { label: 'Under review', cls: 'bg-base-300 text-ink' },
  accepted: { label: 'Accepted', cls: 'bg-brand-green text-white' },
  rejected: { label: 'Not selected', cls: 'bg-ink text-white' },
}

export default function StatusBadge({ status }) {
  const s = STATUS[status] ?? STATUS.submitted
  return (
    <span className={`inline-block rounded-full px-4 py-1 text-sm font-bold ${s.cls}`}>{s.label}</span>
  )
}
