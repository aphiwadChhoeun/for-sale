import type { GameState, Player } from '../game/types'
import { formatMoney, formatMoneyShort } from '../game/format'
import { Avatar } from './Avatar'
import { BillIcon, CardBack, HouseCardFace } from './Cards'
import { IconCheck, IconCrown, IconHouse } from './Icons'

interface SeatProps {
  player: Player
  state: GameState
  isActive: boolean
  isChoosing?: boolean
}

export function Seat({ player, state, isActive, isChoosing = false }: SeatProps) {
  const { auction, selling, phase } = state
  const pickId = selling?.picks[player.id]
  const result = selling?.results?.find((entry) => entry.playerId === player.id)
  const pickHouse =
    (pickId !== undefined
      ? player.houses.find((house) => house.id === pickId)
      : undefined) ?? result?.house
  const revealed = Boolean(selling && selling.step !== 'choose')
  const isReady = Boolean(
    selling && selling.step === 'choose' && pickId !== undefined,
  )
  const passed = phase === 'buying' && player.passed
  const highBidder = auction?.highBidder === player.id && !auction?.resolved
  const showMoney = phase === 'gameover'
  const total = player.cash + player.checks.reduce((sum, check) => sum + check.value, 0)

  return (
    <article
      className={[
        'seat',
        isActive ? 'is-active' : '',
        passed ? 'is-passed' : '',
        isChoosing ? 'is-choosing' : '',
        highBidder ? 'is-high' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`${player.name}: ${player.houses.length} houses, ${player.checks.length} checks`}
    >
      <div className="seat__identity">
        <div className="seat__avatar-wrap">
          <Avatar index={player.avatar} size={42} />
          {isActive && <span className="seat__active-dot" />}
          {isReady && (
            <span className="seat__ready-dot" title="Offer ready">
              <IconCheck size={8} />
            </span>
          )}
        </div>
        <div className="seat__text">
          <h3 className="seat__name">{player.name}</h3>
          <div className="seat__stats">
            <span className="seat__stat" title="Houses bought">
              <IconHouse size={12} />
              {player.houses.length}
            </span>
            <span className="seat__stat" title="Checks collected">
              <IconCheck size={12} />
              {player.checks.length}
            </span>
            <span className="seat__cash" title="Cash is kept face down">
              <BillIcon />
              {showMoney ? formatMoneyShort(player.cash) : '•••'}
            </span>
          </div>
        </div>
      </div>

      <div className="seat__side">
        {phase === 'buying' && (
          <>
            {passed ? (
              <span className="seat__status seat__status--out">out</span>
            ) : player.bid > 0 ? (
              <span className={`seat__bid ${highBidder ? 'seat__bid--high' : ''}`}>
                {highBidder && <IconCrown size={10} />}
                {formatMoneyShort(player.bid)}
              </span>
            ) : (
              <span className="seat__waiting">{isActive ? '•••' : '—'}</span>
            )}
            {player.paid > 0 && passed && (
              <span className="seat__paid">paid {formatMoneyShort(player.paid)}</span>
            )}
          </>
        )}

        {phase === 'selling' && (
          <div className="play-slot">
            {pickHouse ? (
              <div className={`play-slot__card ${revealed ? 'is-revealed' : ''}`}>
                <div className="play-slot__flip">
                  <div className="play-slot__face play-slot__face--back">
                    <CardBack size="mini" />
                  </div>
                  <div className="play-slot__face play-slot__face--front">
                    <HouseCardFace card={pickHouse} size="mini" showCorner={false} />
                  </div>
                </div>
                {!revealed && <span className="play-slot__ready">ready</span>}
              </div>
            ) : (
              <div className={`play-slot__empty ${isChoosing ? 'is-thinking' : ''}`}>
                <span />
                <span />
                <span />
              </div>
            )}
            {revealed && result && (
              <span className="play-slot__check" key={result.check.id}>
                +{formatMoneyShort(result.check.value)}
              </span>
            )}
          </div>
        )}

        {phase === 'gameover' && (
          <span className="seat__status seat__status--total">
            {formatMoney(total)}
          </span>
        )}
      </div>
    </article>
  )
}
