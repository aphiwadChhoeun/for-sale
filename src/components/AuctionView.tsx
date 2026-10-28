import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { GameState, Player } from '../game/types'
import { formatMoney } from '../game/format'
import { Avatar } from './Avatar'
import { HouseCardFace } from './Cards'
import { IconGavel } from './Icons'
import { Ticker } from './Ticker'

interface AuctionViewProps {
  state: GameState
  human: Player
  onBid: (amount: number) => void
  onPass: () => void
  keyboardBlocked: boolean
}

const THINKING_LINES = [
  'is counting the room',
  'is weighing the lot',
  'is checking the wallet',
  'is reading the table',
  'is hovering over the gavel',
]

function BidConsole({
  state,
  human,
  onBid,
  onPass,
  keyboardBlocked,
}: AuctionViewProps) {
  const auction = state.auction
  const minBid = (auction?.currentBid ?? 0) + 1
  const maxBid = human.cash
  const canRaise = Boolean(auction) && maxBid >= minBid
  const [amount, setAmount] = useState(minBid)
  const clamped = Math.max(minBid, Math.min(amount, maxBid))
  const passCost = Math.ceil(human.bid / 2)
  const rangePercent =
    maxBid > minBid ? ((clamped - minBid) / (maxBid - minBid)) * 100 : 100

  useEffect(() => {
    if (!canRaise || keyboardBlocked) return
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        target.closest(
          'input, button, a, textarea, select, [contenteditable="true"]',
        )
      ) {
        return
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
        event.preventDefault()
        setAmount((value) => Math.min(maxBid, Math.max(minBid, value + 1)))
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
        event.preventDefault()
        setAmount((value) => Math.max(minBid, Math.min(maxBid, value - 1)))
      } else if (event.key === 'Enter') {
        event.preventDefault()
        onBid(clamped)
      } else if (event.key.toLowerCase() === 'p') {
        event.preventDefault()
        onPass()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canRaise, keyboardBlocked, minBid, maxBid, clamped, onBid, onPass])

  if (!auction) return null
  const lowest = auction.houses[0]

  if (!canRaise) {
    return (
      <div className="bid-console bid-console--blocked">
        <div className="bid-console__blocked-copy">
          <span className="eyebrow">No room to raise</span>
          <p>
            {human.cash === 0
              ? 'You are out of bills. Take the lowest house on the table.'
              : `The bid is ${formatMoney(auction.currentBid)} and you only have ${formatMoney(human.cash)}.`}
          </p>
        </div>
        <button className="btn btn--pass btn--pass-wide" onClick={onPass}>
          <span>Pass</span>
          <small>
            House {lowest?.value} · {passCost > 0 ? formatMoney(passCost) : 'free'}
          </small>
        </button>
      </div>
    )
  }

  return (
    <div className="bid-console">
      <div className="bid-console__amount">
        <span className="eyebrow">Your raise</span>
        <div className="bid-console__amount-row">
          <button
            type="button"
            className="step-btn"
            onClick={() => setAmount((value) => Math.max(minBid, value - 1))}
            aria-label="Lower bid by one thousand"
          >
            −
          </button>
          <strong>{formatMoney(clamped)}</strong>
          <button
            type="button"
            className="step-btn"
            onClick={() => setAmount((value) => Math.min(maxBid, value + 1))}
            aria-label="Raise bid by one thousand"
          >
            +
          </button>
        </div>
        <div className="quick-chips">
          {[1, 2, 5].map((increment) => (
            <button
              key={increment}
              type="button"
              className="quick-chip"
              onClick={() =>
                setAmount((value) => Math.min(maxBid, value + increment))
              }
              disabled={clamped + increment > maxBid}
            >
              +{increment}
            </button>
          ))}
          <button
            type="button"
            className="quick-chip"
            onClick={() => setAmount(maxBid)}
            disabled={clamped === maxBid}
          >
            max
          </button>
        </div>
      </div>

      <div className="bid-console__slider">
        <div className="bid-slider">
          <div className="bid-slider__track" />
          <div
            className="bid-slider__fill"
            style={{ width: `${rangePercent}%` }}
          />
          <input
            type="range"
            min={minBid}
            max={maxBid}
            step={1}
            value={clamped}
            onChange={(event) => setAmount(Number(event.target.value))}
            aria-label="Bid amount"
          />
        </div>
        <div className="bid-slider__labels">
          <span>{formatMoney(minBid)}</span>
          <span>{formatMoney(maxBid)} max</span>
        </div>
        <p className="bid-console__hint">
          <kbd>↑</kbd>
          <kbd>↓</kbd> adjust <span>·</span> <kbd>Enter</kbd> bid <span>·</span> <kbd>P</kbd> pass
        </p>
      </div>

      <div className="bid-console__actions">
        <button className="btn btn--pass" onClick={onPass}>
          <span>Pass</span>
          <small>
            House {lowest?.value} · {passCost > 0 ? formatMoney(passCost) : 'free'}
          </small>
        </button>
        <button className="btn btn--gold" onClick={() => onBid(clamped)}>
          Bid {formatMoney(clamped)}
        </button>
      </div>
    </div>
  )
}

