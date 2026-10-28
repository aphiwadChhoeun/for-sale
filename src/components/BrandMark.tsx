interface BrandMarkProps {
  size?: number
  className?: string
}

export function BrandMark({ size = 36, className = '' }: BrandMarkProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.35" />
      <path d="M11 22 L20 12 L29 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 21.5 V29 H26.5 V21.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="18" y="24" width="4" height="5" fill="currentColor" />
      <path d="M8 31.5 H32" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-lockup ${compact ? 'brand-lockup--compact' : ''}`}>
      <BrandMark size={compact ? 28 : 38} />
      <span className="brand-lockup__text">
        <span className="brand-lockup__for">For</span>
        <span className="brand-lockup__sale">Sale</span>
      </span>
    </span>
  )
}
