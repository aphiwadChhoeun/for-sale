import { Modal } from './Modal'
import { IconCheck, IconChevronDown, IconGavel, IconSparkle } from './Icons'

interface RulesModalProps {
  onClose: () => void
}

export function RulesModal({ onClose }: RulesModalProps) {
  return (
    <Modal labelledBy="rules-title" onClose={onClose} className="modal--rules">
      <header className="rules__header">
        <span className="eyebrow">
          <IconSparkle size={13} /> The short version
        </span>
        <h2 id="rules-title">How to play For Sale</h2>
        <p>
          Two phases. Thirty houses. One table of rivals. Buy low, flip high, and finish
          with the fattest wallet.
        </p>
      </header>

      <div className="rules__scroll">
        <section className="rules__setup">
          <div className="rules__setup-cell">
            <span className="eyebrow">Start with</span>
            <strong>$18,000</strong>
            <span>at 3–4 players</span>
          </div>
          <div className="rules__setup-cell">
            <span className="eyebrow">Start with</span>
            <strong>$14,000</strong>
            <span>at 5–6 players</span>
          </div>
          <div className="rules__setup-cell">
            <span className="eyebrow">House values</span>
            <strong>1–30</strong>
            <span>one of each</span>
          </div>
          <div className="rules__setup-cell">
            <span className="eyebrow">Check values</span>
            <strong>$0–15k</strong>
            <span>2 voids · pairs $2k–15k</span>
          </div>
        </section>

        <div className="rules__grid">
          <section className="rules__section">
            <span className="rules__num">01</span>
            <h3>
              <IconGavel size={18} /> The buying phase
            </h3>
            <p>
              Each round, one house per player goes on the block, lowest to highest.
              Starting with the opener, players either raise the bid or pass. Cash stays
              secret; the bid on the table does not.
            </p>
            <ul>
              <li>Bids go up in $1,000 steps. You can open at any amount.</li>
              <li>
                <strong>Pass:</strong> take the lowest house left. You get half your bid
                back, rounded down — so a $5,000 bid costs $3,000.
              </li>
              <li>
                <strong>No bid yet?</strong> Passing is free. You still take the lowest
                house on the table.
              </li>
              <li>
                <strong>Last player in:</strong> pay the full bid and take the highest
                house. You open the next lot.
              </li>
            </ul>
          </section>

          <section className="rules__section">
            <span className="rules__num">02</span>
            <h3>
              <IconCheck size={18} /> The sell-off
            </h3>
            <p>
              When every house has been bought, the checks come out. Each round reveals
              one check per player, from the biggest prize down.
            </p>
            <ul>
              <li>Everyone secretly picks one house from their hand.</li>
              <li>All picks reveal at once.</li>
              <li>
                The highest house takes the highest check, the next house takes the next
                check, and so on.
              </li>
              <li>Sold houses leave the game. Every house gets sold exactly once.</li>
            </ul>
          </section>
        </div>

        <section className="rules__winning">
          <div>
            <span className="eyebrow">The final tally</span>
            <h3>Checks + unspent cash = your fortune.</h3>
            <p>
              The richest player wins. Level on money? The player with the most cash left
              takes it. Still level? The crown is shared.
            </p>
          </div>
          <div className="rules__winning-mark">
            <span>$</span>
          </div>
        </section>

        <section className="rules__tips">
          <span className="eyebrow">
            <IconSparkle size={12} /> Table wisdom
          </span>
          <div className="rules__tips-row">
            <p>A house is only worth the check it can win. Don't overpay for a trophy.</p>
            <p>Passing for free is a real move — the cheapest house can still earn.</p>
            <p>In the sell-off, spend a strong house when the top check is fat.</p>
          </div>
        </section>

        <footer className="rules__footer">
          <span>
            For Sale by Stefan Dorra · Digital edition uses $1,000 units. 4-player games
            remove 2 cards from each deck; 3-player games remove 6.
          </span>
          <a
            href="https://iellogames.com/wp-content/uploads/2020/07/For-Sale_Rulebook_EN_V2.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-btn"
          >
            Official rulebook <IconChevronDown size={13} className="icon--rotate" />
          </a>
        </footer>
      </div>
    </Modal>
  )
}
