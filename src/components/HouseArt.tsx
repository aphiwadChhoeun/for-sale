import { useId, type ReactNode } from 'react'

interface HouseArtProps {
  value: number
}

type Palette = {
  sky: [string, string]
  sun: string
  hillBack: string
  hillFront: string
  ground: string
  house: string
  houseAlt: string
  roof: string
  ink: string
  window: string
  pool: string
  accent: string
  hedge: string
}

const PALETTES: Palette[] = [
  {
    sky: ['#F9DCA6', '#EF9F6F'],
    sun: '#FFF7DC',
    hillBack: '#5E9B83',
    hillFront: '#2F6E59',
    ground: '#194C3E',
    house: '#F8EBD3',
    houseAlt: '#E9D6B4',
    roof: '#B44B37',
    ink: '#203A32',
    window: '#F5C65A',
    pool: '#83D4CA',
    accent: '#E27C5F',
    hedge: '#2F6C4E',
  },
  {
    sky: ['#CBE7DA', '#7FC0B0'],
    sun: '#FBF3D7',
    hillBack: '#52927D',
    hillFront: '#276452',
    ground: '#123F35',
    house: '#F4EBD9',
    houseAlt: '#DDD4BE',
    roof: '#2C6E62',
    ink: '#183932',
    window: '#F0BA4B',
    pool: '#8BDCD1',
    accent: '#D95F48',
    hedge: '#2A6547',
  },
  {
    sky: ['#F7D6B5', '#E89B72'],
    sun: '#FFF4D3',
    hillBack: '#7A9D6A',
    hillFront: '#3D6F4B',
    ground: '#224D35',
    house: '#F0DDC0',
    houseAlt: '#DAC3A0',
    roof: '#9E3F32',
    ink: '#27372B',
    window: '#F6CE72',
    pool: '#7CC9BE',
    accent: '#E6A24E',
    hedge: '#3A7049',
  },
  {
    sky: ['#D9D2EE', '#A49ACB'],
    sun: '#FFF7DE',
    hillBack: '#6C7C9A',
    hillFront: '#3C5470',
    ground: '#233E46',
    house: '#F6E9D6',
    houseAlt: '#DFD0BB',
    roof: '#3F4D6B',
    ink: '#1D2B37',
    window: '#F4C562',
    pool: '#84D3CC',
    accent: '#C96A55',
    hedge: '#365F4C',
  },
  {
    sky: ['#F4E4C6', '#DCC299'],
    sun: '#FFFAE9',
    hillBack: '#8DA271',
    hillFront: '#4A754D',
    ground: '#2A533B',
    house: '#E2EBDD',
    houseAlt: '#CAD8C6',
    roof: '#AA4732',
    ink: '#23372C',
    window: '#EFC45B',
    pool: '#85CEC4',
    accent: '#C96144',
    hedge: '#306B46',
  },
]

function Palm({
  x,
  y,
  scale = 1,
  palette,
}: {
  x: number
  y: number
  scale?: number
  palette: Palette
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M0 0 C -2 -10 -4 -20 -1 -30"
        fill="none"
        stroke={palette.ink}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M-1 -30 C -13 -37 -20 -33 -23 -27"
        fill="none"
        stroke={palette.hedge}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M-1 -30 C 11 -38 19 -34 22 -28"
        fill="none"
        stroke={palette.hedge}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M-1 -30 C -9 -41 -4 -47 1 -49"
        fill="none"
        stroke={palette.hedge}
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <path
        d="M-1 -30 C 8 -41 5 -47 1 -49"
        fill="none"
        stroke={palette.hedge}
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <circle cx="-1" cy="-29" r="2.2" fill={palette.accent} />
    </g>
  )
}

function Cypress({
  x,
  y,
  scale = 1,
  palette,
}: {
  x: number
  y: number
  scale?: number
  palette: Palette
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-1.5" y="-4" width="3" height="8" fill={palette.ink} />
      <ellipse cx="0" cy="-16" rx="6" ry="16" fill={palette.hedge} />
      <ellipse cx="-3" cy="-18" rx="4" ry="12" fill={palette.hillFront} opacity="0.6" />
    </g>
  )
}

function Cloud({
  x,
  y,
  scale = 1,
  color,
}: {
  x: number
  y: number
  scale?: number
  color: string
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={color} opacity="0.7">
      <circle cx="0" cy="0" r="6" />
      <circle cx="8" cy="-2" r="8" />
      <circle cx="17" cy="1" r="5.5" />
      <rect x="0" y="0" width="17" height="5" rx="2.5" />
    </g>
  )
}

