import {
  DISCARD_COUNT,
  MAX_PLAYERS,
  MIN_PLAYERS,
  PLAYER_AGGRESSION,
  PLAYER_NAMES,
  STARTING_CASH,
} from './constants'
import { formatMoney } from './format'
import type {
  Auction,
  AuctionResult,
  CheckCard,
  GameAction,
  GameSettings,
  GameState,
  HouseCard,
  NoticeKind,
  Player,
  SellResult,
} from './types'

export function createRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: T[], rng: () => number): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function createHouses(): HouseCard[] {
  return Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    value: index + 1,
  }))
}

export function createChecks(): CheckCard[] {
  const values = [0, 0]
  for (let value = 2; value <= 15; value += 1) {
    values.push(value, value)
  }
  return values.map((value, index) => ({ id: index, value }))
}

export function createGame(
  settings: GameSettings,
  seed: number = Date.now() >>> 0,
): GameState {
  const count = Math.min(
    MAX_PLAYERS,
    Math.max(MIN_PLAYERS, settings.playerCount),
  )
  const rng = createRng(seed)
  const discard = DISCARD_COUNT[count] ?? 0

  const houses = shuffle(createHouses(), rng).slice(0, 30 - discard)
  const checks = shuffle(createChecks(), rng).slice(0, 30 - discard)

  const players: Player[] = Array.from({ length: count }, (_, index) => {
    const isHuman = index === 0
    return {
      id: `p${index}`,
      name: isHuman ? 'You' : PLAYER_NAMES[index - 1] ?? `Rival ${index}`,
      isHuman,
      avatar: index,
      aggression:
        (PLAYER_AGGRESSION[index - 1] ?? 1) * (0.95 + rng() * 0.1),
      cash: STARTING_CASH[count] ?? 14,
      houses: [],
      checks: [],
      bid: 0,
      paid: 0,
      passed: false,
    }
  })

  const state: GameState = {
    phase: 'buying',
    players,
    houseDeck: houses,
    checkDeck: checks,
    auction: null,
    selling: null,
    soldHouses: [],
    round: 1,
    totalRounds: (30 - discard) / count,
    notice: null,
    noticeSeq: 0,
    winners: [],
    settings: { ...settings, playerCount: count },
  }

  const startPlayer = Math.floor(rng() * count)
  startAuction(state, startPlayer)
  return state
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    players: state.players.map((player) => ({
      ...player,
      houses: [...player.houses],
      checks: [...player.checks],
    })),
    houseDeck: [...state.houseDeck],
    checkDeck: [...state.checkDeck],
    auction: state.auction
      ? {
          ...state.auction,
          houses: [...state.auction.houses],
          resolved: state.auction.resolved
            ? { ...state.auction.resolved }
            : null,
        }
      : null,
    selling: state.selling
      ? {
          ...state.selling,
          checks: [...state.selling.checks],
          picks: { ...state.selling.picks },
          results: state.selling.results
            ? state.selling.results.map((result) => ({ ...result }))
            : null,
        }
      : null,
    soldHouses: [...state.soldHouses],
    winners: [...state.winners],
    notice: state.notice ? { ...state.notice } : null,
  }
}

function notify(
  state: GameState,
  kind: NoticeKind,
  text: string,
  detail?: string,
  playerId?: string,
) {
  state.noticeSeq += 1
  state.notice = { id: state.noticeSeq, kind, text, detail, playerId }
}

function playerIndex(state: GameState, playerId: string): number {
  return state.players.findIndex((player) => player.id === playerId)
}

export function playerById(
  state: GameState,
  playerId: string,
): Player | undefined {
  return state.players.find((player) => player.id === playerId)
}

function drawHouses(state: GameState, count: number): HouseCard[] {
  const drawn: HouseCard[] = []
  for (let i = 0; i < count && state.houseDeck.length > 0; i += 1) {
    const card = state.houseDeck.pop()
    if (card) drawn.push(card)
  }
  return drawn.sort((a, b) => a.value - b.value)
}

function drawChecks(state: GameState, count: number): CheckCard[] {
  const drawn: CheckCard[] = []
  for (let i = 0; i < count && state.checkDeck.length > 0; i += 1) {
    const card = state.checkDeck.pop()
    if (card) drawn.push(card)
  }
  return drawn.sort((a, b) => b.value - a.value)
}

