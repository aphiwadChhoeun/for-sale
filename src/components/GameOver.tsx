import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { GameState } from '../game/types'
import { formatMoney } from '../game/format'
import { scoreOf } from '../game/engine'
import { Avatar } from './Avatar'
import { Confetti } from './Confetti'
import { IconCheck, IconCrown, IconDoor, IconTrophy } from './Icons'

interface GameOverProps {
  state: GameState
  onRematch: () => void
  onLobby: () => void
}

export function GameOver({ state, onRematch, onLobby }: GameOverProps) {
  const primaryRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const human = state.players.find((player) => player.isHuman)
  const humanWon = human ? state.winners.includes(human.id) : false
  const sharedWin = state.winners.length > 1
  const soloWinner =
    !sharedWin
      ? state.players.find((player) => player.id === state.winners[0])
      : undefined

  const standings = [...state.players].sort((a, b) => {
    const scoreDiff = scoreOf(b) - scoreOf(a)
    if (scoreDiff !== 0) return scoreDiff
    return b.cash - a.cash
  })
  const bestScore = standings.length > 0 ? scoreOf(standings[0]) : 0
  const humanRank = human
    ? standings.findIndex((player) => player.id === human.id) + 1
    : 0
  const topScore = Math.max(...state.players.map(scoreOf))
  const tiedAtTop =
    state.players.filter((player) => scoreOf(player) === topScore).length > 1

  useEffect(() => {
    primaryRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <motion.div
      className="over"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="over__scrim" />
      {humanWon && <Confetti />}
      <motion.section
        className={`over__panel ${humanWon ? 'is-victory' : ''}`}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="over-title"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.08 }}
      >
        <div className="over__crest">
          <IconTrophy size={30} />
        </div>
        <p className="eyebrow over__eyebrow">Portfolio closed · final tally</p>
        <h2 id="over-title" className="over__title">
          {humanWon
            ? soloWinner
              ? 'You own the block.'
              : 'You share the crown.'
            : sharedWin
              ? 'The table splits the crown.'
              : `${soloWinner?.name ?? 'The table'} takes the table.`}
        </h2>
        <p className="over__lede">
          {humanWon
            ? sharedWin
              ? `Your portfolio closed at ${formatMoney(human ? scoreOf(human) : 0)} — level with the best at the table.`
              : `Your portfolio closed at ${formatMoney(human ? scoreOf(human) : 0)} — the richest seat at the table.`
            : human
              ? `You finished ${humanRank}${humanRank === 2 ? 'nd' : humanRank === 3 ? 'rd' : 'th'} with ${formatMoney(scoreOf(human))}. There is always another auction.`
              : 'The checks are counted. The table is settled.'}
        </p>

        <div className="over__standings">
          <div className="over__standings-head">
            <span>Seat</span>
            <span>Checks</span>
            <span>Cash</span>
            <span>Total</span>
          </div>
          {standings.map((player, index) => {
            const checks = player.checks.reduce((sum, check) => sum + check.value, 0)
            const total = scoreOf(player)
            const isWinner = state.winners.includes(player.id)
            return (
              <motion.div
                key={player.id}
                className={`standing ${player.isHuman ? 'is-you' : ''} ${isWinner ? 'is-winner' : ''}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.07 }}
              >
                <span className="standing__seat">
                  <span className="standing__rank">{index + 1}</span>
                  <Avatar index={player.avatar} size={32} />
                  <span className="standing__name">
                    {player.name}
                    {isWinner && <IconCrown size={13} />}
                    {player.isHuman && <em>you</em>}
                  </span>
                </span>
                <span className="standing__checks">
                  {formatMoney(checks)}
                  <small>{player.checks.length} checks</small>
                </span>
                <span className="standing__cash">
                  {formatMoney(player.cash)}
                  <small>left</small>
                </span>
                <strong className="standing__total">{formatMoney(total)}</strong>
              </motion.div>
            )
          })}
        </div>

        {tiedAtTop && state.winners.length === 1 && (
          <p className="over__tiebreak">
            <IconCheck size={13} /> Tied on total? The seat with the most cash left takes it.
          </p>
        )}

        <div className="over__footer">
          <div className="over__best">
            <span className="eyebrow">Table high</span>
            <strong>{formatMoney(bestScore)}</strong>
          </div>
          <div className="over__actions">
            <button className="btn btn--gold" onClick={onRematch} ref={primaryRef}>
              Play again
              <span className="btn__arrow">→</span>
            </button>
            <button className="btn btn--ghost" onClick={onLobby}>
              <IconDoor size={16} /> Lobby
            </button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}