function Window({
  x,
  y,
  w,
  h,
  palette,
  panes = 2,
}: {
  x: number
  y: number
  w: number
  h: number
  palette: Palette
  panes?: number
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="0.8" fill={palette.window} />
      {panes > 1 && (
        <line
          x1={x + w / 2}
          y1={y}
          x2={x + w / 2}
          y2={y + h}
          stroke={palette.ink}
          strokeWidth="0.8"
          opacity="0.65"
        />
      )}
      {panes > 2 && (
        <line
          x1={x}
          y1={y + h / 2}
          x2={x + w}
          y2={y + h / 2}
          stroke={palette.ink}
          strokeWidth="0.8"
          opacity="0.65"
        />
      )}
    </g>
  )
}

function Scene({
  palette,
  gradientId,
  children,
}: {
  palette: Palette
  gradientId: string
  children: ReactNode
}) {
  return (
    <>
      <rect width="160" height="150" fill={`url(#${gradientId})`} />
      <circle cx="118" cy="39" r="19" fill={palette.sun} opacity="0.92" />
      <path
        d="M0 92 Q 28 76 58 92 T 116 90 T 160 94 V150 H0 Z"
        fill={palette.hillBack}
        opacity="0.55"
      />
      <path
        d="M0 108 Q 34 94 70 106 T 128 104 T 160 108 V150 H0 Z"
        fill={palette.hillFront}
        opacity="0.8"
      />
      <rect y="119" width="160" height="31" fill={palette.ground} />
      <path
        d="M0 119 H160 V123 Q 118 127 78 124 T 0 126 Z"
        fill={palette.hillFront}
        opacity="0.5"
      />
      {children}
    </>
  )
}

function StarterHouse({ value, palette }: { value: number; palette: Palette }) {
  if (value === 1) {
    return (
      <g>
        <ellipse cx="80" cy="121" rx="38" ry="5" fill={palette.ink} opacity="0.16" />
        <path d="M55 89 H105 V120 H55 Z" fill="#C99B62" stroke="#856038" strokeWidth="1" />
        <path d="M55 89 L68 80 H118 L105 89 Z" fill="#DDB37A" stroke="#856038" strokeWidth="1" />
        <path d="M55 89 L55 120 L62 116 V86 Z" fill="#A87B49" opacity="0.55" />
        <rect x="77" y="89" width="5" height="31" fill="#EAD8B8" opacity="0.72" />
        <path d="M64 99 H72 M64 103 H72" stroke="#856038" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
        <path d="M85 108 H96" stroke="#856038" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
        <line x1="107" y1="88" x2="107" y2="63" stroke={palette.ink} strokeWidth="1.8" />
        <path d="M107 64 L122 69 L107 74 Z" fill={palette.accent} />
        <rect x="49" y="120" width="62" height="2" fill={palette.ink} opacity="0.18" />
        <Cypress x={132} y={120} scale={0.8} palette={palette} />
      </g>
    )
  }

  const flip = value % 2 === 0
  const chimneyX = flip ? 92 : 62
  return (
    <g>
      <ellipse cx="80" cy="121" rx="42" ry="5" fill={palette.ink} opacity="0.17" />
      <rect x={58} y={90} width={46} height={30} fill={palette.house} />
      <rect x={58} y={90} width={46} height={30} fill="none" stroke={palette.ink} strokeWidth="1.2" opacity="0.35" />
      <path d="M52 92 L81 71 L110 92 Z" fill={palette.roof} />
      <path d="M52 92 L81 71 L81 92 Z" fill={palette.ink} opacity="0.12" />
      <rect x={chimneyX} y={78} width={6} height={16} fill={palette.roof} />
      <rect x={chimneyX - 1} y={76} width={8} height={3} fill={palette.ink} opacity="0.5" />
      <Window x={67} y={98} w={10} h={10} palette={palette} />
      <rect x={88} y={99} width={9} height={21} fill={palette.ink} />
      <circle cx="94.5" cy="110" r="0.9" fill={palette.window} />
      <path d="M58 120 H104" stroke={palette.ink} strokeWidth="1.5" opacity="0.4" />
      {value >= 4 && <rect x={55} y={92} width={52} height={2.5} fill={palette.houseAlt} opacity="0.8" />}
      <Cypress x={126} y={121} scale={0.9} palette={palette} />
      <rect x={44} y={117} width={8} height={3} fill={palette.ink} opacity="0.3" />
    </g>
  )
}

