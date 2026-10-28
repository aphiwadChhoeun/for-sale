import type { GameState, NoticeKind } from '../game/types'
import { Avatar } from './Avatar'
import {
  IconArrowRight,
  IconCheck,
  IconCrown,
  IconGavel,
  IconHouse,
  IconSparkle,
  IconTrophy,
} from './Icons'

function iconFor(kind: NoticeKind) {
  switch (kind) {
    case 'deal':
      return <IconGavel size={15} />
    case 'bid':
      return <IconSparkle size={15} />
    case 'pass':
      return <IconArrowRight size={15} />
    case 'won':
      return <IconCrown size={15} />
    case 'reveal':
      return <IconSparkle size={15} />
    case 'sold':
      return <IconCheck size={15} />
    case 'gameover':
      return <IconTrophy size={15} />
    default:
      return <IconHouse size={15} />
  }
}

export function Ticker({ state }: { state: GameState }) {
  const notice = state.notice
  if (!notice) return null
  const player = notice.playerId
    ? state.players.find((entry) => entry.id === notice.playerId)
    : undefined

  return (
    <div className={`ticker ticker--${notice.kind}`} key={notice.id}>
      <span className="ticker__icon">{iconFor(notice.kind)}</span>
      <span className="ticker__text">
        <strong>{notice.text}</strong>
        {notice.detail && <span>{notice.detail}</span>}
      </span>
      {player && (
        <span className="ticker__avatar">
          <Avatar index={player.avatar} size={22} />
        </span>
      )}
    </div>
  )
}
