import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Clock from "@/components/Clock";
import Ticker from "@/components/Ticker";
import BlackHole from "@/components/BlackHole";
import { INTRO, TICKER, TICKER_SMALL, LINKS, CLUB } from "@/lib/content";

/** Arrow used on the outbound action. */
function Out() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export default function HomePage() {
  const thisYear = new Date().getFullYear();

  return (
    <>
      <Reveal />
      <Nav />

      <main id="top">
        {/* One screen. Name, one line, one action, the clock, and the words
            running across the bottom. */}
        <section className="void">
          <BlackHole />

          <div className="wrap void-in">
            <div>
              <h1 className="mega" data-reveal="lines">
                <span className="mega-line">
                  <span>Learn to win</span>
                </span>
                <span className="mega-line">
                  <span className="serif">hackathons.</span>
                </span>
              </h1>

              <p className="hero-line">{INTRO}</p>

              <div className="hero-cta">
                <a className="slab" href={LINKS.signup} target="_blank" rel="noopener noreferrer">
                  <span>Join the club</span>
                  <i aria-hidden>
                    <Out />
                  </i>
                </a>
              </div>
            </div>

            <Clock />
          </div>

          <div className="tickers" data-reveal>
            <Ticker words={TICKER} dir="left" speed={46} size="lg" />
            <Ticker words={TICKER_SMALL} dir="right" speed={32} size="sm" />
          </div>

          <p className="foot" aria-hidden>
            © {thisYear} {CLUB} · San Jose, California
          </p>
        </section>
      </main>
    </>
  );
}
