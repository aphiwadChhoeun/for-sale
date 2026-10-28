import { AnimatePresence, motion } from 'framer-motion'
import type { GameState, Player } from '../game/types'
import { formatMoney, formatMoneyShort } from '../game/format'
import { Avatar } from './Avatar'
import { CheckCardFace } from './Cards'
import { IconArrowRight, IconCheck, IconCrown, IconSparkle } from './Icons'
import { Ticker } from './Ticker'

interface SellingViewProps {
  state: GameState
  human: Player
  onNext: () => void
}

function Readiness({ state }: { state: GameState }) {
  const selling = state.selling
  if (!selling) return null
  return (
    <div className="readiness" aria-label="Offer readiness">
      {state.players.map((player) => {
        const ready = selling.picks[player.id] !== undefined
        return (
          <span
            key={player.id}
            className={`readiness__item ${ready ? 'is-ready' : ''} ${player.isHuman ? 'is-you' : ''}`}
          >
            <span className="readiness__avatar">
              <Avatar index={player.avatar} size={24} />
              {ready && (
                <span className="readiness__check">
                  <IconCheck size={9} />
                </span>
              )}
            </span>
            <span className="readiness__name">{player.name}</span>
            <span className="readiness__state">{ready ? 'in' : 'choosing'}</span>
          </span>
        )
      })}
    </div>
  )
}

function SellingPrompt({ state, human }: { state: GameState; human: Player }) {
  const selling = state.selling
  if (!selling) return null
  const humanReady = selling.picks[human.id] !== undefined
  const readyCount = Object.keys(selling.picks).length
  const missing = state.players.length - readyCount

  return (
    <div className="selling-prompt">
      <div className="selling-prompt__copy">
        <span className="eyebrow">
          {humanReady ? 'Offer locked' : 'Your move'}
        </span>
        <strong>
          {humanReady
            ? missing > 0
              ? `Waiting on ${missing} ${missing === 1 ? 'rival' : 'rivals'}`
              : 'The table is in'
            : 'Pick a house to sell'}
          {humanReady && missing > 0 && (
            <span className="thinking-dots">
              <i />
              <i />
              <i />
            </span>
          )}
        </strong>
        <span className="selling-prompt__detail">
          {humanReady
            ? 'Offers stay sealed until every player is in.'
            : 'Biggest house wins the biggest check. Choose the timing, not just the card.'}
        </span>
      </div>
      <Readiness state={state} />
    </div>
  )
}

function RevealPrompt() {
  return (
    <div className="reveal-prompt">
      <span className="reveal-prompt__shine" />
      <div>
        <span className="eyebrow">The reveal</span>
        <strong>
          Reading the table
          <span className="thinking-dots">
            <i />
            <i />
            <i />
          </span>
        </strong>
      </div>
    </div>
  )
}

function ResultsPanel({ state, onNext }: { state: GameState; onNext: () => void }) {
  const selling = state.selling
  if (!selling?.results) return null
  const top = selling.results[0]
  const topPlayer = state.players.find((player) => player.id === top.playerId)

  return (
    <div className="results-panel">
      <div className="results-panel__head">
        <div>
          <span className="eyebrow">Sale {selling.round} settled</span>
          <strong>
            House {top.house.value} takes the {formatMoney(top.check.value)} check
          </strong>
          <span className="results-panel__sub">
            {topPlayer?.name === 'You'
              ? 'You set the pace. Collect your check.'
              : `${topPlayer?.name} sets the pace.`}
          </span>
        </div>
        <button className="btn btn--ghost results-panel__next" onClick={onNext}>
          Next sale <IconArrowRight size={15} />
        </button>
      </div>

      <div className="result-strip">
        {selling.results.map((result, index) => {
          const player = state.players.find((entry) => entry.id === result.playerId)
          return (
            <motion.div
              key={result.playerId}
              className={`result-chip ${index === 0 ? 'is-top' : ''} ${player?.isHuman ? 'is-you' : ''}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.07, type: 'spring', stiffness: 380, damping: 30 }}
            >
              <span className="result-chip__rank">{index + 1}</span>
              <Avatar index={player?.avatar ?? 0} size={22} />
              <span className="result-chip__house">H{result.house.value}</span>
              <IconArrowRight size={12} />
              <span className="result-chip__check">{formatMoneyShort(result.check.value)}</span>
            </motion.div>
          )
        })}
      </div>

      <div className="results-panel__timer" key={selling.round}>
        <span />
      </div>
    </div>
  )
}

export function SellingView({ state, human, onNext }: SellingViewProps) {
  const selling = state.selling
  if (!selling) return null
  const topCheck = selling.checks[0]

  return (
    <div className="market market--selling">
      <div className="market__head">
        <div className="market__title">
          <span className="eyebrow">
            <IconSparkle size={13} /> The sell-off
          </span>
          <h2>
            Sale {selling.round}
            <span className="market__sub">
              {selling.checks.length} {selling.checks.length === 1 ? 'check' : 'checks'}
            </span>
          </h2>
        </div>
        <div className="market__legend market__legend--checks">
          <span className="top-check-label">
            <IconCrown size={12} /> Top check
          </span>
          <span>{formatMoney(topCheck?.value ?? 0)}</span>
        </div>
      </div>

      <div className={`check-row ${selling.checks.length > 4 ? 'is-dense' : ''}`}>
        <AnimatePresence initial={false}>
          {selling.checks.map((check, index) => {
            const result = selling.results?.find(
              (entry) => entry.check.id === check.id,
            )
            const player = result
              ? state.players.find((entry) => entry.id === result.playerId)
              : undefined
            return (
              <motion.div
                key={check.id}
                layout
                className={[
                  'check-row__slot',
                  index === 0 ? 'is-top' : '',
                  selling.step === 'results' ? 'is-claimed' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                initial={{ opacity: 0, y: 28, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{
                  type: 'spring',
                  stiffness: 360,
                  damping: 30,
                  delay: index * 0.04,
                }}
              >
                <CheckCardFace
                  card={check}
                  size={selling.checks.length > 4 ? 'sm' : 'md'}
                  highlight={index === 0}
                />
                {index === 0 && <span className="check-row__crown">top prize</span>}
                {selling.step === 'results' && result && player && (
                  <motion.span
                    className="check-row__claim"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.07 }}
                  >
                    <Avatar index={player.avatar} size={18} />
                    {player.name === 'You' ? 'you' : player.name}
                  </motion.span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="action-zone action-zone--selling">
        <Ticker state={state} />
        <div className="action-zone__body">
          {selling.step === 'choose' && <SellingPrompt state={state} human={human} />}
          {selling.step === 'reveal' && <RevealPrompt />}
          {selling.step === 'results' && <ResultsPanel state={state} onNext={onNext} />}
        </div>
      </div>
    </div>
  )
}
