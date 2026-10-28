import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import type { GameSettings } from './game/types'
import { DEFAULT_DIFFICULTY, STARTING_PLAYER_COUNT } from './game/constants'
import { playSound, unlockAudio } from './game/sound'
import { Menu } from './components/Menu'
import { Game } from './components/Game'
import { RulesModal } from './components/RulesModal'

interface Stats {
  games: number
  wins: number
}

const SETTINGS_KEY = 'forsale.settings.v1'
const STATS_KEY = 'forsale.stats.v1'
const SOUND_KEY = 'forsale.sound.v1'

const DEFAULT_SETTINGS: GameSettings = {
  playerCount: STARTING_PLAYER_COUNT,
  difficulty: DEFAULT_DIFFICULTY,
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return { ...fallback, ...(JSON.parse(raw) as Partial<T>) }
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* Private mode or a full quota — the game still plays. */
  }
}

function readSound(): boolean {
  try {
    const raw = window.localStorage.getItem(SOUND_KEY)
    return raw === null ? true : raw === 'on'
  } catch {
    return true
  }
}

function loadSettings(): GameSettings {
  const stored = readJson<GameSettings>(SETTINGS_KEY, DEFAULT_SETTINGS)
  const playerCount = [3, 4, 5, 6].includes(stored.playerCount)
    ? stored.playerCount
    : DEFAULT_SETTINGS.playerCount
  const difficulty =
    stored.difficulty === 'sharp' ? 'sharp' : ('casual' as const)
  return { playerCount, difficulty }
}

function loadStats(): Stats {
  const stored = readJson<Stats>(STATS_KEY, { games: 0, wins: 0 })
  return {
    games: Number.isFinite(stored.games) ? stored.games : 0,
    wins: Number.isFinite(stored.wins) ? stored.wins : 0,
  }
}

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'game'>('menu')
  const [settings, setSettings] = useState<GameSettings>(loadSettings)
  const [stats, setStats] = useState<Stats>(loadStats)
  const [soundOn, setSoundOn] = useState<boolean>(readSound)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [gameKey, setGameKey] = useState(0)

  useEffect(() => {
    writeJson(SETTINGS_KEY, settings)
  }, [settings])

  useEffect(() => {
    try {
      window.localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off')
    } catch {
      /* ignore */
    }
  }, [soundOn])

  useEffect(() => {
    const unlock = () => unlockAudio()
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  const startGame = useCallback(() => {
    unlockAudio()
    setGameKey((key) => key + 1)
    setScreen('game')
  }, [])

  const handleGameOver = useCallback((humanWon: boolean) => {
    setStats((current) => {
      const next = {
        games: current.games + 1,
        wins: current.wins + (humanWon ? 1 : 0),
      }
      writeJson(STATS_KEY, next)
      return next
    })
  }, [])

  const openRules = useCallback(() => {
    playSound('click', soundOn)
    setRulesOpen(true)
  }, [soundOn])

  const toggleSound = useCallback(() => {
    const next = !soundOn
    setSoundOn(next)
    if (next) {
      unlockAudio()
      playSound('select', true)
    }
  }, [soundOn])

  const exitToMenu = useCallback(() => {
    playSound('click', soundOn)
    setScreen('menu')
  }, [soundOn])

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <AnimatePresence mode="wait" initial={false}>
          {screen === 'menu' ? (
            <motion.div
              className="screen"
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.995 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <Menu
                settings={settings}
                stats={stats}
                soundOn={soundOn}
                onSettings={setSettings}
                onStart={startGame}
                onRules={openRules}
                onToggleSound={toggleSound}
              />
            </motion.div>
          ) : (
            <motion.div
              className="screen"
              key={`game-${gameKey}`}
              initial={{ opacity: 0, scale: 1.012 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <Game
                key={gameKey}
                settings={settings}
                soundOn={soundOn}
                rulesOpen={rulesOpen}
                onToggleSound={toggleSound}
                onRules={openRules}
                onExit={exitToMenu}
                onGameOver={handleGameOver}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {rulesOpen && <RulesModal onClose={() => setRulesOpen(false)} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
