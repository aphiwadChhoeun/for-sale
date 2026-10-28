import type { Difficulty } from './types'

export const MIN_PLAYERS = 3
export const MAX_PLAYERS = 6

export const PLAYER_NAMES = ['Marlow', 'Vesper', 'Sable', 'Juno', 'Ace']
export const PLAYER_AGGRESSION = [0.96, 1.08, 0.88, 1.14, 1.0]

/** Starting capital in $1,000 bills. */
export const STARTING_CASH: Record<number, number> = {
  3: 18,
  4: 18,
  5: 14,
  6: 14,
}

/** Cards removed from the top of each deck before play. */
export const DISCARD_COUNT: Record<number, number> = {
  3: 6,
  4: 2,
  5: 0,
  6: 0,
}

export const STARTING_PLAYER_COUNT = 4
export const DEFAULT_DIFFICULTY: Difficulty = 'casual'

export const AI_DELAY = {
  bid: 560,
  pass: 680,
  pick: 340,
  reveal: 780,
  results: 2800,
  auctionEnd: 1350,
}