function TurnStatus({ state, player }: { state: GameState; player: Player }) {
  const auction = state.auction
  if (!auction) return null
  const line = THINKING_LINES[player.avatar % THINKING_LINES.length]
  return (
    <div className="turn-status">
      <div className="turn-status__avatar">
        <Avatar index={player.avatar} size={46} />
        <span className="turn-status__ring" />
      </div>
      <div className="turn-status__copy">
        <span className="eyebrow">On the clock</span>
        <strong>
          {player.name} {line}
          <span className="thinking-dots">
            <i />
            <i />
            <i />
          </span>
        </strong>
        <span className="turn-status__detail">
          {auction.currentBid > 0
            ? `${formatMoney(auction.currentBid)} on the table · next ${formatMoney(auction.currentBid + 1)}`
            : 'The lot is open. First bid takes the floor.'}
        </span>
      </div>
      <div className="turn-status__lot">
        <IconGavel size={18} />
        <span>{auction.houses.length} left</span>
      </div>
    </div>
  )
}

function SoldPanel({ state }: { state: GameState }) {
  const auction = state.auction
  if (!auction?.resolved) return null
  const winner = state.players.find(
    (player) => player.id === auction.resolved?.playerId,
  )
  if (!winner) return null
  return (
    <div className="sold-panel">
      <span className="sold-panel__stamp">Sold</span>
      <div className="sold-panel__copy">
        <span className="eyebrow">The gavel falls</span>
        <strong>
          House {auction.resolved.house.value} to {winner.name}
        </strong>
        <span>
          {auction.resolved.cost > 0
            ? `${formatMoney(auction.resolved.cost)} paid`
            : 'Won for nothing'}
          {' · '}
          {winner.name === 'You' ? 'yours to flip' : 'a rival to watch'}
        </span>
      </div>
      <div className="sold-panel__progress">
        <span />
      </div>
    </div>
  )
}

export function AuctionView(props: AuctionViewProps) {
  const { state, human } = props
  const auction = state.auction
  if (!auction) return null
  const turnPlayer = state.players[auction.turn]
  const humanTurn = turnPlayer?.id === human.id && !auction.resolved
  const resolved = Boolean(auction.resolved)
  const displayHouses = auction.resolved
    ? [auction.resolved.house]
    : auction.houses
  const lastIndex = displayHouses.length - 1

  return (
    <div className="market market--auction">
      <div className="market__head">
        <div className="market__title">
          <span className="eyebrow">
            <IconGavel size={13} /> On the block
          </span>
          <h2>
            Lot {auction.round}
            <span className="market__sub">
              {displayHouses.length} {displayHouses.length === 1 ? 'house' : 'houses'}
            </span>
          </h2>
        </div>
        <div className="market__legend">
          <span>Pass takes the lowest</span>
          <span className="legend-arrow">→</span>
          <span>Last bidder takes the highest</span>
        </div>
      </div>

      <div className={`house-row ${displayHouses.length > 4 ? 'is-dense' : ''}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          {displayHouses.map((house, index) => (
            <motion.div
              key={house.id}
              layout
              className={[
                'house-row__slot',
                index === 0 ? 'is-lowest' : '',
                index === lastIndex ? 'is-highest' : '',
                resolved && index === 0 ? 'is-sold' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              initial={{ opacity: 0, y: 34, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.82, transition: { duration: 0.22 } }}
              transition={{
                type: 'spring',
                stiffness: 360,
                damping: 28,
                delay: Math.min(index * 0.035, 0.18),
              }}
            >
              <HouseCardFace card={house} size={displayHouses.length > 4 ? 'sm' : 'md'} />
              {!resolved && index === 0 && (
                <span className="house-row__tag house-row__tag--low">lowest</span>
              )}
              {!resolved && index === lastIndex && displayHouses.length > 1 && (
                <span className="house-row__tag house-row__tag--high">top lot</span>
              )}
              {resolved && <span className="house-row__sold">sold</span>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="auction-meter">
        <div className="auction-meter__cell auction-meter__cell--bid">
          <span>
            <IconGavel size={12} /> High bid
          </span>
          <strong>{auction.currentBid > 0 ? formatMoney(auction.currentBid) : 'Open'}</strong>
        </div>
        <div className="auction-meter__divider" />
        <div className="auction-meter__cell">
          <span>Bidder</span>
          <strong>
            {auction.highBidder
              ? state.players.find((player) => player.id === auction.highBidder)?.name
              : '—'}
          </strong>
        </div>
        <div className="auction-meter__divider" />
        <div className="auction-meter__cell">
          <span>Next minimum</span>
          <strong>{resolved ? '—' : formatMoney(auction.currentBid + 1)}</strong>
        </div>
        <div className="auction-meter__divider auction-meter__divider--wallet" />
        <div className="auction-meter__cell auction-meter__cell--wallet">
          <span>Your wallet</span>
          <strong>{formatMoney(human.cash)}</strong>
        </div>
      </div>

      <div className="action-zone">
        <Ticker state={state} />
        <div className="action-zone__body">
          {resolved ? (
            <SoldPanel state={state} />
          ) : humanTurn ? (
            <BidConsole
              key={`${auction.round}-${auction.currentBid}-${human.id}`}
              {...props}
            />
          ) : turnPlayer ? (
            <TurnStatus state={state} player={turnPlayer} />
          ) : null}
        </div>
      </div>

    </div>
  )
}
