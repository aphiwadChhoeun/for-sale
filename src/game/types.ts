export type Difficulty = 'casual' | 'sharp'

export type Phase = 'buying' | 'selling' | 'gameover'

export interface HouseCard {
  id: number
  value: number
}

export interface CheckCard {
  id: number
  value: number
}

export interface Player {
  id: string
  name: string
  isHuman: boolean
  avatar: number
  aggression: number
  cash: number
  houses: HouseCard[]
  checks: CheckCard[]
  /** Total bid committed in the current auction, in thousands. */
  bid: number
  /** Amount actually paid for the house received in the current auction. */
  paid: number
  passed: boolean
}

export interface AuctionResult {
  playerId: string
  house: HouseCard
  cost: number
  bid: number
}

export interface Auction {
  houses: HouseCard[]
  turn: number
  startPlayer: number
  currentBid: number
  highBidder: string | null
  resolved: AuctionResult | null
  round: number
}

export type SellingStep = 'choose' | 'reveal' | 'results'

export interface SellResult {
  playerId: string
  house: HouseCard
  check: CheckCard
  rank: number
}

export interface SellingRound {
  checks: CheckCard[]
  picks: Record<string, number>
  step: SellingStep
  results: SellResult[] | null
  round: number
}

export type NoticeKind = 'deal' | 'bid' | 'pass' | 'won' | 'reveal' | 'sold' | 'info' | 'gameover'

export interface Notice {
  id: number
  kind: NoticeKind
  text: string
  detail?: string
  playerId?: string
}

export interface GameSettings {
  playerCount: number
  difficulty: Difficulty
}

export interface GameState {
  phase: Phase
  players: Player[]
  houseDeck: HouseCard[]
  checkDeck: CheckCard[]
  auction: Auction | null
  selling: SellingRound | null
  /** Houses already revealed and sold in phase two. */
  soldHouses: number[]
  round: number
  totalRounds: number
  notice: Notice | null
  noticeSeq: number
  winners: string[]
  settings: GameSettings
}

export type BidAction = { amount: number } | { pass: true }

export type GameAction =
  | { type: 'BID'; playerId: string; amount: number }
  | { type: 'PASS'; playerId: string }
  | { type: 'END_AUCTION' }
  | { type: 'SELL_PICK'; playerId: string; houseId: number }
  | { type: 'SHOW_RESULTS' }
  | { type: 'FINISH_SELLING' }