function startAuction(state: GameState, startPlayer: number) {
  state.phase = 'buying'
  state.players.forEach((player) => {
    player.bid = 0
    player.paid = 0
    player.passed = false
  })

  const auction: Auction = {
    houses: drawHouses(state, state.players.length),
    turn: startPlayer,
    startPlayer,
    currentBid: 0,
    highBidder: null,
    resolved: null,
    round: state.round,
  }
  state.auction = auction

  const opener = state.players[startPlayer]
  notify(
    state,
    'deal',
    `${opener.name === 'You' ? 'You open' : `${opener.name} opens`} the bidding.`,
    `Round ${state.round} of ${state.totalRounds} · ${auction.houses.length} houses on the block`,
    opener.id,
  )
}

function nextActiveIndex(state: GameState, from: number): number {
  const { players } = state
  for (let step = 1; step <= players.length; step += 1) {
    const index = (from + step) % players.length
    if (!players[index].passed) return index
  }
  return from
}

function resolveAuction(state: GameState, auction: Auction) {
  const winner = state.players.filter((player) => !player.passed)[0]
  if (!winner) return
  const house = auction.houses.shift()
  if (!house) return

  const cost = winner.bid
  winner.cash -= cost
  winner.paid = cost
  winner.houses.push(house)

  const result: AuctionResult = {
    playerId: winner.id,
    house,
    cost,
    bid: winner.bid,
  }
  auction.resolved = result
  auction.turn = playerIndex(state, winner.id)

  notify(
    state,
    'won',
    `${winner.name === 'You' ? 'You take' : `${winner.name} takes`} House ${house.value}.`,
    cost > 0 ? `Wins the lot for ${formatMoney(cost)}` : 'Wins the lot for nothing',
    winner.id,
  )
}

function beginSelling(state: GameState) {
  state.phase = 'selling'
  state.auction = null
  state.round = 1
  state.players.forEach((player) => {
    player.bid = 0
    player.paid = 0
    player.passed = false
  })
  startSellingRound(state)
}

function startSellingRound(state: GameState) {
  const checks = drawChecks(state, state.players.length)
  state.selling = {
    checks,
    picks: {},
    step: 'choose',
    results: null,
    round: state.round,
  }
  notify(
    state,
    'deal',
    `Sale round ${state.round} of ${state.totalRounds}.`,
    `${checks.length} checks on the table · top prize ${formatMoney(checks[0]?.value ?? 0)}`,
  )
}

function computeSellResults(state: GameState): SellResult[] {
  const selling = state.selling
  if (!selling) return []

  const played = state.players
    .map((player) => {
      const houseId = selling.picks[player.id]
      const house = player.houses.find((card) => card.id === houseId)
      return house ? { player, house } : null
    })
    .filter((entry): entry is { player: Player; house: HouseCard } =>
      Boolean(entry),
    )
    .sort((a, b) => b.house.value - a.house.value)

  return played.map((entry, index) => ({
    playerId: entry.player.id,
    house: entry.house,
    check: selling.checks[index],
    rank: index,
  }))
}

function finishSellingRound(state: GameState) {
  state.selling = null
  if (state.checkDeck.length === 0) {
    state.phase = 'gameover'
    state.winners = computeWinnerIds(state)
    const winners = state.players.filter((player) =>
      state.winners.includes(player.id),
    )
    if (winners.length === 1) {
      notify(
        state,
        'gameover',
        `${winners[0].name === 'You' ? 'You win' : `${winners[0].name} wins`} the portfolio.`,
        `Final tally ${formatMoney(scoreOf(winners[0]))}`,
        winners[0].id,
      )
    } else {
      notify(
        state,
        'gameover',
        'The table splits the victory.',
        `${winners.map((player) => player.name).join(' & ')} finish level`,
      )
    }
    return
  }
  state.round += 1
  startSellingRound(state)
}

export function scoreOf(player: Player): number {
  return player.cash + player.checks.reduce((sum, check) => sum + check.value, 0)
}

