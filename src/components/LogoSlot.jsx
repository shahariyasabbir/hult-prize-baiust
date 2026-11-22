import { useState } from 'react'

/** Shows the logo image, or a labelled placeholder until the file exists in /public/logos. */
export default function LogoSlot({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-primary px-4 py-3 text-center text-sm font-bold text-primary ${className}`}
      >
        {alt}
      </div>
    )
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} className={`object-contain ${className}`} />
}
