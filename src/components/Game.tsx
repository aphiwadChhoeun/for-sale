import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { GameAction, GameSettings, GameState } from '../game/types'
import { AI_DELAY } from '../game/constants'
import { createGame, gameReducer } from '../game/engine'
import { decideAuction, decideSellingPick } from '../game/ai'
import { playSound, type SoundName } from '../game/sound'
import { BrandLockup, BrandMark } from './BrandMark'
import { AuctionView } from './AuctionView'
import { SellingView } from './SellingView'
import { Seat } from './Seat'
import { HumanDock } from './HumanDock'
import { GameOver } from './GameOver'
import { Modal } from './Modal'
import { Ticker } from './Ticker'
import { IconDoor, IconHelp, IconMute, IconSound } from './Icons'

interface GameProps {
  settings: GameSettings
  soundOn: boolean
  rulesOpen: boolean
  onToggleSound: () => void
  onRules: () => void
  onExit: () => void
  onGameOver: (humanWon: boolean) => void
}

function noticeSound(kind: string): SoundName | null {
  switch (kind) {
    case 'bid':
      return 'bid'
    case 'pass':
      return 'pass'
    case 'won':
      return 'won'
    case 'reveal':
      return 'reveal'
    case 'sold':
      return 'coin'
    case 'deal':
    case 'info':
      return 'deal'
    default:
      return null
  }
}

