import type { CSSProperties } from 'react'

interface HouseArtProps {
  value: number
}

interface Palette {
  accent: string
  accentDeep: string
  soft: string
  disc: string
  ground: string
  paper: string
  water: string
  waterDeep: string
}

/* Muted colorways: each card gets its own sky, roof, joinery and foliage. */
const PALETTES: Palette[] = [
  {
    accent: '#1d6b53',
    accentDeep: '#15533f',
    soft: '#d7e8df',
    disc: '#e3efe8',
    ground: '#e9e6dd',
    paper: '#f3f4ee',
    water: '#cfe7e4',
    waterDeep: '#5f9c96',
  },
  {
    accent: '#b0812f',
    accentDeep: '#86601f',
    soft: '#f4e7c8',
    disc: '#f8efd9',
    ground: '#efe8d5',
    paper: '#f8f3e6',
    water: '#cfe7e4',
    waterDeep: '#5f9c96',
  },
  {
    accent: '#4e6d8a',
    accentDeep: '#3a5168',
    soft: '#dce8f1',
    disc: '#e6eef4',
    ground: '#e5e8e8',
    paper: '#eef3f6',
    water: '#cfe7e4',
    waterDeep: '#5f9c96',
  },
  {
    accent: '#9c5f70',
    accentDeep: '#794653',
    soft: '#f1dde2',
    disc: '#f6e8ec',
    ground: '#ede2e3',
    paper: '#f8f0f1',
    water: '#cfe7e4',
    waterDeep: '#5f9c96',
  },
  {
    accent: '#6f7a3e',
    accentDeep: '#555e2d',
    soft: '#e6ead4',
    disc: '#eef0df',
    ground: '#e9e7d8',
    paper: '#f3f4e9',
    water: '#cfe7e4',
    waterDeep: '#5f9c96',
  },
  {
    accent: '#b4553f',
    accentDeep: '#8d3f2e',
    soft: '#f2dcd4',
    disc: '#f7e6df',
    ground: '#eee3db',
    paper: '#f9f1eb',
    water: '#cfe7e4',
    waterDeep: '#5f9c96',
  },
]

/* A small, flat architectural drawing set: paper, ink and a colorway. */
const PAPER = 'var(--art-paper)'
const SURFACE = '#ffffff'
const INK = '#1b211e'
const LINE = 'rgba(27, 33, 30, 0.62)'
const SOFT_LINE = 'rgba(27, 33, 30, 0.18)'
const STONE = '#e5e1d7'
const GROUND = 'var(--art-ground)'
const DISC = 'var(--art-disc)'
const ACCENT = 'var(--art-accent)'
const ACCENT_DEEP = 'var(--art-accent-deep)'
const ACCENT_SOFT = 'var(--art-soft)'
const WATER = 'var(--art-water)'
const WATER_DEEP = 'var(--art-water-deep)'

function Window({
  x,
  y,
  w,
  h,
  cols = 1,
  rows = 1,
}: {
  x: number
  y: number
  w: number
  h: number
  cols?: number
  rows?: number
}) {
  const verticals = Array.from({ length: Math.max(0, cols - 1) }, (_, index) => (
    <line
      key={`v-${index}`}
      x1={x + (w / cols) * (index + 1)}
      y1={y}
      x2={x + (w / cols) * (index + 1)}
      y2={y + h}
    />
  ))
  const horizontals = Array.from({ length: Math.max(0, rows - 1) }, (_, index) => (
    <line
      key={`h-${index}`}
      x1={x}
      y1={y + (h / rows) * (index + 1)}
      x2={x + w}
      y2={y + (h / rows) * (index + 1)}
    />
  ))

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={ACCENT_SOFT}
        stroke={SOFT_LINE}
        strokeWidth="0.8"
      />
      <g stroke={INK} strokeWidth="0.6" opacity="0.28">
        {verticals}
        {horizontals}
      </g>
    </g>
  )
}

function Door({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={ACCENT} />
      <circle cx={x + w - 2.2} cy={y + h / 2} r="0.8" fill={SURFACE} opacity="0.9" />
    </g>
  )
}

function Tree({
  x,
  y,
  scale = 1,
  kind = 'round',
}: {
  x: number
  y: number
  scale?: number
  kind?: 'round' | 'column'
}) {
  if (kind === 'column') {
    return (
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <line x1="0" y1="0" x2="0" y2="-5" stroke={INK} strokeWidth="1.2" opacity="0.55" />
        <path
          d="M0 -3 C -5 -9 -5 -20 0 -28 C 5 -20 5 -9 0 -3 Z"
          fill={ACCENT_SOFT}
          stroke={ACCENT}
          strokeWidth="1"
        />
      </g>
    )
  }

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <line x1="0" y1="0" x2="0" y2="-11" stroke={INK} strokeWidth="1.2" opacity="0.55" />
      <circle cx="0" cy="-18" r="8" fill={ACCENT_SOFT} stroke={ACCENT} strokeWidth="1" />
    </g>
  )
}

