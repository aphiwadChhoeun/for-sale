import { useMemo } from 'react'
import type { GameSettings } from '../game/types'
import { BrandLockup } from './BrandMark'
import { CheckCardFace, HouseCardFace, BillIcon } from './Cards'
import { IconHelp, IconMute, IconSound, IconSparkle, IconTrophy } from './Icons'

interface MenuProps {
  settings: GameSettings
  stats: { games: number; wins: number }
  soundOn: boolean
  onSettings: (settings: GameSettings) => void
  onStart: () => void
  onRules: () => void
  onToggleSound: () => void
}

export function Menu({
  settings,
  stats,
  soundOn,
  onSettings,
  onStart,
  onRules,
  onToggleSound,
}: MenuProps) {
  const trophyCard = useMemo(() => ({ id: 30, value: 30 }), [])
  const starterCard = useMemo(() => ({ id: 1, value: 1 }), [])
  const checkCard = useMemo(() => ({ id: 14, value: 15 }), [])

  return (
    <main className="menu">
      <div className="menu__glow" aria-hidden="true" />
      <div className="menu__rings" aria-hidden="true" />

      <header className="menu__top">
        <BrandLockup />
        <div className="menu__top-actions">
          <button className="icon-btn" onClick={onRules} aria-label="How to play">
            <IconHelp size={21} />
          </button>
          <button
            className="icon-btn"
            onClick={onToggleSound}
            aria-label={soundOn ? 'Mute sound' : 'Enable sound'}
          >
            {soundOn ? <IconSound size={21} /> : <IconMute size={21} />}
          </button>
        </div>
      </header>

      <div className="menu__content">
        <section className="menu__copy">
          <p className="eyebrow menu__eyebrow">
            <span className="eyebrow__line" />
            A 15-minute auction classic
          </p>
          <h1 className="menu__sign">
            <span className="sr-only">For Sale</span>
            <span className="menu__sign-board" aria-hidden="true">
              <span className="menu__sign-band">
                <span>Auction House</span>
                <span>Est. 1997</span>
              </span>
              <span className="menu__sign-body">
                <span className="menu__sign-for">For</span>
                <span className="menu__sign-sale">Sale</span>
                <span className="menu__sign-rule" />
                <span className="menu__sign-foot">By appointment only</span>
              </span>
              <span className="menu__sign-bolt menu__sign-bolt--left" />
              <span className="menu__sign-bolt menu__sign-bolt--right" />
            </span>
            <span className="menu__sign-post" aria-hidden="true" />
            <span className="menu__sign-ground" aria-hidden="true" />
          </h1>
          <p className="menu__lede">
            Buy the best houses when the market is quiet.
            <br />
            Then flip them for a fortune.
          </p>

          <div className="menu__panel">
            <div className="menu__field">
              <div className="menu__field-head">
                <span className="option-label">Table for</span>
                <span className="option-value">
                  {settings.playerCount} players
                </span>
              </div>
              <div className="segmented" role="group" aria-label="Number of players">
                {[3, 4, 5, 6].map((count) => (
                  <button
                    key={count}
                    className={`segmented__btn ${settings.playerCount === count ? 'is-active' : ''}`}
                    aria-pressed={settings.playerCount === count}
                    onClick={() =>
                      onSettings({ ...settings, playerCount: count })
                    }
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="menu__field">
              <div className="menu__field-head">
                <span className="option-label">Rivals</span>
                <span className="option-value">
                  {settings.difficulty === 'sharp' ? 'Cutthroat' : 'Casual'}
                </span>
              </div>
              <div className="segmented segmented--wide" role="group" aria-label="Rival difficulty">
                <button
                  className={`segmented__btn ${settings.difficulty === 'casual' ? 'is-active' : ''}`}
                  aria-pressed={settings.difficulty === 'casual'}
                  onClick={() => onSettings({ ...settings, difficulty: 'casual' })}
                >
                  Casual
                </button>
                <button
                  className={`segmented__btn ${settings.difficulty === 'sharp' ? 'is-active' : ''}`}
                  aria-pressed={settings.difficulty === 'sharp'}
                  onClick={() => onSettings({ ...settings, difficulty: 'sharp' })}
                >
                  Cutthroat
                </button>
              </div>
              <p className="menu__hint">
                {settings.difficulty === 'sharp'
                  ? 'Sharp bidders. Sharper exits. Bring a plan.'
                  : 'Relaxed rivals who let a good deal slide.'}
              </p>
            </div>

            <button className="btn btn--gold btn--start" onClick={onStart}>
              Take a seat
              <span className="btn__arrow">→</span>
            </button>

            <div className="menu__meta">
              <span className="menu__record">
                <IconTrophy size={15} />
                {stats.games > 0
                  ? `${stats.wins} ${stats.wins === 1 ? 'win' : 'wins'} in ${stats.games} ${stats.games === 1 ? 'game' : 'games'}`
                  : 'No portfolio on record'}
              </span>
              <button className="text-btn" onClick={onRules}>
                How to play
              </button>
            </div>
          </div>
        </section>

        <section className="menu__scene" aria-hidden="true">
          <div className="scene__sun" />
          <div className="scene__horizon">
            <span />
            <span />
            <span />
          </div>
          <div className="scene__stamp">
            <span>EST.</span>
            <strong>1997</strong>
            <span>AUCTION HOUSE</span>
          </div>
          <div className="scene__cards">
            <div className="scene-card scene-card--back">
              <div className="scene-card__inner scene-card__inner--check">
                <CheckCardFace card={checkCard} size="lg" />
              </div>
            </div>
            <div className="scene-card scene-card--middle">
              <div className="scene-card__inner">
                <HouseCardFace card={starterCard} size="lg" />
              </div>
            </div>
            <div className="scene-card scene-card--front">
              <div className="scene-card__inner">
                <HouseCardFace card={trophyCard} size="xl" />
              </div>
            </div>
            <div className="scene__cash">
              <BillIcon />
              <span>$18,000</span>
            </div>
            <div className="scene__badge">
              <IconSparkle size={14} />
              <span>Bid smart. Sell higher.</span>
            </div>
          </div>
          <div className="scene__floor" />
        </section>
      </div>

      <footer className="menu__footer">
        <span>A game by Stefan Dorra</span>
        <span className="menu__footer-dot" />
        <span>3–6 players · 15 minutes</span>
        <span className="menu__footer-spacer" />
        <span>Digital edition</span>
      </footer>
    </main>
  )
}
