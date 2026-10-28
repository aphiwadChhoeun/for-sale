import { useId } from 'react'

interface AvatarProps {
  index: number
  size?: number
  className?: string
}

type AvatarStyle = {
  bg: string
  skin: string
  skinShade: string
  hair: string
  shirt: string
  shirtDark: string
  accessory: string
}

const AVATARS: AvatarStyle[] = [
  {
    bg: '#E9B44C',
    skin: '#F0C49E',
    skinShade: '#D9A47C',
    hair: '#2D211B',
    shirt: '#155C4C',
    shirtDark: '#0E4237',
    accessory: '#E8E0C8',
  },
  {
    bg: '#C96A4E',
    skin: '#C98B62',
    skinShade: '#A96D48',
    hair: '#251A15',
    shirt: '#274A42',
    shirtDark: '#19332D',
    accessory: '#E8C77A',
  },
  {
    bg: '#8FAE97',
    skin: '#F1C6A4',
    skinShade: '#D7A57F',
    hair: '#6B3A2A',
    shirt: '#7C3037',
    shirtDark: '#5C2027',
    accessory: '#F0C96A',
  },
  {
    bg: '#9A8FB8',
    skin: '#8D5A3B',
    skinShade: '#70442B',
    hair: '#17110F',
    shirt: '#243B45',
    shirtDark: '#172A33',
    accessory: '#E7D8B8',
  },
  {
    bg: '#7FB4C4',
    skin: '#D9A47B',
    skinShade: '#BE8760',
    hair: '#2A1B14',
    shirt: '#C26B3A',
    shirtDark: '#9A4F26',
    accessory: '#F4E4C0',
  },
  {
    bg: '#B56745',
    skin: '#E7B089',
    skinShade: '#C58E69',
    hair: '#3A2B22',
    shirt: '#2B4D5C',
    shirtDark: '#1C3743',
    accessory: '#EBD9B4',
  },
]

function Face({ style, index }: { style: AvatarStyle; index: number }) {
  const eyeY = 28
  const eyeColor = '#241B18'
  return (
    <>
      <ellipse cx="32" cy="28" rx="12.5" ry="14" fill={style.skin} />
      <ellipse cx="32" cy="31.5" rx="12.5" ry="10.5" fill={style.skinShade} opacity="0.12" />
      <ellipse cx="20.5" cy="28" rx="2.4" ry="3" fill={style.skin} />
      <ellipse cx="43.5" cy="28" rx="2.4" ry="3" fill={style.skin} />

      {index === 0 && (
        <>
          <path
            d="M19 24 C 20 15 27 11 33 12 C 40 12 44 17 45 24 C 41 20 36 18 32 18 C 27 18 22 20 19 24 Z"
            fill={style.hair}
          />
          <path d="M21 24 C 24 21 29 19 33 19" stroke={style.hair} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      {index === 1 && (
        <>
          <path d="M20 22 C 24 16 41 16 44 22 L43 25 C 37 21 27 21 21 25 Z" fill={style.hair} />
          <path d="M17 22 H47 L45 26 H19 Z" fill={style.accessory} />
          <path d="M23 14 H41 L44 20 H20 Z" fill={style.shirtDark} />
          <path d="M20 20 H44 V22 H20 Z" fill={style.accessory} opacity="0.8" />
          <path d="M27 35 C 30 33 34 33 37 35" stroke={style.hair} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </>
      )}
      {index === 2 && (
        <>
          <path
            d="M18 33 C 15 19 22 11 32 11 C 43 11 49 19 46 33 C 46 38 44 41 42 42 L 42 26 C 38 21 26 21 22 26 L 22 42 C 20 40 18 37 18 33 Z"
            fill={style.hair}
          />
          <path d="M22 21 C 26 17 39 17 42 23 C 38 20 27 20 22 21 Z" fill={style.hair} />
          <circle cx="19" cy="35" r="2.1" fill={style.accessory} />
          <circle cx="45" cy="35" r="2.1" fill={style.accessory} />
        </>
      )}
      {index === 3 && (
        <>
          <path d="M20 24 C 21 15 29 11 35 12 C 42 13 45 18 44 24 C 40 20 35 19 31 19 C 27 19 23 21 20 24 Z" fill={style.hair} />
          <rect x="19" y="25" width="12" height="8" rx="3" fill="none" stroke={style.accessory} strokeWidth="1.5" />
          <rect x="33" y="25" width="12" height="8" rx="3" fill="none" stroke={style.accessory} strokeWidth="1.5" />
          <line x1="31" y1="28" x2="33" y2="28" stroke={style.accessory} strokeWidth="1.5" />
          <path d="M23 20 C 25 17 30 16 33 16" stroke={style.hair} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </>
      )}
      {index === 4 && (
        <>
          <g fill={style.hair}>
            <circle cx="21" cy="18" r="5" />
            <circle cx="28" cy="14" r="5" />
            <circle cx="36" cy="14" r="5" />
            <circle cx="43" cy="18" r="5" />
            <circle cx="19" cy="26" r="4" />
            <circle cx="45" cy="26" r="4" />
            <circle cx="22" cy="34" r="3.5" />
            <circle cx="42" cy="34" r="3.5" />
          </g>
          <circle cx="18" cy="36" r="2.5" fill="none" stroke={style.accessory} strokeWidth="1.2" />
          <circle cx="46" cy="36" r="2.5" fill="none" stroke={style.accessory} strokeWidth="1.2" />
        </>
      )}
      {index === 5 && (
        <>
          <path d="M22 20 C 25 17 39 17 42 20" stroke={style.hair} strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M22 34 C 25 39 39 39 42 34 C 41 41 38 44 32 44 C 26 44 23 41 22 34 Z" fill={style.hair} />
          <path d="M27 35 C 30 33 34 33 37 35" stroke={style.skinShade} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M26 48 L32 54 L38 48 L32 51 Z" fill={style.accessory} />
        </>
      )}

      <ellipse cx="27" cy={eyeY} rx="1.2" ry="1.4" fill={eyeColor} />
      <ellipse cx="37" cy={eyeY} rx="1.2" ry="1.4" fill={eyeColor} />
      <path d="M24.5 24.5 Q 27 23 29.5 24.5" stroke={style.hair} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M34.5 24.5 Q 37 23 39.5 24.5" stroke={style.hair} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M29 33.5 Q 32 35.2 35 33.5" stroke="#8A4F42" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </>
  )
}

export function Avatar({ index, size = 44, className = '' }: AvatarProps) {
  const style = AVATARS[index % AVATARS.length]
  const rawId = useId()
  const clipId = `avatar-clip-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <span
      className={`avatar ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <defs>
          <clipPath id={clipId}>
            <circle cx="32" cy="32" r="32" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect width="64" height="64" fill={style.bg} />
          <circle cx="50" cy="12" r="18" fill="#FFFFFF" opacity="0.08" />
          <path
            d="M8 64 C 9 49 19 45 32 45 C 45 45 55 49 56 64 Z"
            fill={style.shirt}
          />
          <path
            d="M26 44 H38 V51 C 35 54 29 54 26 51 Z"
            fill={style.skinShade}
          />
          <path
            d="M23 49 L32 56 L41 49 L38 62 H26 Z"
            fill={style.shirtDark}
          />
          <Face style={style} index={index} />
        </g>
        <circle cx="32" cy="32" r="31.25" fill="none" stroke="#000000" strokeOpacity="0.12" strokeWidth="1.5" />
      </svg>
    </span>
  )
}
