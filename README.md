# For Sale — Digital Edition

A single-player digital adaptation of Stefan Dorra's auction classic, built with
React, TypeScript, Vite and Framer Motion.

Buy the best houses when the market is quiet, then flip them for a fortune.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`).

```bash
npm run build    # type-check + production bundle
npm run preview  # serve the production build
npm run test     # engine / AI simulation tests
npm run lint
```

## Features

- **3–6 players** against AI rivals, with Casual and Cutthroat difficulty.
- **The complete two-phase game**: open ascending auctions, half-bid refunds,
  hidden cash and hidden portfolios, simultaneous sell-off, check assignment,
  and the official tiebreak.
- **30 unique houses**, illustrated procedurally with mid-century palettes and
  architecture, plus a hand-drawn check deck with two void checks.
- **Snappy table feel**: spring-physics card fans, deal animations, a real-time
  bid rail, sound, and a fast AI cadence.
- **Responsive** from a wide desktop down to a 375 px phone.
- **Accessible**: keyboard bidding, focus-trapped dialogs, live announcements,
  reduced-motion support, and high-contrast primary information.
- **Local record**: settings, sound preference and win/loss tally persist in
  `localStorage`.
- **AI with teeth**: auction bids use risk-adjusted upgrade valuations; the
  sell-off uses Monte Carlo sampling over unseen hands.

## Controls

| Action | Input |
| --- | --- |
| Adjust bid | `↑` / `↓` or the +/−, slider and quick chips |
| Place bid | `Enter` or **Bid** |
| Pass | `P` or **Pass** |
| Sell a house | Select it, then **Sell it** |
| Close a dialog | `Escape` |

The bid amount is always clamped between the next legal bid and the cash in your
wallet.

## Rules in one screen

- Each player starts with **$18,000** in a 3–4 player game or **$14,000** in a
  5–6 player game. The digital edition uses $1,000 units.
- A 3-player game removes 6 houses and 6 checks; a 4-player game removes 2 of
  each; 5–6 player games use all 30.
- **Buying:** reveal one house per player. Take turns bidding higher or passing.
  Passing takes the lowest remaining house and refunds half your bid, rounded
  down — so a $5,000 bid costs $3,000. Passing before you bid is free. The last
  player in pays their full bid, takes the highest house, and opens the next lot.
- **Selling:** reveal one check per player. Everyone secretly picks a house, then
  all reveal at once. Highest house takes the highest check, and so on. Repeat
  until every house is sold.
- **Winner:** checks + unspent cash. Ties go to the most cash left; then the
  victory is shared.

The in-game **How to play** dialog links to the official rulebook.

## Project structure

```text
src/
  game/
    engine.ts       pure, serializable rules engine + setup
    ai.ts           auction valuations and Monte Carlo sell-off choices
    types.ts        game state, actions and cards
    constants.ts    player counts, money, timings
    sound.ts        synthesized WebAudio cues (no audio files)
    engine.test.ts  full-game invariant simulations for 3–6 players
  components/       cards, seats, auction/selling views, menu, modals
  styles/           base, cards, menu, game, overlays
```

The deck and check values are created from the official distribution; the
engine and AI are fully separated from React so the rules can be simulated
headlessly.

## Credit

**For Sale** was designed by **Stefan Dorra**. This is a fan-made digital
adaptation built for demonstration and play; it is not affiliated with or
endorsed by the designer or publisher. The house and check illustrations are
original procedural artwork created for this project.
