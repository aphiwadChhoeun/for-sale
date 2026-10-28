import { AnimatePresence, motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import type { GameState, HouseCard, Player } from '../game/types'
import { formatMoney } from '../game/format'
import { Avatar } from './Avatar'
import { BillIcon, HouseCardFace } from './Cards'
import { IconCheck, IconHouse, IconLock, IconSparkle } from './Icons'

interface HumanDockProps {
  state: GameState
  human: Player
  selectedHouseId: number | null
  onSelect: (houseId: number) => void
  onSell: () => void
  canSell: boolean
}

function Portfolio({ houses, cash }: { houses: HouseCard[]; cash: number }) {
  const sorted = [...houses].sort((a, b) => b.value - a.value)
  return (
    <div className="portfolio">
      <div className="portfolio__head">
        <span className="eyebrow">Your portfolio</span>
        <span className="portfolio__count">
          {houses.length} {houses.length === 1 ? 'house' : 'houses'}
          <span className="portfolio__cash">{formatMoney(cash)} unspent</span>
        </span>
      </div>
      <div className="portfolio__row">
        {sorted.length > 0 ? (
          <AnimatePresence initial={false}>
            {sorted.map((house, index) => (
              <motion.div
                key={house.id}
                className="portfolio__card"
                initial={{ opacity: 0, y: 18, rotate: -6, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, rotate: (index % 2 === 0 ? -1 : 1) * 1.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30, delay: Math.min(index * 0.025, 0.2) }}
              >
                <HouseCardFace card={house} size="mini" showCorner={false} />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="portfolio__empty">
            <IconHouse size={18} />
            <span>No houses yet. Win the first lot.</span>
          </div>
        )}
      </div>
      <p className="portfolio__hint">
        <IconSparkle size={12} /> Your houses stay hidden from the rest of the table.
      </p>
    </div>
  )
}

function HandFan({
  houses,
  selectedId,
  locked,
  onSelect,
}: {
  houses: HouseCard[]
  selectedId: number | null
  locked: boolean
  onSelect: (id: number) => void
}) {
  const sorted = [...houses].sort((a, b) => a.value - b.value)
  const mid = (sorted.length - 1) / 2
  const maxTilt = Math.min(2.1, 16 / Math.max(1, sorted.length))

  return (
    <div className="hand">
      <div className="hand__head">
        <span className="eyebrow">Your hand</span>
        <span className="hand__count">
          {sorted.length} {sorted.length === 1 ? 'house' : 'houses'} left
        </span>
        {locked && (
          <span className="hand__locked">
            <IconLock size={12} /> Offer locked
          </span>
        )}
      </div>
      <div className={`hand__cards ${sorted.length > 7 ? 'is-crowded' : ''}`}>
        <AnimatePresence initial={false}>
          {sorted.map((house, index) => {
            const offset = index - mid
            const selected = selectedId === house.id
            return (
              <motion.button
                key={house.id}
                layout
                type="button"
                className={`hand__card ${selected ? 'is-selected' : ''}`}
                style={
                  {
                    '--stack': index,
                  } as CSSProperties
                }
                initial={{ opacity: 0, y: 44, scale: 0.88 }}
                animate={{
                  opacity: 1,
                  y: selected ? -20 : 0,
                  scale: 1,
                  rotate: selected ? 0 : offset * maxTilt,
                }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                onClick={() => onSelect(house.id)}
                disabled={locked}
                aria-pressed={selected}
                aria-label={`House ${house.value}`}
              >
                <HouseCardFace card={house} size="md" showCorner={false} selected={selected} />
                {selected && <span className="hand__pick-tag">Your pick</span>}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function HumanDock({
  state,
  human,
  selectedHouseId,
  onSelect,
  onSell,
  canSell,
}: HumanDockProps) {
  const { phase, selling } = state
  const checkTotal = human.checks.reduce((sum, check) => sum + check.value, 0)
  const locked = Boolean(selling && selling.picks[human.id] !== undefined)
  const selectedHouse = human.houses.find((house) => house.id === selectedHouseId)
  const pickedHouse =
    (selling?.picks[human.id] !== undefined
      ? human.houses.find((house) => house.id === selling?.picks[human.id])
      : undefined) ??
    selling?.results?.find((entry) => entry.playerId === human.id)?.house

  return (
    <section className="dock" aria-label="Your seat">
      <div className="dock__profile">
        <div className="dock__avatar">
          <Avatar index={human.avatar} size={52} />
          <span className="dock__you-badge">You</span>
        </div>
        <div className="dock__readout">
          <span className="dock__cash">
            <BillIcon />
            <strong>{formatMoney(human.cash)}</strong>
            <small>cash</small>
          </span>
          {phase !== 'buying' && (
            <span className="dock__checks">
              <IconCheck size={13} />
              <strong>{formatMoney(checkTotal)}</strong>
              <small>checks</small>
            </span>
          )}
        </div>
      </div>

      <div className="dock__body">
        {phase === 'buying' ? (
          <Portfolio houses={human.houses} cash={human.cash} />
        ) : phase === 'selling' ? (
          <HandFan
            houses={human.houses}
            selectedId={selectedHouseId}
            locked={locked}
            onSelect={onSelect}
          />
        ) : (
          <div className="dock__closed">
            <span className="eyebrow">Final portfolio</span>
            <strong>{formatMoney(human.cash + checkTotal)}</strong>
            <span>
              {human.checks.length} checks · {formatMoney(human.cash)} cash left
            </span>
          </div>
        )}
      </div>

      <div className="dock__aside">
        {phase === 'buying' ? (
          <div className="dock__tip">
            <span className="eyebrow">The long game</span>
            <p>Cash you don't spend still counts. So does every house you flip.</p>
            <span className="dock__tip-mark">
              <IconHouse size={14} /> One house per lot, every lot.
            </span>
          </div>
        ) : phase === 'gameover' ? (
          <div className="dock__tip">
            <span className="eyebrow">The tally</span>
            <p>Checks counted. Cash counted. The table is settled.</p>
          </div>
        ) : (
          <div className="sell-box">
            <span className="eyebrow">Your offer</span>
            {locked ? (
              <div className="sell-box__locked">
                <span className="sell-box__lock-icon">
                  <IconLock size={17} />
                </span>
                <div>
                  <strong>{pickedHouse ? `House ${pickedHouse.value}` : 'Offer in'}</strong>
                  <span>Waiting for the table</span>
                </div>
              </div>
            ) : selectedHouse ? (
              <>
                <div className="sell-box__selected">
                  <span>Selected</span>
                  <strong>House {selectedHouse.value}</strong>
                </div>
                <button
                  className="btn btn--gold sell-box__cta"
                  onClick={onSell}
                  disabled={!canSell}
                >
                  Sell it
                  <span className="btn__arrow">→</span>
                </button>
              </>
            ) : (
              <p className="sell-box__prompt">
                Pick a house from your hand.
                <span className="sell-box__prompt-more">
                  {' '}The stronger the house, the bigger the check.
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