export function Game({
  settings,
  soundOn,
  rulesOpen,
  onToggleSound,
  onRules,
  onExit,
  onGameOver,
}: GameProps) {
  const [state, setState] = useState<GameState>(() => createGame(settings))
  const [selectedHouseId, setSelectedHouseId] = useState<number | null>(null)
  const [showOver, setShowOver] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const reportedRef = useRef(false)
  const soundNoticeRef = useRef(0)
  const soundOnRef = useRef(soundOn)
  const stateRef = useRef(state)

  useLayoutEffect(() => {
    stateRef.current = state
    soundOnRef.current = soundOn
  }, [state, soundOn])

  const dispatch = useCallback((action: GameAction) => {
    setState((current) => gameReducer(current, action))
  }, [])

  const human = state.players.find((player) => player.isHuman) ?? state.players[0]
  const auction = state.auction
  const selling = state.selling

  const activeTurn =
    state.phase === 'buying' && auction && !auction.resolved
      ? auction.turn
      : -1

  /* ── The game's heartbeat: rivals think, cards settle, rounds advance ── */
  useEffect(() => {
    if (rulesOpen || leaveOpen) return

    if (state.phase === 'buying' && state.auction) {
      if (state.auction.resolved) {
        const timer = window.setTimeout(
          () => dispatch({ type: 'END_AUCTION' }),
          AI_DELAY.auctionEnd,
        )
        return () => window.clearTimeout(timer)
      }
      const player = state.players[state.auction.turn]
      if (!player || player.isHuman) return
      const action = decideAuction(state, player, state.settings.difficulty)
      const timer = window.setTimeout(
        () => {
          if ('pass' in action) {
            dispatch({ type: 'PASS', playerId: player.id })
          } else {
            dispatch({ type: 'BID', playerId: player.id, amount: action.amount })
          }
        },
        ('pass' in action ? AI_DELAY.pass : AI_DELAY.bid) + Math.random() * 170,
      )
      return () => window.clearTimeout(timer)
    }

    if (state.phase === 'selling' && state.selling) {
      const round = state.selling
      if (round.step === 'choose') {
        const rival = state.players.find(
          (player) => !player.isHuman && round.picks[player.id] === undefined,
        )
        if (!rival) return
        const houseId = decideSellingPick(state, rival, state.settings.difficulty)
        if (houseId < 0) return
        const timer = window.setTimeout(
          () =>
            dispatch({
              type: 'SELL_PICK',
              playerId: rival.id,
              houseId,
            }),
          AI_DELAY.pick + Math.random() * 90,
        )
        return () => window.clearTimeout(timer)
      }
      if (round.step === 'reveal') {
        const timer = window.setTimeout(
          () => dispatch({ type: 'SHOW_RESULTS' }),
          AI_DELAY.reveal,
        )
        return () => window.clearTimeout(timer)
      }
      if (round.step === 'results') {
        const timer = window.setTimeout(
          () => dispatch({ type: 'FINISH_SELLING' }),
          AI_DELAY.results,
        )
        return () => window.clearTimeout(timer)
      }
    }
  }, [state, dispatch, rulesOpen, leaveOpen])

  /* ── Sounds for the latest table beat ── */
  const noticeId = state.notice?.id ?? 0
  useEffect(() => {
    const current = stateRef.current
    const notice = current.notice
    if (!notice || notice.id === soundNoticeRef.current) return
    soundNoticeRef.current = notice.id
    const enabled = soundOnRef.current
    if (notice.kind === 'gameover') {
      const humanWon = current.winners.includes(
        current.players.find((player) => player.isHuman)?.id ?? '',
      )
      playSound(humanWon ? 'win' : 'lose', enabled)
      return
    }
    const sound = noticeSound(notice.kind)
    if (sound) playSound(sound, enabled)
  }, [noticeId])

  /* ── Finish line ── */
  useEffect(() => {
    if (state.phase !== 'gameover' || rulesOpen) return
    const timer = window.setTimeout(() => setShowOver(true), 950)
    return () => window.clearTimeout(timer)
  }, [state.phase, rulesOpen])

  useEffect(() => {
    if (state.phase !== 'gameover' || reportedRef.current) return
    reportedRef.current = true
    onGameOver(state.winners.includes(human.id))
  }, [state.phase, state.winners, human.id, onGameOver])

  const placeBid = useCallback(
    (amount: number) => {
      const current = stateRef.current
      const currentAuction = current.auction
      if (!currentAuction || currentAuction.resolved) return
      const player = current.players[currentAuction.turn]
      if (!player?.isHuman) return
      dispatch({ type: 'BID', playerId: player.id, amount })
    },
    [dispatch],
  )

  const placePass = useCallback(() => {
    const current = stateRef.current
    const currentAuction = current.auction
    if (!currentAuction || currentAuction.resolved) return
    const player = current.players[currentAuction.turn]
    if (!player?.isHuman) return
    dispatch({ type: 'PASS', playerId: player.id })
  }, [dispatch])

  const sellHouse = () => {
    if (!selling || selectedHouseId === null) return
    if (selling.picks[human.id] !== undefined) return
    playSound('click', soundOn)
    dispatch({ type: 'SELL_PICK', playerId: human.id, houseId: selectedHouseId })
  }

  const selectHouse = (houseId: number) => {
    if (!selling || selling.picks[human.id] !== undefined) return
    playSound('select', soundOn)
    setSelectedHouseId(houseId)
  }

  const rematch = () => {
    reportedRef.current = false
    soundNoticeRef.current = 0
    setShowOver(false)
    setLeaveOpen(false)
    setSelectedHouseId(null)
    setState(createGame(settings, Date.now() >>> 0))
  }

  const roundIndex =
    state.phase === 'buying'
      ? auction?.round ?? 1
      : state.phase === 'selling'
        ? selling?.round ?? 1
        : state.totalRounds
  const phaseLabel =
    state.phase === 'buying'
      ? 'Buying phase'
      : state.phase === 'selling'
        ? 'Selling phase'
        : 'Portfolio closed'
  const roundWord = state.phase === 'selling' ? 'Sale' : 'Lot'
  const rivals = state.players.filter((player) => !player.isHuman)

  return (
    <div className={`game game--${state.phase}`}>
      <header className="gamebar">
        <div className="gamebar__brand">
          <BrandLockup compact />
        </div>
        <div className="gamebar__status">
          <div className="gamebar__status-top">
            <span className="eyebrow">{phaseLabel}</span>
            <span className="gamebar__round">
              {roundWord} {Math.min(roundIndex, state.totalRounds)} of {state.totalRounds}
            </span>
          </div>
          <div className="round-dots" aria-hidden="true">
            {Array.from({ length: state.totalRounds }, (_, index) => (
              <span
                key={index}
                className={[
                  'round-dots__dot',
                  index < roundIndex ? 'is-done' : '',
                  index === roundIndex - 1 && state.phase !== 'gameover'
                    ? 'is-current'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            ))}
          </div>
        </div>
        <div className="gamebar__actions">
          <button className="icon-btn" onClick={onRules} aria-label="How to play">
            <IconHelp size={20} />
          </button>
          <button
            className="icon-btn"
            onClick={onToggleSound}
            aria-label={soundOn ? 'Mute sound' : 'Enable sound'}
          >
            {soundOn ? <IconSound size={20} /> : <IconMute size={20} />}
          </button>
          <button
            className="icon-btn"
            onClick={() => setLeaveOpen(true)}
            aria-label="Leave the table"
          >
            <IconDoor size={20} />
          </button>
        </div>
      </header>

      <div className="table-shell">
        <div className="table">
          <div className="table__pattern" aria-hidden="true" />
          <div className="table__watermark" aria-hidden="true">
            <BrandMark size={360} />
          </div>
          <div className="table__corner table__corner--tl" aria-hidden="true" />
          <div className="table__corner table__corner--tr" aria-hidden="true" />
          <div className="table__corner table__corner--bl" aria-hidden="true" />
          <div className="table__corner table__corner--br" aria-hidden="true" />

          <div
            className={`rivals rivals--${rivals.length}`}
            aria-label="Rival seats"
          >
            {rivals.map((player) => {
              const index = state.players.findIndex(
                (entry) => entry.id === player.id,
              )
              const isChoosing = Boolean(
                state.phase === 'selling' &&
                  selling?.step === 'choose' &&
                  selling.picks[player.id] === undefined,
              )
              return (
                <Seat
                  key={player.id}
                  player={player}
                  state={state}
                  isActive={activeTurn === index}
                  isChoosing={isChoosing}
                />
              )
            })}
          </div>

          <div className="table__market">
            <AnimatePresence mode="wait" initial={false}>
              {state.phase === 'buying' && (
                <motion.div
                  key="buying"
                  className="market-swap"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22 }}
                >
                  <AuctionView
                    state={state}
                    human={human}
                    onBid={placeBid}
                    onPass={placePass}
                    keyboardBlocked={rulesOpen || leaveOpen}
                  />
                </motion.div>
              )}
              {state.phase === 'selling' && (
                <motion.div
                  key="selling"
                  className="market-swap"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22 }}
                >
                  <SellingView
                    state={state}
                    human={human}
                    onNext={() => dispatch({ type: 'FINISH_SELLING' })}
                  />
                </motion.div>
              )}
              {state.phase === 'gameover' && (
                <motion.div
                  key="closed"
                  className="market-swap"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="market-closed">
                    <BrandMark size={54} />
                    <span className="eyebrow">The table is closed</span>
                    <h2>Every house has a buyer.</h2>
                    <p>Counting checks and cash…</p>
                    <Ticker state={state} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <HumanDock
            state={state}
            human={human}
            selectedHouseId={selectedHouseId}
            onSelect={selectHouse}
            onSell={sellHouse}
            canSell={Boolean(
              selling && selectedHouseId !== null && selling.picks[human.id] === undefined,
            )}
          />
        </div>
      </div>

      {leaveOpen && (
        <Modal
          labelledBy="leave-title"
          onClose={() => setLeaveOpen(false)}
          className="modal--confirm"
        >
          <div className="confirm">
            <span className="confirm__mark">
              <IconDoor size={26} />
            </span>
            <span className="eyebrow">Leave the table?</span>
            <h2 id="leave-title">The auction is still live.</h2>
            <p>
              Your portfolio will be folded up and this table will forget you. The
              rivals won't.
            </p>
            <div className="confirm__actions">
              <button
                className="btn btn--gold"
                onClick={() => setLeaveOpen(false)}
                data-autofocus
              >
                Keep playing
              </button>
              <button className="btn btn--ghost" onClick={onExit}>
                Leave anyway
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showOver && state.phase === 'gameover' && (
        <GameOver state={state} onRematch={rematch} onLobby={onExit} />
      )}

      <div className="sr-only" aria-live="polite">
        {state.notice?.text}
        {state.notice?.detail ? `. ${state.notice.detail}` : ''}
      </div>
    </div>
  )
}