function Bungalow({ palette, variant }: { palette: Palette; variant: number }) {
  return (
    <g>
      <ellipse cx="80" cy="123" rx="58" ry="6" fill={palette.ink} opacity="0.16" />
      {variant % 2 === 0 && <Cypress x={24} y={121} scale={1.25} palette={palette} />}
      <Palm x={140} y={123} scale={1.15} palette={palette} />
      <rect x={40} y={90} width={80} height={30} fill={palette.house} />
      <rect x={40} y={90} width={80} height={30} fill="none" stroke={palette.ink} strokeWidth="1.2" opacity="0.3" />
      <path d="M31 93 L80 64 L129 93 Z" fill={palette.roof} />
      <path d="M31 93 L80 64 L80 93 Z" fill={palette.ink} opacity="0.11" />
      <rect x={94} y={70} width={7} height={18} fill={palette.roof} />
      <rect x={93} y={68} width={9} height={3} fill={palette.ink} opacity="0.45" />
      <Window x={50} y={98} w={26} h={13} palette={palette} panes={3} />
      <rect x={91} y={100} width={13} height={20} fill={palette.ink} />
      <circle cx="101" cy="110" r="0.9" fill={palette.window} />
      <Window x={108} y={98} w={10} h={11} palette={palette} />
      <rect x={42} y={90} width={76} height={3} fill={palette.houseAlt} />
      <rect x={48} y={93} width={2.5} height={23} fill={palette.houseAlt} opacity="0.9" />
      <rect x={110} y={93} width={2.5} height={23} fill={palette.houseAlt} opacity="0.9" />
      <rect x={44} y={118} width={72} height={3} fill={palette.houseAlt} opacity="0.8" />
      <ellipse cx={46} cy={117} rx={7} ry={4} fill={palette.hedge} />
      <ellipse cx={118} cy={117} rx={8} ry={4.5} fill={palette.hedge} />
      {variant >= 3 && (
        <g>
          <rect x={58} y={113} width={12} height={5} fill={palette.accent} />
          <circle cx={60} cy={118} r={1.6} fill={palette.ink} />
          <circle cx={68} cy={118} r={1.6} fill={palette.ink} />
        </g>
      )}
    </g>
  )
}

function Townhouse({ palette, value }: { palette: Palette; value: number }) {
  const floors = value >= 14 ? 3 : 2
  const height = floors === 3 ? 66 : 54
  const top = 118 - height
  return (
    <g>
      <ellipse cx="80" cy="123" rx="50" ry="5" fill={palette.ink} opacity="0.17" />
      <rect x={18} y={78} width={28} height={40} fill={palette.houseAlt} opacity="0.55" />
      <rect x={114} y={72} width={28} height={46} fill={palette.houseAlt} opacity="0.4" />
      <path d="M18 78 H46 V118 H18 Z" fill="none" stroke={palette.ink} strokeWidth="0.8" opacity="0.2" />
      <path d="M114 72 H142 V118 H114 Z" fill="none" stroke={palette.ink} strokeWidth="0.8" opacity="0.2" />
      <rect x={57} y={top} width={46} height={height} fill={palette.house} />
      <rect x={57} y={top} width={46} height={height} fill="none" stroke={palette.ink} strokeWidth="1.2" opacity="0.32" />
      <rect x={54} y={top - 5} width={52} height={6} fill={palette.roof} />
      <rect x={53} y={top - 7} width={54} height={2.5} fill={palette.ink} opacity="0.4" />
      <Window x={63} y={top + 7} w={13} h={15} palette={palette} panes={4} />
      <Window x={84} y={top + 7} w={13} h={15} palette={palette} panes={4} />
      <Window x={63} y={top + 29} w={13} h={15} palette={palette} panes={4} />
      <Window x={84} y={top + 29} w={13} h={15} palette={palette} panes={4} />
      {floors === 3 && <Window x={73} y={top + 7} w={13} h={15} palette={palette} panes={4} />}
      <rect x={73} y={101} width={13} height={17} fill={palette.ink} />
      <circle cx="83" cy="109" r="1" fill={palette.window} />
      <rect x={70} y={118} width={19} height={3} fill={palette.houseAlt} />
      <rect x={74} y={121} width={11} height={2} fill={palette.ink} opacity="0.3" />
      <path d="M55 96 H105" stroke={palette.accent} strokeWidth="2" opacity="0.75" />
      <path d="M55 96 L55 90 H105 L105 96" fill={palette.accent} opacity="0.3" />
      {value >= 15 && (
        <g>
          <rect x={61} y={top - 14} width={4} height={8} fill={palette.roof} />
          <path d="M65 65 L81 61 L97 65 L97 69 L65 69 Z" fill={palette.accent} opacity="0.85" />
        </g>
      )}
    </g>
  )
}

