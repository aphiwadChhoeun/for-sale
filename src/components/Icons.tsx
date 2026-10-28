interface IconProps {
  size?: number
  className?: string
}

function base(size: number, className: string) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    className: `icon ${className}`,
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
}

export function IconSound({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 9.5 H7 L11.5 5 V19 L7 14.5 H4 Z" />
      <path d="M15 8.5 C 17 10 17 14 15 15.5" />
      <path d="M17.5 5.8 C 21 8.2 21 15.8 17.5 18.2" />
    </svg>
  )
}

export function IconMute({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 9.5 H7 L11.5 5 V19 L7 14.5 H4 Z" />
      <path d="M16 9 L21 15 M21 9 L16 15" />
    </svg>
  )
}

export function IconHelp({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.4 9.2 C 9.6 7.6 10.7 6.7 12.2 6.7 C 13.9 6.7 15 7.8 15 9.2 C 15 11.5 12.2 11.5 12.2 13.7" />
      <circle cx="12.2" cy="17.1" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconClose({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M6 6 L18 18 M18 6 L6 18" />
    </svg>
  )
}

export function IconDoor({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M5 4 H14 V20 H5 Z" />
      <path d="M10 4 V20" opacity="0.5" />
      <path d="M14 12 H21 M18 9 L21 12 L18 15" />
    </svg>
  )
}

export function IconTrophy({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M8 4 H16 V9 C 16 12 14.2 14 12 14 C 9.8 14 8 12 8 9 Z" />
      <path d="M8 5.5 H5.5 C 4.4 5.5 4 6.3 4 7 C 4 9.4 5.9 10.5 8 10.5" />
      <path d="M16 5.5 H18.5 C 19.6 5.5 20 6.3 20 7 C 20 9.4 18.1 10.5 16 10.5" />
      <path d="M12 14 V17 M8.5 20 H15.5 L14.5 17 H9.5 Z" />
    </svg>
  )
}

export function IconHouse({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M3.5 11 L12 3.5 L20.5 11" />
      <path d="M5.5 9.8 V20 H18.5 V9.8" />
      <path d="M10 20 V14.5 H14 V20" />
    </svg>
  )
}

export function IconCheck({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4.5 12.5 L9.5 17.5 L19.5 6.5" />
    </svg>
  )
}

export function IconCrown({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M3 8 L7 12 L12 5 L17 12 L21 8 L19 18 H5 Z" />
      <path d="M5 18 H19" />
    </svg>
  )
}

export function IconArrowRight({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 12 H19 M14 7 L19 12 L14 17" />
    </svg>
  )
}

export function IconChevronDown({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M6 9 L12 15 L18 9" />
    </svg>
  )
}

export function IconGavel({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M13.5 5.5 L18.5 10.5" />
      <path d="M9.5 6.5 L17.5 14.5 L15.5 16.5 L7.5 8.5 Z" />
      <path d="M6.5 13.5 L3.5 16.5 L7.5 20.5 L10.5 17.5" />
      <path d="M14 3.5 L20.5 10" opacity="0.55" />
    </svg>
  )
}

export function IconSparkle({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 3 C 12.7 8.4 15.6 11.3 21 12 C 15.6 12.7 12.7 15.6 12 21 C 11.3 15.6 8.4 12.7 3 12 C 8.4 11.3 11.3 8.4 12 3 Z" />
    </svg>
  )
}

export function IconLock({ size = 20, className = '' }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8.5 10.5 V8 C 8.5 5.5 10 4 12 4 C 14 4 15.5 5.5 15.5 8 V10.5" />
      <circle cx="12" cy="15.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}