function Topiary({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-4" y="-4" width="8" height="5" rx="1" fill={STONE} stroke={SOFT_LINE} strokeWidth="0.6" />
      <circle cx="0" cy="-10" r="6" fill={ACCENT_SOFT} stroke={ACCENT} strokeWidth="0.9" />
    </g>
  )
}

function Pool({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height="7"
        rx="3.5"
        fill={WATER}
        stroke={WATER_DEEP}
        strokeWidth="0.8"
        strokeOpacity="0.35"
      />
      <path
        d={`M${x + 5} ${y + 4} Q ${x + w / 2} ${y + 5.5} ${x + w - 5} ${y + 4}`}
        fill="none"
        stroke={WATER_DEEP}
        strokeWidth="0.7"
        opacity="0.4"
      />
    </g>
  )
}

function Cottage({ value }: { value: number }) {
  const flip = value % 2 === 0
  const chimneyX = flip ? 62 : 93
  const treeX = flip ? 130 : 30

  return (
    <g>
      <ellipse cx="80" cy="120" rx="38" ry="3" fill={INK} opacity="0.05" />
      <rect
        x={chimneyX}
        y="76"
        width="5"
        height="18"
        fill={SURFACE}
        stroke={LINE}
        strokeWidth="1"
      />
      <rect
        x="58"
        y="90"
        width="44"
        height="30"
        fill={SURFACE}
        stroke={LINE}
        strokeWidth="1.2"
      />
      <path d="M52 92 L80 71 L108 92 Z" fill={ACCENT} />
      <path d="M52 92 H108" stroke={ACCENT_DEEP} strokeWidth="1.2" opacity="0.35" />
      <Door x={76} y={102} w={10} h={18} />
      <Window x={64} y={97} w={8} h={9} />
      <Window x={89} y={97} w={8} h={9} />
      <rect
        x={flip ? 46 : 98}
        y={114}
        width={16}
        height={5}
        rx={2.5}
        fill={ACCENT_SOFT}
      />
      <path d="M76 120 L72 130 H88 L84 120 Z" fill={STONE} opacity="0.9" />
      <Tree x={treeX} y={120} scale={flip ? 0.92 : 0.82} />
    </g>
  )
}

function Bungalow({ value }: { value: number }) {
  const flip = value % 2 === 0
  const treeX = flip ? 24 : 136

  return (
    <g>
      <ellipse cx="80" cy="121" rx="50" ry="3" fill={INK} opacity="0.05" />
      <rect
        x="36"
        y="94"
        width="88"
        height="26"
        fill={SURFACE}
        stroke={LINE}
        strokeWidth="1.2"
      />
      <path d="M28 96 L80 77 L132 96 Z" fill={ACCENT} />
      <path d="M28 96 H132" stroke={ACCENT_DEEP} strokeWidth="1.2" opacity="0.35" />
      <Window x={44} y={99} w={28} h={14} cols={3} />
      <Window x={100} y={99} w={16} h={14} cols={2} />
      <Door x={80} y={101} w={12} h={19} />
      <rect x={78} y={97} width={16} height={3} fill={ACCENT} />
      <rect x={44} y={115} width={28} height={3} rx={1.5} fill={ACCENT_SOFT} />
      <path d="M80 120 L76 129 H92 L88 120 Z" fill={STONE} opacity="0.9" />
      <Tree x={treeX} y={120} scale={0.86} />
      {value >= 9 && <Pool x={flip ? 106 : 18} y={124} w={34} />}
    </g>
  )
}