function ModernHouse({ palette, variant }: { palette: Palette; variant: number }) {
  return (
    <g>
      <ellipse cx="80" cy="124" rx="58" ry="5" fill={palette.ink} opacity="0.15" />
      <rect x={34} y={88} width={92} height={31} fill={palette.house} />
      <rect x={34} y={88} width={92} height={31} fill="none" stroke={palette.ink} strokeWidth="1.2" opacity="0.3" />
      <rect x={52} y={66} width={60} height={23} fill={palette.house} />
      <rect x={52} y={66} width={60} height={23} fill="none" stroke={palette.ink} strokeWidth="1.2" opacity="0.3" />
      <rect x={50} y={62} width={64} height={5} fill={palette.roof} />
      <rect x={48} y={60} width={68} height={2.5} fill={palette.ink} opacity="0.45" />
      <rect x={38} y={94} width={22} height={18} fill={palette.window} />
      <line x1="49" y1="94" x2="49" y2="112" stroke={palette.ink} strokeWidth="0.8" opacity="0.55" />
      <rect x={66} y={94} width={13} height={18} fill={palette.window} opacity="0.9" />
      <rect x={85} y={94} width={18} height={18} fill={palette.ink} />
      <rect x={56} y={72} width={24} height={11} fill={palette.window} />
      <rect x={86} y={72} width={20} height={11} fill={palette.window} opacity="0.85" />
      <line x1="56" y1="78" x2="80" y2="78" stroke={palette.ink} strokeWidth="0.8" opacity="0.5" />
      <rect x={34} y={88} width={92} height={2.5} fill={palette.houseAlt} />
      <rect x={115} y={76} width={5} height={38} fill={palette.ink} opacity="0.55" />
      <rect x={113} y={74} width={9} height={3} fill={palette.ink} opacity="0.65" />
      <rect x={112} y={116} width={36} height={7} rx={3.5} fill={palette.pool} />
      <path d="M116 118 Q 124 121 132 118 T 146 119" fill="none" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.55" />
      <rect x={100} y={112} width={2} height={8} fill={palette.ink} opacity="0.5" />
      <path d="M102 112 L112 108 L112 112 Z" fill={palette.accent} />
      <Palm x={26} y={123} scale={1.1} palette={palette} />
      {variant % 2 === 0 && <Cloud x={22} y={31} scale={0.9} color={palette.sun} />}
      <rect x={70} y={48} width={2} height={14} fill={palette.ink} opacity="0.4" />
      <circle cx={71} cy={47} r={1.2} fill={palette.accent} />
    </g>
  )
}

function Villa({ palette, value }: { palette: Palette; value: number }) {
  return (
    <g>
      <ellipse cx="80" cy="126" rx="62" ry="6" fill={palette.ink} opacity="0.15" />
      <ellipse cx="80" cy="86" rx="52" ry="8" fill={palette.hedge} opacity="0.32" />
      <rect x={30} y={80} width={100} height={38} fill={palette.house} />
      <rect x={30} y={80} width={100} height={38} fill="none" stroke={palette.ink} strokeWidth="1.2" opacity="0.3" />
      <path d="M24 82 L80 62 L136 82 Z" fill={palette.roof} />
      <path d="M24 82 L80 62 L80 82 Z" fill={palette.ink} opacity="0.12" />
      <rect x={26} y={80} width={108} height={5} fill={palette.houseAlt} />
      <rect x={36} y={88} width={8} height={30} fill={palette.houseAlt} />
      <rect x={56} y={88} width={8} height={30} fill={palette.houseAlt} />
      <rect x={96} y={88} width={8} height={30} fill={palette.houseAlt} />
      <rect x={116} y={88} width={8} height={30} fill={palette.houseAlt} />
      <rect x={72} y={94} width={16} height={24} fill={palette.ink} />
      <circle cx="85" cy="106" r="1" fill={palette.window} />
      <Window x={46} y={94} w={8} h={13} palette={palette} />
      <Window x={106} y={94} w={8} h={13} palette={palette} />
      <path d="M30 118 H130" stroke={palette.ink} strokeWidth="1.4" opacity="0.4" />
      <ellipse cx="80" cy="123" rx="25" ry="4.5" fill={palette.pool} />
      <ellipse cx="80" cy="123" rx="25" ry="4.5" fill="none" stroke={palette.houseAlt} strokeWidth="1.5" />
      <path d="M70 121 Q 78 124 88 121" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.5" />
      <Palm x={20} y={123} scale={1.35} palette={palette} />
      <Palm x={145} y={124} scale={1.2} palette={palette} />
      <ellipse cx={42} cy={117} rx={10} ry={4} fill={palette.hedge} />
      <ellipse cx={118} cy={117} rx={10} ry={4} fill={palette.hedge} />
      {value >= 24 && (
        <g>
          <rect x={68} y={54} width={24} height={8} fill={palette.accent} />
          <path d="M72 54 L80 48 L88 54 Z" fill={palette.accent} />
        </g>
      )}
    </g>
  )
}