export function computeWinnerIds(state: GameState): string[] {
  const best = Math.max(...state.players.map(scoreOf))
  const top = state.players.filter((player) => scoreOf(player) === best)
  const mostCash = Math.max(...top.map((player) => player.cash))
  return top
    .filter((player) => player.cash === mostCash)
    .map((player) => player.id)
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const next = cloneState(state)

  switch (action.type) {
    case 'BID': {
      const auction = next.auction
      if (!auction || auction.resolved) return state
      const player = next.players[auction.turn]
      if (!player || player.id !== action.playerId || player.passed) return state
      if (!Number.isInteger(action.amount)) return state
      if (action.amount <= auction.currentBid) return state
      if (action.amount > player.cash) return state
      if (action.amount < 1) return state

      player.bid = action.amount
      auction.currentBid = action.amount
      auction.highBidder = player.id
      auction.turn = nextActiveIndex(next, auction.turn)

      notify(
        next,
        'bid',
        `${player.name === 'You' ? 'You bid' : `${player.name} bids`} ${formatMoney(action.amount)}.`,
        `Next bid must beat ${formatMoney(action.amount)}`,
        player.id,
      )
      return next
    }

    case 'PASS': {
      const auction = next.auction
      if (!auction || auction.resolved) return state
      const player = next.players[auction.turn]
      if (!player || player.id !== action.playerId || player.passed) return state

      const house = auction.houses.shift()
      if (!house) return state

      const cost = Math.ceil(player.bid / 2)
      player.cash -= cost
      player.paid = cost
      player.passed = true
      player.houses.push(house)

      notify(
        next,
        'pass',
        `${player.name === 'You' ? 'You pass' : `${player.name} passes`}.`,
        `Takes House ${house.value} · pays ${cost > 0 ? formatMoney(cost) : 'nothing'}`,
        player.id,
      )

      const active = next.players.filter((entry) => !entry.passed)
      if (active.length === 1) {
        resolveAuction(next, auction)
      } else {
        auction.turn = nextActiveIndex(next, auction.turn)
      }
      return next
    }

    case 'END_AUCTION': {
      const auction = next.auction
      if (!auction || !auction.resolved) return state
      const winnerIndex = playerIndex(next, auction.resolved.playerId)
      if (next.houseDeck.length === 0) {
        beginSelling(next)
      } else {
        next.round += 1
        startAuction(next, winnerIndex)
      }
      return next
    }

    case 'SELL_PICK': {
      const selling = next.selling
      if (!selling || selling.step !== 'choose') return state
      const player = playerById(next, action.playerId)
      if (!player || selling.picks[player.id] !== undefined) return state
      if (!player.houses.some((house) => house.id === action.houseId)) return state

      selling.picks[player.id] = action.houseId
      if (Object.keys(selling.picks).length === next.players.length) {
        selling.results = computeSellResults(next)
        selling.step = 'reveal'
        notify(
          next,
          'reveal',
          'Cards are in. Reveal!',
          'Highest house takes the biggest check.',
        )
      }
      return next
    }

    case 'SHOW_RESULTS': {
      const selling = next.selling
      if (!selling || selling.step !== 'reveal' || !selling.results) return state

      selling.results.forEach((result) => {
        const player = playerById(next, result.playerId)
        if (!player) return
        player.checks.push(result.check)
        player.houses = player.houses.filter(
          (house) => house.id !== result.house.id,
        )
        next.soldHouses.push(result.house.value)
      })

      selling.step = 'results'
      const top = selling.results[0]
      if (top) {
        const player = playerById(next, top.playerId)
        notify(
          next,
          'sold',
          `${player?.name === 'You' ? 'You take' : `${player?.name} takes`} the ${formatMoney(top.check.value)} check.`,
          `House ${top.house.value} tops the round`,
          top.playerId,
        )
      }
      return next
    }

    case 'FINISH_SELLING': {
      const selling = next.selling
      if (!selling || selling.step !== 'results') return state
      finishSellingRound(next)
      return next
    }

    default:
      return state
  }
}

/** Value of a house for bidding heuristics, in $1,000 units. */
export function estimateHouseValue(value: number): number {
  const percentile = Math.max(0, Math.min(1, (value - 0.5) / 30))
  return 1.55 + 13.35 * Math.pow(percentile, 1.18)
}