function Townhouse({ value }: { value: number }) {
  const threeFloors = value >= 13
  const top = threeFloors ? 58 : 72
  const flip = value % 2 === 0

  return (
    <g>
      <rect x="38" y={threeFloors ? 80 : 82} width="20" height={threeFloors ? 40 : 38} fill={STONE} />
      <rect x="102" y={threeFloors ? 72 : 78} width="20" height={threeFloors ? 48 : 42} fill={STONE} />
      <g fill={SURFACE} opacity="0.7">
        <rect x="43" y={threeFloors ? 87 : 89} width="5" height="6" />
        <rect x="51" y={threeFloors ? 87 : 89} width="5" height="6" />
        <rect x="43" y={threeFloors ? 100 : 102} width="5" height="6" />
        <rect x="51" y={threeFloors ? 100 : 102} width="5" height="6" />
        <rect x="107" y={threeFloors ? 79 : 85} width="5" height="6" />
        <rect x="115" y={threeFloors ? 79 : 85} width="5" height="6" />
        <rect x="107" y={threeFloors ? 92 : 98} width="5" height="6" />
        <rect x="115" y={threeFloors ? 92 : 98} width="5" height="6" />
      </g>
      <rect x="58" y={top} width="44" height={120 - top} fill={SURFACE} stroke={LINE} strokeWidth="1.2" />
      <rect x="54" y={top - 4} width="52" height="5" fill={ACCENT} />
      <rect x="58" y={top} width="44" height="2" fill={ACCENT_SOFT} />
      <Window x={64} y={top + 7} w={11} h={13} rows={2} />
      <Window x={85} y={top + 7} w={11} h={13} rows={2} />
      {threeFloors && (
        <>
          <Window x={64} y={top + 27} w={11} h={13} rows={2} />
          <Window x={85} y={top + 27} w={11} h={13} rows={2} />
          <Window x={85} y={103} w={11} h={12} />
        </>
      )}
      {!threeFloors && <Window x={85} y={104} w={11} h={12} />}
      <Door x={68} y={103} w={12} h={17} />
      <path d="M66 101 H82 L79 97 H69 Z" fill={ACCENT} opacity="0.9" />
      <rect x="68" y="120" width="14" height="3" fill={STONE} />
      <Topiary x={flip ? 30 : 110} y={120} scale={0.9} />
      <Tree x={flip ? 136 : 24} y={120} scale={0.78} kind="column" />
    </g>
  )
}

function ModernHouse({ value }: { value: number }) {
  const flip = value % 2 === 0
  const upperX = flip ? 72 : 48
  const poolX = flip ? 16 : 108
  const treeX = flip ? 136 : 22

  return (
    <g>
      <ellipse cx="80" cy="121" rx="54" ry="3" fill={INK} opacity="0.05" />
      <rect x="34" y="88" width="92" height="32" fill={SURFACE} stroke={LINE} strokeWidth="1.2" />
      <rect x="34" y="88" width="92" height="3" fill={ACCENT_SOFT} />
      <rect x={upperX} y="64" width="48" height="24" fill={SURFACE} stroke={LINE} strokeWidth="1.2" />
      <rect x={upperX - 2} y="61" width="52" height="4" fill={ACCENT} />
      <Window x={upperX + 5} y={69} w={38} h={13} cols={3} />
      <Window x={44} y={95} w={26} h={20} cols={2} />
      <Window x={96} y={95} w={20} h={20} cols={2} />
      <Door x={78} y={98} w={12} h={22} />
      <g stroke={INK} strokeWidth="0.8" opacity="0.35">
        <path d={flip ? 'M34 88 H70' : 'M90 88 H126'} />
        <path d={flip ? 'M40 88 V84 M48 88 V84 M56 88 V84 M64 88 V84' : 'M96 88 V84 M104 88 V84 M112 88 V84 M120 88 V84'} />
      </g>
      <line x1={flip ? 114 : 46} y1="64" x2={flip ? 114 : 46} y2="56" stroke={INK} strokeWidth="1" opacity="0.45" />
      <Pool x={poolX} y={124} w={34} />
      <Tree x={treeX} y={120} scale={0.82} />
      {value >= 19 && (
        <g stroke={INK} strokeWidth="0.9" opacity="0.28">
          <path d={flip ? 'M86 64 V58 M94 64 V58 M102 64 V58 M110 64 V58' : 'M50 64 V58 M58 64 V58 M66 64 V58 M74 64 V58'} />
          <path d={flip ? 'M84 58 H112' : 'M48 58 H76'} />
        </g>
      )}
    </g>
  )
}

