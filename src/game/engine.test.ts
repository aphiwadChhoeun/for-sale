import { describe, expect, it } from 'vitest'
import { createGame, gameReducer, scoreOf } from './engine'
import { decideAuction, decideSellingPick } from './ai'
import type { GameState, GameSettings } from './types'

function step(state: GameState): GameState {
  if (state.phase === 'buying') {
    if (!state.auction) throw new Error('buying without an auction')
    if (state.auction.resolved) {
      return gameReducer(state, { type: 'END_AUCTION' })
    }
    const player = state.players[state.auction.turn]
    const action = decideAuction(state, player, state.settings.difficulty)
    return 'pass' in action
      ? gameReducer(state, { type: 'PASS', playerId: player.id })
      : gameReducer(state, {
          type: 'BID',
          playerId: player.id,
          amount: action.amount,
        })
  }

  if (state.phase === 'selling') {
    const selling = state.selling
    if (!selling) throw new Error('selling without a round')
    if (selling.step === 'choose') {
      const player = state.players.find(
        (entry) => selling.picks[entry.id] === undefined,
      )
      if (!player) throw new Error('no player left to pick')
      const houseId = decideSellingPick(
        state,
        player,
        state.settings.difficulty,
      )
      return gameReducer(state, {
        type: 'SELL_PICK',
        playerId: player.id,
        houseId,
      })
    }
    if (selling.step === 'reveal') {
      return gameReducer(state, { type: 'SHOW_RESULTS' })
    }
    return gameReducer(state, { type: 'FINISH_SELLING' })
  }

  return state
}

function checkInvariants(state: GameState, purchasedHouses: number) {
  expect(state.players.every((player) => player.cash >= 0)).toBe(true)
  expect(
    state.players.every(
      (player) =>
        state.phase !== 'buying' ||
        player.bid <= player.cash ||
        player.passed,
    ),
  ).toBe(true)

  if (state.phase === 'buying') {
    const houseIds = [
      ...state.houseDeck.map((card) => card.id),
      ...state.players.flatMap((player) => player.houses.map((card) => card.id)),
      ...(state.auction?.houses.map((card) => card.id) ?? []),
    ]
    expect(new Set(houseIds).size).toBe(houseIds.length)
    expect(houseIds.length).toBe(purchasedHouses)
    return
  }

  const remainingHouseIds = [
    ...state.players.flatMap((player) => player.houses.map((card) => card.id)),
    ...state.soldHouses,
  ]
  expect(new Set(remainingHouseIds).size).toBe(remainingHouseIds.length)
  expect(remainingHouseIds.length).toBe(purchasedHouses)

  const checkIds = [
    ...state.checkDeck.map((card) => card.id),
    ...state.players.flatMap((player) => player.checks.map((card) => card.id)),
    ...(state.selling && state.selling.step !== 'results'
      ? state.selling.checks.map((card) => card.id)
      : []),
  ]
  expect(new Set(checkIds).size).toBe(checkIds.length)
}

function playOut(settings: GameSettings, seed: number): GameState {
  let state = createGame(settings, seed)
  const purchasedHouses = state.players.length * state.totalRounds
  let guard = 0

  while (state.phase !== 'gameover' && guard < 5000) {
    checkInvariants(state, purchasedHouses)
    const next = step(state)
    if (next === state) throw new Error(`stalled at guard ${guard}`)
    state = next
    guard += 1
  }

  expect(state.phase).toBe('gameover')
  expect(guard).toBeLessThan(5000)
  checkInvariants(state, purchasedHouses)
  return state
}

describe('setup', () => {
  it.each([
    [3, 18, 24, 8],
    [4, 18, 28, 7],
    [5, 14, 30, 6],
    [6, 14, 30, 5],
  ])(
    'sets up %i players correctly',
    (count, cash, cards, rounds) => {
      const state = createGame(
        { playerCount: count, difficulty: 'sharp' },
        12345,
      )
      expect(state.players).toHaveLength(count)
      expect(state.players[0].isHuman).toBe(true)
      expect(state.players[0].cash).toBe(cash)
      expect(state.houseDeck.length + (state.auction?.houses.length ?? 0)).toBe(
        cards,
      )
      expect(state.checkDeck.length).toBe(cards)
      expect(state.totalRounds).toBe(rounds)
      expect(state.auction?.houses).toHaveLength(count)
    },
  )

  it('deals a full check deck with two voids and no $1,000 check', () => {
    const state = createGame({ playerCount: 6, difficulty: 'casual' }, 1)
    const values = [
      ...state.checkDeck.map((card) => card.value),
      ...(state.selling?.checks.map((card) => card.value) ?? []),
    ]
    expect(values.filter((value) => value === 0)).toHaveLength(2)
    expect(values).not.toContain(1)
    expect(values.filter((value) => value === 15)).toHaveLength(2)
  })
})

describe('full games', () => {
  for (const count of [3, 4, 5, 6]) {
    it(`plays ${count}-player games to completion`, () => {
      for (let seed = 1; seed <= 12; seed += 1) {
        const state = playOut(
          {
            playerCount: count,
            difficulty: seed % 2 === 0 ? 'sharp' : 'casual',
          },
          seed * 7919 + count,
        )

        expect(state.winners.length).toBeGreaterThan(0)
        expect(state.checkDeck).toHaveLength(0)
        expect(state.houseDeck).toHaveLength(0)
        expect(state.soldHouses).toHaveLength(count * state.totalRounds)

        for (const player of state.players) {
          expect(player.houses).toHaveLength(0)
          expect(player.checks).toHaveLength(state.totalRounds)
          expect(player.cash).toBeGreaterThanOrEqual(0)
          expect(scoreOf(player)).toBeGreaterThan(0)
        }

        const winnerScores = state.winners.map(
          (id) => scoreOf(state.players.find((player) => player.id === id)!),
        )
        const best = Math.max(...state.players.map(scoreOf))
        expect(winnerScores.every((score) => score === best)).toBe(true)
      }
    })
  }
})