function Tower({ palette, value }: { palette: Palette; value: number }) {
  const top = value >= 30 ? 28 : 36
  return (
    <g>
      <rect x={18} y={78} width={24} height={46} fill={palette.hillFront} opacity="0.55" />
      <rect x={118} y={86} width={22} height={38} fill={palette.hillFront} opacity="0.45" />
      <rect x={44} y={94} width={14} height={30} fill={palette.houseAlt} opacity="0.65" />
      <ellipse cx="80" cy="125" rx="44" ry="5" fill={palette.ink} opacity="0.16" />
      <rect x={62} y={top + 10} width={36} height={85} fill={palette.house} />
      <rect x={62} y={top + 10} width={36} height={85} fill="none" stroke={palette.ink} strokeWidth="1.2" opacity="0.32" />
      <rect x={59} y={top + 5} width={42} height={6} fill={palette.roof} />
      <rect x={57} y={top + 2} width={46} height={3} fill={palette.ink} opacity="0.45" />
      <rect x={63} y={top - 1} width={34} height={4} fill={palette.houseAlt} />
      <rect x={66} y={top - 6} width={28} height={5} rx={2.5} fill={palette.pool} />
      <rect x={68} y={top - 8} width={3} height={3} fill={palette.ink} opacity="0.5" />
      <rect x={88} y={top - 8} width={3} height={3} fill={palette.ink} opacity="0.5" />
      {[0, 1, 2, 3, 4, 5].map((row) => (
        <g key={row}>
          <Window x={67} y={top + 16 + row * 11} w={8} h={7} palette={palette} />
          <Window x={85} y={top + 16 + row * 11} w={8} h={7} palette={palette} />
        </g>
      ))}
      <rect x={73} y={top + 82} width={14} height={23} fill={palette.ink} />
      <circle cx="84" cy={top + 94} r="1" fill={palette.window} />
      <rect x={71} y={top + 105} width={18} height={3} fill={palette.houseAlt} />
      <path d="M62 66 H98" stroke={palette.accent} strokeWidth="2" opacity="0.8" />
      <Palm x={106} y={top + 4} scale={0.72} palette={palette} />
      {value >= 30 && (
        <g>
          <line x1="80" y1={top - 6} x2="80" y2={top - 22} stroke={palette.ink} strokeWidth="1.6" />
          <path d="M80 30 L93 34 L80 38 Z" fill={palette.accent} />
          <circle cx="80" cy={top - 23} r="2" fill={palette.sun} />
        </g>
      )}
      {value >= 28 && <Cloud x={24} y={44} scale={0.85} color={palette.sun} />}
      <Cypress x={134} y={123} scale={1.1} palette={palette} />
      <Cypress x={26} y={124} scale={0.9} palette={palette} />
    </g>
  )
}

export function HouseArt({ value }: HouseArtProps) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '')
  const gradientId = `sky-${uid}`
  const palette = PALETTES[(value - 1) % PALETTES.length]
  const tier = value <= 5 ? 0 : value <= 10 ? 1 : value <= 15 ? 2 : value <= 20 ? 3 : value <= 25 ? 4 : 5
  const variant = (value - 1) % 5

  return (
    <svg
      className="house-art"
      viewBox="0 0 160 150"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.sky[0]} />
          <stop offset="100%" stopColor={palette.sky[1]} />
        </linearGradient>
      </defs>
      <Scene palette={palette} gradientId={gradientId}>
        {tier === 0 && <StarterHouse value={value} palette={palette} />}
        {tier === 1 && <Bungalow palette={palette} variant={variant} />}
        {tier === 2 && <Townhouse palette={palette} value={value} />}
        {tier === 3 && <ModernHouse palette={palette} variant={variant} />}
        {tier === 4 && <Villa palette={palette} value={value} />}
        {tier === 5 && <Tower palette={palette} value={value} />}
      </Scene>
    </svg>
  )
}