function Villa({ value }: { value: number }) {
  const wide = value >= 24

  return (
    <g>
      <ellipse cx="80" cy="121" rx="56" ry="3" fill={INK} opacity="0.05" />
      <rect x="30" y="86" width="100" height="34" fill={SURFACE} stroke={LINE} strokeWidth="1.2" />
      <path d="M24 88 L80 66 L136 88 Z" fill={ACCENT} />
      <path d="M24 88 H136" stroke={ACCENT_DEEP} strokeWidth="1.2" opacity="0.35" />
      <rect x="30" y="86" width="100" height="3" fill={ACCENT_SOFT} />
      <Window x={38} y={95} w={14} h={15} rows={2} />
      <Window x={108} y={95} w={14} h={15} rows={2} />
      <rect x="64" y="92" width="32" height="28" fill={SURFACE} stroke={LINE} strokeWidth="1" />
      <path d="M62 92 L80 80 L98 92 Z" fill={ACCENT_SOFT} stroke={SOFT_LINE} strokeWidth="0.8" />
      <Door x={75} y={102} w={10} h={18} />
      <g stroke={INK} strokeWidth="1" opacity="0.4">
        <path d="M68 94 V118 M92 94 V118" />
      </g>
      <Pool x={wide ? 48 : 58} y={124} w={wide ? 64 : 44} />
      <Topiary x={24} y={120} scale={0.95} />
      <Topiary x={136} y={120} scale={0.95} />
      {wide && (
        <g>
          <line x1="80" y1="66" x2="80" y2="56" stroke={INK} strokeWidth="1" opacity="0.5" />
          <circle cx="80" cy="55" r="2" fill={ACCENT} />
        </g>
      )}
    </g>
  )
}

function Tower({ value }: { value: number }) {
  const tall = value >= 29
  const top = tall ? 38 : 46
  const rows = tall ? 6 : 5
  const treeX = value % 2 === 0 ? 128 : 32

  return (
    <g>
      <rect x="20" y="82" width="22" height="38" fill={STONE} opacity="0.9" />
      <rect x="118" y="90" width="22" height="30" fill={STONE} opacity="0.9" />
      <ellipse cx="80" cy="121" rx="42" ry="3" fill={INK} opacity="0.05" />
      <rect x="62" y={top} width="36" height={120 - top} fill={SURFACE} stroke={LINE} strokeWidth="1.2" />
      <rect x="62" y={top} width="4" height={120 - top} fill={ACCENT} opacity="0.9" />
      <rect x="58" y={top - 4} width="44" height="4" fill={ACCENT} />
      <rect x="68" y={top - 12} width="24" height="8" fill={ACCENT_SOFT} stroke={SOFT_LINE} strokeWidth="0.8" />
      {Array.from({ length: rows }, (_, index) => (
        <g key={index}>
          <Window x={70} y={top + 7 + index * 11} w={8} h={7} />
          <Window x={84} y={top + 7 + index * 11} w={8} h={7} />
        </g>
      ))}
      <rect x="74" y="108" width="14" height="12" fill={ACCENT} />
      <rect x="71" y="105" width="20" height="3" fill={ACCENT} />
      <g stroke={INK} strokeWidth="0.8" opacity="0.3">
        <path d="M64 80 H96" />
        <path d="M64 80 V83 M74 80 V83 M84 80 V83 M94 80 V83" />
      </g>
      <line x1="80" y1={top - 12} x2="80" y2={top - 27} stroke={INK} strokeWidth="1" opacity="0.5" />
      {tall ? (
        <path d={`M80 ${top - 29} L92 ${top - 25} L80 ${top - 21} Z`} fill={ACCENT} />
      ) : (
        <circle cx="80" cy={top - 29} r="2" fill={ACCENT} />
      )}
      <Tree x={treeX} y={120} scale={0.82} />
      <Topiary x={value % 2 === 0 ? 34 : 126} y={120} scale={0.8} />
    </g>
  )
}

export function HouseArt({ value }: HouseArtProps) {
  const tier =
    value <= 5 ? 0 : value <= 10 ? 1 : value <= 15 ? 2 : value <= 20 ? 3 : value <= 25 ? 4 : 5
  const palette = PALETTES[(value - 1) % PALETTES.length]
  const style = {
    '--art-accent': palette.accent,
    '--art-accent-deep': palette.accentDeep,
    '--art-soft': palette.soft,
    '--art-disc': palette.disc,
    '--art-ground': palette.ground,
    '--art-paper': palette.paper,
    '--art-water': palette.water,
    '--art-water-deep': palette.waterDeep,
  } as CSSProperties

  return (
    <svg
      className="house-art"
      viewBox="0 0 160 150"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      style={style}
    >
      <rect width="160" height="150" fill={PAPER} />
      <circle cx="112" cy="46" r="30" fill={DISC} />
      <rect y="120" width="160" height="30" fill={GROUND} />
      <path d="M14 120 H146" stroke={INK} strokeOpacity="0.14" strokeWidth="1" />
      {tier === 0 && <Cottage value={value} />}
      {tier === 1 && <Bungalow value={value} />}
      {tier === 2 && <Townhouse value={value} />}
      {tier === 3 && <ModernHouse value={value} />}
      {tier === 4 && <Villa value={value} />}
      {tier === 5 && <Tower value={value} />}
    </svg>
  )
}
