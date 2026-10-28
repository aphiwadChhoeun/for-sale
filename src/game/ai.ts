import { estimateHouseValue } from './engine'
import type { BidAction, Difficulty, GameState, Player } from './types'

const ALL_HOUSE_VALUES = Array.from({ length: 30 }, (_, index) => index + 1)

function noise(amount: number, fraction: number): number {
  return amount * (1 + (Math.random() * 2 - 1) * fraction)
}

function activeCount(state: GameState): number {
  return state.players.filter((player) => !player.passed).length
}

/**
 * Decide what an AI does with the auction lot. The AI values the upgrade from
 * the worst remaining house (which it can take by passing cheaply) to the best
 * remaining house, then risk-adjusts that gain against its cash on hand.
 */
export function decideAuction(
  state: GameState,
  player: Player,
  difficulty: Difficulty,
): BidAction {
  const auction = state.auction
  if (!auction || auction.houses.length === 0) return { pass: true }
  if (player.cash <= auction.currentBid) return { pass: true }

  const low = auction.houses[0]
  const high = auction.houses[auction.houses.length - 1]
  const lowValue = estimateHouseValue(low.value)
  const highValue = estimateHouseValue(high.value)
  const passCost = Math.ceil(player.bid / 2)

  const sharp = difficulty === 'sharp'
  const risk = (sharp ? 0.78 : 0.6) * player.aggression
  const uncertainty = sharp ? 0.05 : 0.14

  const upgrade = Math.max(0.2, highValue - lowValue)
  let cap = passCost + noise(upgrade, uncertainty) * risk

  // Bidding before you have any skin in the game carries more downside: if you
  // are outbid later you still pay half of whatever you last said.
  if (player.bid === 0) cap *= 0.9

  // A round should not eat the whole wallet, even for a trophy house.
  const perRoundCap =
    player.cash * (sharp ? 0.46 : 0.36) + Math.min(1.2, player.cash * 0.04)
  cap = Math.min(cap, perRoundCap)

  // Give a small concession to the table to avoid paranoid knife-fights.
  if (activeCount(state) === 2) cap *= sharp ? 1.04 : 0.97

  const maxBid = Math.min(player.cash, Math.floor(cap))
  if (maxBid <= auction.currentBid) return { pass: true }
  if (cap - auction.currentBid < (sharp ? 0.25 : 0.55)) return { pass: true }

  const room = maxBid - auction.currentBid
  let target = auction.currentBid + 1
  if (auction.currentBid === 0) {
    target = Math.min(maxBid, Math.random() < player.aggression - 0.9 ? 2 : 1)
  } else if (room >= 3) {
    const jump = 1 + (Math.random() < 0.38 ? 1 : 0) + (room >= 6 && Math.random() < 0.16 ? 1 : 0)
    target = auction.currentBid + jump
  }

  return { amount: Math.max(auction.currentBid + 1, Math.min(maxBid, target)) }
}

function drawOpponentCards(
  pool: number[],
  count: number,
  bias: number,
): number[] {
  if (count <= 0) return []
  const available = [...pool]
  const drawn: number[] = []
  for (let i = 0; i < count && available.length > 0; i += 1) {
    let totalWeight = 0
    const weights = available.map((value) => {
      const weight = 1 + bias * Math.pow(value / 30, 2)
      totalWeight += weight
      return weight
    })
    let roll = Math.random() * totalWeight
    let chosen = available.length - 1
    for (let j = 0; j < weights.length; j += 1) {
      roll -= weights[j]
      if (roll <= 0) {
        chosen = j
        break
      }
    }
    drawn.push(available[chosen])
    available.splice(chosen, 1)
  }
  return drawn
}

/**
 * Estimate the check each card in hand would earn this round. Opponents' hands
 * are sampled from the pool of houses that are not in our hand and not already
 * sold. A small bias makes the sharper opponents assume rivals play strong
 * cards when the top check is fat.
 */
export function decideSellingPick(
  state: GameState,
  player: Player,
  difficulty: Difficulty,
): number {
  const selling = state.selling
  if (!selling || player.houses.length === 0) return -1
  if (player.houses.length === 1) return player.houses[0].id

  const ownValues = new Set(player.houses.map((house) => house.value))
  const sold = new Set(state.soldHouses)
  const pool = ALL_HOUSE_VALUES.filter(
    (value) => !ownValues.has(value) && !sold.has(value),
  )
  const opponentCards = state.players.reduce(
    (sum, entry) => sum + entry.houses.length,
    0,
  ) - player.houses.length

  const sharp = difficulty === 'sharp'
  const trials = sharp ? 280 : 130
  const bias = sharp ? 2.1 : 0.35
  const checks = selling.checks
  const maxCheckIndex = checks.length - 1

  const totals = new Map<number, number>()
  player.houses.forEach((house) => totals.set(house.id, 0))

  for (let trial = 0; trial < trials; trial += 1) {
    const rivals = drawOpponentCards(pool, opponentCards, bias)
    for (const house of player.houses) {
      let better = 0
      for (const rival of rivals) {
        if (rival > house.value) better += 1
      }
      const check = checks[Math.min(better, maxCheckIndex)]
      totals.set(house.id, (totals.get(house.id) ?? 0) + check.value)
    }
  }

  let bestId = player.houses[0].id
  let bestScore = Number.NEGATIVE_INFINITY
  const jitter = sharp ? 0.18 : 0.65

  player.houses.forEach((house) => {
    const expected = (totals.get(house.id) ?? 0) / trials
    // When two plays are effectively equal, spend the cheaper house.
    const score =
      expected +
      (Math.random() * 2 - 1) * jitter -
      house.value * 0.004
    if (score > bestScore) {
      bestScore = score
      bestId = house.id
    }
  })

  return bestId
}
