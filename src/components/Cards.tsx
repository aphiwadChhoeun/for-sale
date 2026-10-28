import type { CSSProperties } from 'react'
import type { CheckCard as CheckCardData, HouseCard as HouseCardData } from '../game/types'
import { formatMoney } from '../game/format'
import { HouseArt } from './HouseArt'

export type CardSize = 'xl' | 'lg' | 'md' | 'sm' | 'mini'

interface HouseCardProps {
  card: HouseCardData
  size?: CardSize
  selected?: boolean
  className?: string
  style?: CSSProperties
  showCorner?: boolean
}

export function HouseCardFace({
  card,
  size = 'md',
  selected = false,
  className = '',
  style,
  showCorner = true,
}: HouseCardProps) {
  return (
    <div
      className={`hcard hcard--${size} ${selected ? 'is-selected' : ''} ${className}`}
      style={style}
      data-value={card.value}
    >
      <div className="hcard__inner">
        <div className="hcard__art">
          <HouseArt value={card.value} />
          <span className="hcard__sheen" />
        </div>
        <div className="hcard__footer">
          <span className="hcard__label">House</span>
          <span className="hcard__value">{card.value}</span>
        </div>
        {showCorner && <span className="hcard__corner">№ {card.value}</span>}
      </div>
    </div>
  )
}

interface CheckCardProps {
  card: CheckCardData
  size?: CardSize
  className?: string
  highlight?: boolean
  style?: CSSProperties
}

export function CheckCardFace({
  card,
  size = 'md',
  className = '',
  highlight = false,
  style,
}: CheckCardProps) {
  const isVoid = card.value === 0
  return (
    <div
      className={`ccard ccard--${size} ${isVoid ? 'is-void' : ''} ${highlight ? 'is-highlight' : ''} ${className}`}
      style={style}
      data-value={card.value}
    >
      <div className="ccard__inner">
        <div className="ccard__top">
          <span className="ccard__bank">Meridian Trust</span>
          <span className="ccard__serial">No. {String(4100 + card.id * 37).padStart(6, '0')}</span>
        </div>
        <div className="ccard__pay">Pay to the bearer</div>
        <div className={`ccard__amount ${isVoid ? 'ccard__amount--void' : ''}`}>
          {isVoid ? '$0' : formatMoney(card.value)}
        </div>
        <div className="ccard__bottom">
          <span className="ccard__memo">Property proceeds</span>
          <span className="ccard__signature" aria-hidden="true">
            <svg viewBox="0 0 70 18" width="100%" height="100%">
              <path
                d="M2 13 C 8 4 12 15 18 8 C 22 3 22 15 28 9 C 33 4 34 14 40 9 C 44 5 46 13 52 8 C 56 4 60 11 68 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
        <span className="ccard__watermark">MT</span>
        <span className="ccard__seal" aria-hidden="true">
          <span>★</span>
        </span>
        {isVoid && <span className="ccard__void-stamp">VOID</span>}
      </div>
    </div>
  )
}

type BackSize = 'sm' | 'md' | 'mini'

export function CardBack({ size = 'sm', className = '' }: { size?: BackSize; className?: string }) {
  return (
    <div className={`card-back card-back--${size} ${className}`} aria-hidden="true">
      <div className="card-back__frame">
        <div className="card-back__mark">
          <svg viewBox="0 0 40 40" width="100%" height="100%">
            <path
              d="M8 23 L20 10 L32 23 M12 22 V32 H28 V22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <rect x="17.5" y="25.5" width="5" height="6.5" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function BillIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`bill-icon ${className}`}
      viewBox="0 0 34 22"
      width="34"
      height="22"
      aria-hidden="true"
    >
      <rect x="1" y="5" width="28" height="16" rx="2.5" fill="#b7d8c6" stroke="#1d6b53" strokeWidth="1" />
      <rect x="4" y="2" width="28" height="16" rx="2.5" fill="#dcebe3" stroke="#1d6b53" strokeWidth="1" />
      <circle cx="18" cy="10" r="4.2" fill="#1d6b53" opacity="0.6" />
      <path d="M8 10 H12 M24 10 H27" stroke="#1d6b53" strokeWidth="1.2" strokeLinecap="round" />
      <text x="18" y="12.2" textAnchor="middle" fontSize="4.5" fill="#ffffff" fontFamily="DM Sans, sans-serif" fontWeight="700">$</text>
    </svg>
  )
}
