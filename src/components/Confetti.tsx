import type { CSSProperties } from 'react'

const COLORS = ['#E9B44C', '#F4E6CB', '#C96A4E', '#7FB4A0', '#D9C39B', '#E27C5F']

const BITS = Array.from({ length: 120 }, (_, index) => ({
  id: index,
  left: Math.random() * 100,
  delay: Math.random() * 0.7,
  duration: 2.6 + Math.random() * 2.2,
  drift: (Math.random() * 2 - 1) * 160,
  rotate: Math.random() * 360,
  width: 5 + Math.random() * 7,
  height: 7 + Math.random() * 10,
  color: COLORS[index % COLORS.length],
  round: Math.random() > 0.7,
}))

export function Confetti({ pieces = 90 }: { pieces?: number }) {
  const bits = BITS.slice(0, pieces)

  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((bit) => (
        <span
          key={bit.id}
          style={
            {
              left: `${bit.left}%`,
              width: bit.width,
              height: bit.height,
              background: bit.color,
              borderRadius: bit.round ? '50%' : '1px',
              animationDelay: `${bit.delay}s`,
              animationDuration: `${bit.duration}s`,
              '--drift': `${bit.drift}px`,
              '--spin': `${bit.rotate + 720}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
